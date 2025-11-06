

import express from 'express';
import * as path from 'path';
import dotenv from 'dotenv';
import * as rabbitmq from '../../../packages/libs/rabbitmq';
import { startNotificationConsumers } from './consumers/notification.consumer';
import { testEmailConfig } from './services/email.service';

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'notification-service',
    timestamp: new Date().toISOString(),
    rabbitmq: rabbitmq.connection.isConnected() ? 'connected' : 'disconnected',
  });
});

// API info endpoint
app.get('/', (_req, res) => {
  res.json({
    service: 'Notification Service',
    version: '1.0.0',
    description: 'Handles email notifications via RabbitMQ',
  });
});

const port = process.env.NOTIFICATION_SERVICE_PORT || 6009;

// Start the service
const startService = async () => {
  try {
    console.log('🚀 Starting Notification Service...');

    // Test email configuration
    console.log('📧 Testing email configuration...');
    const emailConfigOk = await testEmailConfig();
    if (!emailConfigOk) {
      console.error('❌ Email configuration test failed');
      console.warn('⚠️ Service will continue, but emails may not be sent');
    }

    // Connect to RabbitMQ
    console.log('🔌 Connecting to RabbitMQ...');
    await rabbitmq.connection.connect();

    // Start notification consumers
    await startNotificationConsumers();

    // Start Express server
    app.listen(port, () => {
      console.log(`✅ Notification Service is running on port ${port}`);
      console.log(`📍 Health check: http://localhost:${port}/health`);
      console.log(`📍 Info: http://localhost:${port}/`);
    });

    console.log('✅ Notification Service started successfully');
  } catch (error: any) {
    console.error('❌ Failed to start Notification Service:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️ Shutting down Notification Service...');
  await rabbitmq.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️ Shutting down Notification Service...');
  await rabbitmq.connection.close();
  process.exit(0);
});

// Start the service
startService();
