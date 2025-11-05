/**
 * Notification Service
 *
 * This service handles all notifications:
 * - Email notifications (Nodemailer)
 * - In-app notifications
 * - SMS notifications (future)
 * - Push notifications (future)
 *
 * It listens to RabbitMQ events from other services and sends appropriate notifications.
 */

import express from 'express';
import * as path from 'path';
import dotenv from 'dotenv';
import { startConsumer, stopConsumer } from './consumers/notification.consumer';
import { verifyEmailConnection } from './services/email.service';

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'notification-service',
    timestamp: new Date().toISOString()
  });
});

// API info endpoint
app.get('/api', (_req, res) => {
  res.json({
    message: 'Notification Service is running',
    features: [
      'Email notifications',
      'In-app notifications',
      'Event-driven architecture via RabbitMQ'
    ]
  });
});

const port = process.env.NOTIFICATION_SERVICE_PORT || 6009;

// Start the service
const startService = async () => {
  try {
    console.log('🚀 Starting Notification Service...');

    // Verify email configuration
    const emailReady = await verifyEmailConnection();
    if (!emailReady) {
      console.warn('⚠️ Email service not configured properly. Check your SMTP settings.');
      console.warn('   Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in your .env file');
    }

    // Start RabbitMQ consumer
    await startConsumer();

    // Start Express server
    const server = app.listen(port, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📧 Notification Service`);
      console.log(`🌐 Port: ${port}`);
      console.log(`🏥 Health: http://localhost:${port}/health`);
      console.log(`📬 Status: Listening for events from RabbitMQ`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n🛑 Shutting down Notification Service...');
      await stopConsumer();
      server.close(() => {
        console.log('✅ Notification Service stopped');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

  } catch (error: any) {
    console.error('❌ Failed to start Notification Service:', error.message);
    process.exit(1);
  }
};

// Start the service
startService();
