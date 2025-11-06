/**
 * Payment Service Controller
 *
 * Handles all payment-related operations using Razorpay.
 * Separates payment logic from order management.
 */

import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { PrismaClient } from ".prisma/payment-client";
import { AuthError, ValidationError } from "../../../../packages/error-handler";
import razorpay from "../../../../packages/libs/razorpay";
import * as rabbitmq from "../../../../packages/libs/rabbitmq";
import { fetchUserById } from "../utils/fetchUser";

const prisma = new PrismaClient();

const toPaise = (amount: number) => Math.round(Number(amount) * 100);

/**
 * Create Razorpay payment order
 * Called by Order Service when user initiates payment
 */
export const createPaymentOrder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      orderId,
      amount, // Amount in rupees
      currency = "INR",
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      throw new AuthError("User not authenticated");
    }

    if (!orderId || !amount || amount <= 0) {
      throw new ValidationError("Order ID and valid amount are required");
    }

    // Convert amount to paise for Razorpay
    const amountInPaise = toPaise(amount);

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        currency,
        status: "PENDING",
      },
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: payment.id,
      notes: {
        orderId,
        paymentId: payment.id,
      },
    });

    // Update payment with Razorpay order ID
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    console.log(`✅ Payment order created: ${payment.id}`);

    res.status(201).json({
      success: true,
      data: {
        paymentId: updatedPayment.id,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency,
      },
    });
  } catch (error: any) {
    console.error("❌ Create payment order error:", error.message);
    next(error);
  }
};

/**
 * Verify Razorpay payment signature
 * Called after user completes payment on frontend
 */
export const verifyPayment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId, // Our internal payment ID
      orderNumber, // Order number (optional)
      items, // Order items (optional)
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !paymentId
    ) {
      throw new ValidationError("Missing required payment verification fields");
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    // Update payment record
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: isValid ? "SUCCESS" : "FAILED",
      },
    });

    if (isValid) {
      console.log(`✅ Payment verified successfully: ${paymentId}`);

      // Fetch user data from database
      const user = await fetchUserById(payment.userId);
      const userEmail = user?.email || "customer@example.com";
      const userName = user?.name || "Customer";

      console.log(`📧 Sending payment notification to: ${userEmail}`);

      // 🚀 Publish payment success event to RabbitMQ for notification service
      // Using ORDER_PAID queue to trigger email notification
      try {
        await rabbitmq.publisher.publishToQueue(
          rabbitmq.QueueNames.ORDER_PAID,
          {
            eventId: `order-paid-${Date.now()}`,
            timestamp: new Date().toISOString(),
            data: {
              // Required fields for email notification
              email: userEmail,
              customerName: userName,
              orderId: payment.orderId,
              orderNumber: orderNumber || `ORD-${payment.orderId.slice(-8).toUpperCase()}`,
              amount: payment.amount,
              paymentId: razorpay_payment_id,
              // Optional: Pass items if available
              items: items || [],
            },
          }
        );
        console.log(`✅ Payment notification sent to queue: ORDER_PAID for ${userEmail}`);
      } catch (error: any) {
        console.error(`❌ Failed to publish payment notification:`, error.message);
        // Don't fail the payment verification if notification fails
      }

      // Also publish to PAYMENT_VERIFIED queue for other services
      try {
        await rabbitmq.publisher.publishToQueue(
          rabbitmq.QueueNames.PAYMENT_VERIFIED,
          {
            eventId: `payment-verified-${Date.now()}`,
            timestamp: new Date().toISOString(),
            data: {
              paymentId: payment.id,
              orderId: payment.orderId,
              userId: payment.userId,
              amount: payment.amount,
              razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              status: "SUCCESS",
            },
          }
        );
      } catch (error: any) {
        console.error(`❌ Failed to publish payment verified event:`, error.message);
      }

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
          paymentId: payment.id,
          orderId: payment.orderId,
          status: payment.status,
        },
      });
    } else {
      console.error(`❌ Payment verification failed: ${paymentId}`);

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data: {
          paymentId: payment.id,
          status: payment.status,
        },
      });
    }
  } catch (error: any) {
    console.error("❌ Verify payment error:", error.message);
    next(error);
  }
};

/**
 * Capture payment (for manual capture flow)
 * Only use if Razorpay account is configured for manual capture
 */
export const capturePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId, razorpayPaymentId, amount, currency = "INR" } = req.body;

    if (!paymentId || !razorpayPaymentId || !amount) {
      throw new ValidationError(
        "Payment ID, Razorpay Payment ID, and amount are required"
      );
    }

    // Get payment from database
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new ValidationError("Payment not found");
    }

    if (payment.status !== "SUCCESS") {
      throw new ValidationError("Payment is not in SUCCESS state");
    }

    // Capture payment via Razorpay
    const amountInPaise = toPaise(amount);
    const capturedPayment = await razorpay.payments.capture(
      razorpayPaymentId,
      amountInPaise,
      currency
    );

    console.log(`✅ Payment captured: ${paymentId}`);

    res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      data: capturedPayment,
    });
  } catch (error: any) {
    console.error("❌ Capture payment error:", error.message);
    next(error);
  }
};

/**
 * Get payment details by ID
 */
export const getPayment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthError("User not authenticated");
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new ValidationError("Payment not found");
    }

    // Ensure user can only access their own payments
    if (payment.userId !== userId) {
      throw new AuthError("Unauthorized access to payment");
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    console.error("❌ Get payment error:", error.message);
    next(error);
  }
};

/**
 * Get all payments for a user
 */
export const getUserPayments = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthError("User not authenticated");
    }

    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { userId };
    if (status) filter.status = status;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: filter,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.count({ where: filter }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        payments,
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
    console.error("❌ Get user payments error:", error.message);
    next(error);
  }
};

/**
 * Initiate refund
 */
export const initiateRefund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId) {
      throw new ValidationError("Payment ID is required");
    }

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new ValidationError("Payment not found");
    }

    if (payment.status !== "SUCCESS") {
      throw new ValidationError("Can only refund successful payments");
    }

    if (!payment.razorpayPaymentId) {
      throw new ValidationError("Razorpay payment ID not found");
    }

    // Create refund in Razorpay
    const refundAmount = amount ? toPaise(amount) : toPaise(payment.amount);
    const razorpayRefund = await razorpay.payments.refund(
      payment.razorpayPaymentId,
      {
        amount: refundAmount,
      }
    );

    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        paymentId,
        orderId: payment.orderId,
        amount: amount || payment.amount,
        reason,
        status: razorpayRefund.status,
        razorpayRefundId: razorpayRefund.id,
      },
    });

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "REFUNDED" },
    });

    console.log(`✅ Refund initiated: ${refund.id}`);

    res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
      data: refund,
    });
  } catch (error: any) {
    console.error("❌ Initiate refund error:", error.message);
    next(error);
  }
};
