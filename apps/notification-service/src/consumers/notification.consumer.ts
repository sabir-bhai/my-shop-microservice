/**
 * Notification Service RabbitMQ Consumer
 * Listens to events from other services and sends notifications
 */

import * as rabbitmq from '../../../../packages/libs/rabbitmq';
import * as handlers from '../handlers/notification.handlers';

/**
 * Start listening to notification events
 */
export const startConsumer = async () => {
  try {
    console.log('🚀 Starting Notification Service Consumer...');

    // Connect to RabbitMQ
    await rabbitmq.connection.connect();

    // Start consuming from multiple queues
    await rabbitmq.consumer.consumeMultiple([
      {
        queueName: 'order.created',
        handler: handlers.handleOrderCreated,
      },
      {
        queueName: 'payment.verified',
        handler: handlers.handlePaymentSuccess,
      },
      {
        queueName: 'payment.failed',
        handler: handlers.handlePaymentFailed,
      },
      {
        queueName: 'order.shipped',
        handler: handlers.handleOrderShipped,
      },
      {
        queueName: 'order.delivered',
        handler: handlers.handleOrderDelivered,
      },
      {
        queueName: 'user.registered',
        handler: handlers.handleUserRegistered,
      },
    ]);

    console.log('✅ Notification Service Consumer started successfully');
    console.log('📬 Listening for events:');
    console.log('   - order.created');
    console.log('   - payment.verified');
    console.log('   - payment.failed');
    console.log('   - order.shipped');
    console.log('   - order.delivered');
    console.log('   - user.registered');
  } catch (error: any) {
    console.error('❌ Failed to start Notification Consumer:', error.message);
    throw error;
  }
};

/**
 * Stop the consumer gracefully
 */
export const stopConsumer = async () => {
  try {
    await rabbitmq.connection.close();
    console.log('✅ Notification Consumer stopped gracefully');
  } catch (error: any) {
    console.error('❌ Error stopping consumer:', error.message);
  }
};
