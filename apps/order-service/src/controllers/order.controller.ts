// controllers/payments.controller.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto"; // ← add this
import { prisma } from "../../../../packages/libs/prisma";
import { AuthError, ValidationError } from "../../../../packages/error-handler";
import razorpay from "../../../../packages/libs/razorpay";

const toPaise = (r: number) => Math.round(Number(r) * 100);

// CREATE
// export const createRazorpayOrder = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { amountPaise, cartItems, currency = "INR", notes } = req.body;
//     const userId = req.user?.id;
//     if (!userId) throw new AuthError("User not authenticated");
//     if (!amountPaise || typeof amountPaise !== "number" || amountPaise <= 0) {
//       throw new ValidationError("amountPaise must be a positive number");
//     }

//     const orderRecord = await prisma.order.create({
//       data: {
//         userId,
//         amountPaisePaise: toPaise(amountPaise),
//         currency,
//         notes,
//         status: "CREATED",
//         cartItems,
//       },
//     });

//     const rzpOrder = await razorpay.orders.create({
//       amountPaise: orderRecord.amountPaisePaise,
//       currency,
//       receipt: orderRecord.id,
//       notes,
//     });

//     await prisma.order.update({
//       where: { id: orderRecord.id },
//       data: { razorpayOrderId: rzpOrder.id, status: "ATTEMPTED" },
//     });

//     // return internal orderId so client can send it during verify
//     res.json({
//       key: process.env.RAZORPAY_KEY_ID,
//       order: rzpOrder,
//       orderId: orderRecord.id,
//     });
//   } catch (error) {
//     console.error("Create order error:", error);
//     next(error);
//   }
// };

export const createRazorpayOrder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      amountPaise, // amountPaise to pay in paise
      subtotal, // subtotal of items
      itemsCount, // number of items
      shipping = 0,
      total, // total amountPaise in rupees
      cartItems, // array of items [{id, quantity, salePrice }]
      currency = "INR",
      addressId,
    } = req.body;
    console.log(
      "-------------------->",
      req.body,
      "<----------------------------------"
    );
    const userId = req.user?.id;
    if (!userId) throw new AuthError("User not authenticated");

    // if (!amountPaise || typeof amountPaise !== "number" || amountPaise <= 0) {
    //   throw new ValidationError("amountPaise must be a positive number");
    // }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new ValidationError("Cart items are required");
    }

    // Create order in local DB
    const orderRecord = await prisma.order.create({
      data: {
        userId,
        addressId,
        amountPaise: amountPaise,
        currency,
        subtotal,
        shipping,
        total,
        itemsCount,
        status: "CREATED",
        orderItems: {
          create: cartItems.map((item: any) => ({
            productId: item.id,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity, // changed 'quantity' to 'qty'
            price: item.salePrice,
            // If 'product' relation is required, add it here as needed
          })),
        },
      },
    });

    // Create order in Razorpay
    const rzpOrder = await razorpay.orders.create({
      amount: orderRecord.amountPaise,
      currency,
      receipt: orderRecord.id,
    });

    // Update order with Razorpay order ID
    await prisma.order.update({
      where: { id: orderRecord.id },
      data: { razorpayOrderId: rzpOrder.id, status: "ATTEMPTED" },
    });

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      order: rzpOrder,
      orderId: orderRecord.id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    next(error);
  }
};
// VERIFY (signature check only; no capture here)
export const verifyRazorpayPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body ?? {};
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      throw new ValidationError("Missing required fields");
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const ok = expected === razorpay_signature;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        signatureVerified: ok,
        status: ok ? "PAID" : "FAILED",
      },
    });

    return res.json({ success: ok, orderId: updated.id });
  } catch (error) {
    console.error("Verify error:", error);
    next(error);
  }
};

// CAPTURE (use only when your flow is manual capture)
export const captureRazorpayPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      orderId,
      paymentId,
      amountPaise,
      currency = "INR",
    } = req.body ?? {};
    if (!paymentId || !amountPaise || !orderId) {
      throw new ValidationError("orderId, paymentId and amountPaise required");
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ValidationError("Order not found");

    // prevent capture if signature not verified / already captured
    if (!order.signatureVerified || order.status === "CAPTURED") {
      throw new ValidationError("Payment not eligible for capture");
    }

    // sanity check amountPaises
    if (toPaise(amountPaise) !== order.amountPaise) {
      throw new ValidationError("amountPaise mismatch for capture");
    }

    const captured = await razorpay.payments.capture(
      paymentId,
      order.amountPaise,
      currency
    );

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CAPTURED" },
    });

    res.json({ success: true, captured });
  } catch (error) {
    console.error("Capture error:", error);
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get query parameters for pagination and filtering
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;

    // Fetch orders from MongoDB with related data
    const orders = await prisma.order.findMany({
      where: filter,
      skip: skip,
      take: Number(limit),
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        address: {
          select: {
            city: true,
            state: true,
            pincode: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                title: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get total count for pagination
    const totalOrders = await prisma.order.count({ where: filter });

    // Transform data to match desired response format
    const transformedOrders = orders.map((order) => {
      // Generate timeline based on order status
      const generateTimeline = (
        status: string,
        createdAt: Date,
        updatedAt: Date
      ) => {
        const timeline = [
          {
            status: "Order Confirmed",
            date: createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            completed: true,
          },
          {
            status: "Processing",
            date:
              status !== "PENDING"
                ? updatedAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
            completed: status !== "PENDING",
          },
          {
            status: "Shipped",
            date:
              status === "SHIPPED" || status === "DELIVERED"
                ? updatedAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
            completed: status === "SHIPPED" || status === "DELIVERED",
          },
          {
            status: "Delivered",
            date:
              status === "DELIVERED"
                ? updatedAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
            completed: status === "DELIVERED",
          },
        ];
        return timeline;
      };

      return {
        id:
          order.id ||
          `ORD-${new Date(order.createdAt).getFullYear()}-${order.id
            .toString()
            .slice(-3)}`,
        customer: {
          name: order.user?.name || "N/A",
          email: order.user?.email || "N/A",
          phone: order.user?.phone || "N/A",
        },
        status: order.status.toLowerCase(),
        date: new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        total: order.total,
        items: order.itemsCount,
        address: {
          city: order.address?.city || "N/A",
          state: order.address?.state || "N/A",
          zip: order.address?.pincode || "N/A",
        },
        orderItems: order.orderItems.map((item: any) => ({
          name: item.product?.name || "N/A",
          sku: item.product?.sku || "N/A",
          price: item.price,
          qty: item.quantity,
        })),
        subtotal: order.subtotal,
        shipping: order.shipping,

        timeline: generateTimeline(
          order.status,
          order.createdAt,
          order.updatedAt
        ),
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        signatureVerified: order.signatureVerified,
      };
    });

    // Send response
    res.status(200).json({
      success: true,
      data: {
        orders: transformedOrders,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalOrders / Number(limit)),
          totalOrders,
          hasNextPage: skip + Number(limit) < totalOrders,
          hasPrevPage: Number(page) > 1,
        },
      },
      message: "Orders fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    next(error);
  }
};
