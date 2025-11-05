/**
 * Notification Handlers
 * Handles different types of notification events from RabbitMQ
 */

import { PrismaClient } from '.prisma/notification-client';
import { sendEmail } from '../services/email.service';
import * as emailTemplates from '../templates/email.templates';

const prisma = new PrismaClient();

/**
 * Handle ORDER_CREATED event
 * Sends confirmation email and creates in-app notification
 */
export const handleOrderCreated = async (data: any) => {
  try {
    console.log('📧 Handling ORDER_CREATED event:', data);

    const { orderId, userId, total, itemsCount } = data;

    // Get user email (you'll need to fetch from user service or pass in event)
    const userEmail = data.userEmail || process.env.TEST_EMAIL;
    const customerName = data.customerName || 'Customer';

    if (!userEmail) {
      console.warn('⚠️ No user email provided for order created notification');
      return;
    }

    // Send email
    await sendEmail({
      to: userEmail,
      subject: `Order Confirmed - ${orderId}`,
      html: emailTemplates.orderCreatedTemplate({
        orderId,
        customerName,
        total,
        itemsCount,
      }),
      userId,
      type: 'ORDER_CREATED',
    });

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'ORDER_CREATED',
        channel: 'IN_APP',
        title: 'Order Confirmed',
        message: `Your order #${orderId} has been confirmed. Total: ₹${total}`,
        data: { orderId, total, itemsCount },
      },
    });

    console.log('✅ Order created notification sent successfully');
  } catch (error: any) {
    console.error('❌ Error handling ORDER_CREATED:', error.message);
  }
};

/**
 * Handle PAYMENT_SUCCESS event
 */
export const handlePaymentSuccess = async (data: any) => {
  try {
    console.log('📧 Handling PAYMENT_SUCCESS event:', data);

    const { orderId, userId, total, paymentId } = data;

    const userEmail = data.userEmail || process.env.TEST_EMAIL;
    const customerName = data.customerName || 'Customer';

    if (!userEmail) {
      console.warn('⚠️ No user email provided for payment success notification');
      return;
    }

    // Send email
    await sendEmail({
      to: userEmail,
      subject: `Payment Successful - ${orderId}`,
      html: emailTemplates.paymentSuccessTemplate({
        orderId,
        customerName,
        total,
        paymentId,
      }),
      userId,
      type: 'PAYMENT_SUCCESS',
    });

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'PAYMENT_SUCCESS',
        channel: 'IN_APP',
        title: 'Payment Successful',
        message: `Your payment of ₹${total} has been received. Order #${orderId}`,
        data: { orderId, total, paymentId },
      },
    });

    console.log('✅ Payment success notification sent successfully');
  } catch (error: any) {
    console.error('❌ Error handling PAYMENT_SUCCESS:', error.message);
  }
};

/**
 * Handle PAYMENT_FAILED event
 */
export const handlePaymentFailed = async (data: any) => {
  try {
    console.log('📧 Handling PAYMENT_FAILED event:', data);

    const { orderId, userId } = data;

    const userEmail = data.userEmail || process.env.TEST_EMAIL;
    const customerName = data.customerName || 'Customer';

    if (!userEmail) {
      console.warn('⚠️ No user email provided for payment failed notification');
      return;
    }

    // Send email
    await sendEmail({
      to: userEmail,
      subject: `Payment Failed - ${orderId}`,
      html: emailTemplates.paymentFailedTemplate(orderId, customerName),
      userId,
      type: 'PAYMENT_FAILED',
    });

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'PAYMENT_FAILED',
        channel: 'IN_APP',
        title: 'Payment Failed',
        message: `Payment for order #${orderId} failed. Please try again.`,
        data: { orderId },
      },
    });

    console.log('✅ Payment failed notification sent successfully');
  } catch (error: any) {
    console.error('❌ Error handling PAYMENT_FAILED:', error.message);
  }
};

/**
 * Handle ORDER_SHIPPED event
 */
export const handleOrderShipped = async (data: any) => {
  try {
    console.log('📧 Handling ORDER_SHIPPED event:', data);

    const { orderId, userId, trackingNumber } = data;

    const userEmail = data.userEmail || process.env.TEST_EMAIL;
    const customerName = data.customerName || 'Customer';

    if (!userEmail) {
      console.warn('⚠️ No user email provided for order shipped notification');
      return;
    }

    // Send email
    await sendEmail({
      to: userEmail,
      subject: `Order Shipped - ${orderId}`,
      html: emailTemplates.orderShippedTemplate({
        orderId,
        customerName,
        trackingNumber,
      }),
      userId,
      type: 'ORDER_SHIPPED',
    });

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'ORDER_SHIPPED',
        channel: 'IN_APP',
        title: 'Order Shipped',
        message: `Your order #${orderId} has been shipped and is on its way!`,
        data: { orderId, trackingNumber },
      },
    });

    console.log('✅ Order shipped notification sent successfully');
  } catch (error: any) {
    console.error('❌ Error handling ORDER_SHIPPED:', error.message);
  }
};

/**
 * Handle ORDER_DELIVERED event
 */
export const handleOrderDelivered = async (data: any) => {
  try {
    console.log('📧 Handling ORDER_DELIVERED event:', data);

    const { orderId, userId } = data;

    const userEmail = data.userEmail || process.env.TEST_EMAIL;
    const customerName = data.customerName || 'Customer';

    if (!userEmail) {
      console.warn('⚠️ No user email provided for order delivered notification');
      return;
    }

    // Send email
    await sendEmail({
      to: userEmail,
      subject: `Order Delivered - ${orderId}`,
      html: emailTemplates.orderDeliveredTemplate({
        orderId,
        customerName,
      }),
      userId,
      type: 'ORDER_DELIVERED',
    });

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'ORDER_DELIVERED',
        channel: 'IN_APP',
        title: 'Order Delivered',
        message: `Your order #${orderId} has been delivered. Enjoy your purchase!`,
        data: { orderId },
      },
    });

    console.log('✅ Order delivered notification sent successfully');
  } catch (error: any) {
    console.error('❌ Error handling ORDER_DELIVERED:', error.message);
  }
};

/**
 * Handle USER_REGISTERED event (Welcome email)
 */
export const handleUserRegistered = async (data: any) => {
  try {
    console.log('📧 Handling USER_REGISTERED event:', data);

    const { userId, email, name } = data;

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to My Shop!',
      html: emailTemplates.welcomeEmailTemplate(name || 'there'),
      userId,
      type: 'GENERAL',
    });

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'GENERAL',
        channel: 'IN_APP',
        title: 'Welcome!',
        message: 'Welcome to My Shop! Start exploring our amazing products.',
        data: {},
      },
    });

    console.log('✅ Welcome notification sent successfully');
  } catch (error: any) {
    console.error('❌ Error handling USER_REGISTERED:', error.message);
  }
};
