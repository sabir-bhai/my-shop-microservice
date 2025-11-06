/**
 * Notification Handlers
 *
 * Handles different types of notification events from RabbitMQ
 */

import {
  sendPaymentSuccessEmail,
  sendOrderConfirmationEmail,
} from "../services/email.service";

/**
 * Handle payment success notification
 */
export const handlePaymentSuccess = async (message: any): Promise<void> => {
  try {
    console.log(`-------------==========================
      --------------------------------------------------------------------------------------------------------------------
  🔔 Processing payment success notification...=============================`);

    const { data } = message;

    // Validate required fields
    if (!data.email || !data.customerName || !data.orderId) {
      throw new Error("Missing required fields in payment success message");
    }

    // Send payment success email
    await sendPaymentSuccessEmail({
      to: data.email,
      customerName: data.customerName,
      orderId: data.orderId,
      orderNumber:
        data.orderNumber || `ORD-${data.orderId.slice(-8).toUpperCase()}`,
      amount: data.amount || 0,
      paymentId: data.paymentId || "N/A",
      items: data.items || [],
    });

    console.log("✅ Payment success email sent successfully");
  } catch (error: any) {
    console.error(
      "❌ Error handling payment success notification:",
      error.message
    );
    throw error;
  }
};

/**
 * Handle order created notification
 */
export const handleOrderCreated = async (message: any): Promise<void> => {
  try {
    console.log("🔔 Processing order created notification...");

    const { data } = message;
    console.log("...................Notification msg.................", data);
    // Validate required fields
    if (!data.email || !data.customerName || !data.orderId) {
      throw new Error("Missing required fields in order created message");
    }

    // Send order confirmation email
    await sendOrderConfirmationEmail({
      to: data.email,
      customerName: data.customerName,
      orderId: data.orderId,
      orderNumber:
        data.orderNumber || `ORD-${data.orderId.slice(-8).toUpperCase()}`,
    });

    console.log("✅ Order confirmation email sent successfully");
  } catch (error: any) {
    console.error(
      "❌ Error handling order created notification:",
      error.message
    );
    throw error;
  }
};

/**
 * Handle generic email notification
 */
export const handleEmailNotification = async (message: any): Promise<void> => {
  try {
    console.log("🔔 Processing email notification...");

    const { data } = message;

    // Check the notification type
    if (data.type === "payment_success") {
      await handlePaymentSuccess(message);
    } else if (data.type === "order_created") {
      await handleOrderCreated(message);
    } else {
      console.warn("⚠️ Unknown email notification type:", data.type);
    }
  } catch (error: any) {
    console.error("❌ Error handling email notification:", error.message);
    throw error;
  }
};
