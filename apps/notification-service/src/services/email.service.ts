/**
 * Email Service
 *
 * Handles sending emails using Nodemailer
 */

import nodemailer from 'nodemailer';
import { renderPaymentSuccessEmail } from '../templates/email.templates';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send payment success email
 */
export const sendPaymentSuccessEmail = async (emailData: {
  to: string;
  customerName: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  paymentId: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const { html, subject } = renderPaymentSuccessEmail({
      customerName: emailData.customerName,
      orderId: emailData.orderId,
      orderNumber: emailData.orderNumber,
      amount: emailData.amount,
      paymentId: emailData.paymentId,
      items: emailData.items,
    });

    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM}>`,
      to: emailData.to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📧 To:', emailData.to);
    console.log('📝 Subject:', subject);

    return true;
  } catch (error: any) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (emailData: {
  to: string;
  customerName: string;
  orderId: string;
  orderNumber: string;
}): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM}>`,
      to: emailData.to,
      subject: `Order Confirmation - ${emailData.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Order Confirmed!</h1>
          <p>Hi ${emailData.customerName},</p>
          <p>Thank you for your order. We've received your order and will process it soon.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order Number:</strong> ${emailData.orderNumber}</p>
            <p><strong>Order ID:</strong> ${emailData.orderId}</p>
          </div>
          <p>You'll receive another email once your payment is confirmed.</p>
          <p>Thank you for shopping with us!</p>
          <p>Best regards,<br>${process.env.SMTP_FROM_NAME}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Order confirmation email sent:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send order confirmation email:', error.message);
    throw error;
  }
};

/**
 * Test email configuration
 */
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    // Verify connection configuration
    await transporter.verify();

    console.log('✅ Email server is ready to send emails');
    return true;
  } catch (error: any) {
    console.error('❌ Email server configuration error:', error.message);
    return false;
  }
};
