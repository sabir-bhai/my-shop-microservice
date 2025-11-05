/**
 * Order Service Controller (Refactored)
 *
 * Handles ONLY order-related operations.
 * Payment operations are handled by Payment Service.
 */

import { Request, Response, NextFunction } from "express";
import { PrismaClient } from ".prisma/order-client";
import { AuthError, ValidationError } from "../../../../packages/error-handler";
import * as rabbitmq from "../../../../packages/libs/rabbitmq";

const prisma = new PrismaClient();

/**
 * Create a new order
 * This creates the order but does NOT handle payment
 * Payment is handled by Payment Service
 */
export const createOrder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      subtotal,
      itemsCount,
      shipping = 0,
      total,
      cartItems,
      currency = "INR",
      addressId,
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      throw new AuthError("User not authenticated");
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new ValidationError("Cart items are required");
    }

    if (!addressId) {
      throw new ValidationError("Delivery address is required");
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        amountPaise: Math.round(total * 100), // Convert to paise
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
            quantity: item.quantity,
            price: item.salePrice,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log(`✅ Order created: ${order.id}`);

    // 🚀 Publish order created event to RabbitMQ
    await rabbitmq.publisher.publishOrderCreated({
      orderId: order.id,
      userId,
      addressId,
      total,
      itemsCount,
      status: "CREATED",
      cartItems,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: order.id,
        total: order.total,
        itemsCount: order.itemsCount,
        status: order.status,
      },
    });
  } catch (error: any) {
    console.error("❌ Create order error:", error.message);
    next(error);
  }
};

/**
 * Update order status after payment verification
 * This is called by Payment Service via RabbitMQ
 */
export const updateOrderStatus = async (
  orderId: string,
  paymentData: any
): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, status } = paymentData;

    await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayOrderId,
        razorpayPaymentId,
        signatureVerified: status === "SUCCESS",
        status: status === "SUCCESS" ? "PAID" : "FAILED",
      },
    });

    console.log(`✅ Order ${orderId} status updated to: ${status}`);
  } catch (error: any) {
    console.error(`❌ Update order status error:`, error.message);
    throw error;
  }
};

/**
 * Get all orders (Admin)
 */
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (status) filter.status = status;

    const orders = await prisma.order.findMany({
      where: filter,
      skip: skip,
      take: Number(limit),
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalOrders = await prisma.order.count({ where: filter });

    const transformedOrders = orders.map((order) => {
      const generateTimeline = (
        status: string,
        createdAt: Date,
        updatedAt: Date
      ) => {
        return [
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
              status !== "PENDING" && status !== "CREATED"
                ? updatedAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
            completed: status !== "PENDING" && status !== "CREATED",
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
      };

      return {
        id: order.id,
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
        orderItems: order.orderItems.map((item: any) => ({
          name: item.name,
          sku: item.sku,
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
  } catch (error: any) {
    console.error("❌ Error fetching orders:", error.message);
    next(error);
  }
};

/**
 * Get user's orders
 */
export const getUserOrders = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthError("User not authenticated");
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: Number(limit),
        include: {
          orderItems: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          total,
          hasNextPage: skip + Number(limit) < total,
          hasPrevPage: Number(page) > 1,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Get user orders error:", error.message);
    next(error);
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthError("User not authenticated");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new ValidationError("Order not found");
    }

    // Ensure user can only access their own orders
    if (order.userId !== userId) {
      throw new AuthError("Unauthorized access to order");
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("❌ Get order error:", error.message);
    next(error);
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthError("User not authenticated");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new ValidationError("Order not found");
    }

    if (order.userId !== userId) {
      throw new AuthError("Unauthorized access to order");
    }

    if (order.status === "DELIVERED" || order.status === "SHIPPED") {
      throw new ValidationError("Cannot cancel shipped or delivered order");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "FAILED" }, // Using FAILED as cancelled status
    });

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error: any) {
    console.error("❌ Cancel order error:", error.message);
    next(error);
  }
};
