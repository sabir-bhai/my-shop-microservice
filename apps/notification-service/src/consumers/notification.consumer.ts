/**
 * Notification Consumer
 *
 * Consumes notification events from RabbitMQ and processes them
 */

import * as rabbitmq from '../../../../packages/libs/rabbitmq';
import {
  handlePaymentSuccess,
  handleOrderCreated,
  handleEmailNotification,
} from '../handlers/notification.handlers';

/**
 * Start all notification consumers
 */
export const startNotificationConsumers = async (): Promise<void> => {
  console.log('🚀 Starting notification service consumers...');

  const consumers: Array<rabbitmq.ConsumerOptions> = [
    // Consumer for order paid events (payment success)
    {
      queueName: rabbitmq.QueueNames.ORDER_PAID,
      handler: handlePaymentSuccess,
      prefetchCount: 1,
      autoAck: false,
      retryOnError: true,
      maxRetries: 3,
    },

    // Consumer for order created events
    {
      queueName: rabbitmq.QueueNames.ORDER_CREATED,
      handler: handleOrderCreated,
      prefetchCount: 1,
      autoAck: false,
      retryOnError: true,
      maxRetries: 3,
    },

    // Consumer for generic email notifications
    {
      queueName: rabbitmq.QueueNames.SEND_EMAIL,
      handler: handleEmailNotification,
      prefetchCount: 1,
      autoAck: false,
      retryOnError: true,
      maxRetries: 3,
    },
  ];

  // Start all consumers
  for (const consumerOptions of consumers) {
    await rabbitmq.consumer.consume(consumerOptions);
  }

  console.log('✅ All notification consumers started successfully');
};
