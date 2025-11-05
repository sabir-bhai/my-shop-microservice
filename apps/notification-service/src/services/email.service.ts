/**
 * Email Service using Nodemailer
 * Handles all email sending functionality
 */

import nodemailer from 'nodemailer';
import { PrismaClient } from '.prisma/notification-client';

const prisma = new PrismaClient();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASSWORD, // Your email password or app password
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  userId?: string;
  type?: string;
}

/**
 * Send email and log to database
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Create email log entry
    const emailLog = await prisma.emailLog.create({
      data: {
        userId: options.userId,
        to: options.to,
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        subject: options.subject,
        body: options.html,
        type: options.type as any,
        status: 'PENDING',
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'My Shop'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    // Update email log with success
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    console.log(`✅ Email sent successfully to ${options.to}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Failed to send email to ${options.to}:`, error.message);

    // Update email log with failure
    try {
      await prisma.emailLog.updateMany({
        where: {
          to: options.to,
          status: 'PENDING',
        },
        data: {
          status: 'FAILED',
          error: error.message,
        },
      });
    } catch (dbError) {
      console.error('Failed to update email log:', dbError);
    }

    return false;
  }
};

/**
 * Verify SMTP connection
 */
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('✅ SMTP server is ready to send emails');
    return true;
  } catch (error: any) {
    console.error('❌ SMTP connection failed:', error.message);
    return false;
  }
};
