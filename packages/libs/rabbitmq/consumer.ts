/**
 * RabbitMQ Consumer
 *
 * Consumes messages from RabbitMQ queues.
 * Handles message acknowledgment, error handling, and retry logic.
 */

import * as rabbitmqConnection from "./connection";
import amqp from "amqplib";

/**
 * Message handler function type
 */
export type MessageHandler = (message: any) => Promise<void>;

/**
 * Consumer options
 */
export interface ConsumerOptions {
  queueName: string;
  handler: MessageHandler;
  prefetchCount?: number; // Number of messages to prefetch (default: 1)
  autoAck?: boolean; // Auto acknowledge messages (default: false)
  retryOnError?: boolean; // Retry on error (default: true)
  maxRetries?: number; // Max retry attempts (default: 3)
}

/**
 * Start consuming messages from a queue
 */
export const consume = async (options: ConsumerOptions): Promise<void> => {
  const {
    queueName,
    handler,
    prefetchCount = 1,
    autoAck = false,
    retryOnError = true,
    maxRetries = 3,
  } = options;

  try {
    // Ensure RabbitMQ is connected
    if (!rabbitmqConnection.isConnected()) {
      console.log("⚠️ RabbitMQ not connected, connecting...");
      await rabbitmqConnection.connect();
    }

    const channel = rabbitmqConnection.getChannel();

    if (!channel) {
      console.error("❌ RabbitMQ channel not available");
      return;
    }

    // Assert queue exists without specifying arguments
    // This allows consuming from queues with any configuration
    // The queue should be created by the publisher with the correct arguments
    await channel.assertQueue(queueName, {
      durable: true,
      // Don't specify arguments here - accept whatever the publisher created
    });

    // Set prefetch count (how many messages to process at once)
    channel.prefetch(prefetchCount);

    console.log(`👂 Started consuming from queue: ${queueName}`);

    // Start consuming
    await channel.consume(
      queueName,
      async (msg) => {
        if (!msg) {
          console.warn("⚠️ Received null message");
          return;
        }

        try {
          // Parse message content
          const content = msg.content.toString();
          const parsedMessage = JSON.parse(content);

          console.log(`📨 Received message from queue: ${queueName}`);
          console.log(`📦 Message:`, parsedMessage);

          // Call the handler
          await handler(parsedMessage);

          // Acknowledge message if not auto-ack
          if (!autoAck) {
            channel.ack(msg);
            console.log(`✅ Message acknowledged`);
          }
        } catch (error: any) {
          console.error(`❌ Error processing message:`, error.message);

          // Handle retry logic
          if (retryOnError && msg.fields.deliveryTag) {
            const retryCount = getRetryCount(msg);

            if (retryCount < maxRetries) {
              console.log(
                `🔄 Retrying message (${retryCount + 1}/${maxRetries})...`
              );

              // Reject and requeue the message
              channel.nack(msg, false, true);
            } else {
              console.error(
                `❌ Max retries reached. Moving message to dead letter queue.`
              );

              // Reject without requeue (moves to dead letter queue if configured)
              channel.nack(msg, false, false);
            }
          } else {
            // Acknowledge to remove from queue
            if (!autoAck) {
              channel.nack(msg, false, false);
            }
          }
        }
      },
      {
        noAck: autoAck,
      }
    );

    console.log(`✅ Consumer registered for queue: ${queueName}`);
  } catch (error: any) {
    console.error(`❌ Failed to start consumer for queue ${queueName}:`, error.message);
  }
};

/**
 * Get retry count from message headers
 */
const getRetryCount = (msg: amqp.Message): number => {
  const headers = msg.properties.headers || {};
  return headers["x-retry-count"] || 0;
};

/**
 * Stop consuming from a queue
 */
export const stopConsume = async (consumerTag: string): Promise<void> => {
  try {
    const channel = rabbitmqConnection.getChannel();

    if (!channel) {
      console.error("❌ RabbitMQ channel not available");
      return;
    }

    await channel.cancel(consumerTag);
    console.log(`✅ Consumer stopped: ${consumerTag}`);
  } catch (error: any) {
    console.error(`❌ Failed to stop consumer:`, error.message);
  }
};

/**
 * Helper: Consume from multiple queues
 */
export const consumeMultiple = async (
  consumersOptions: ConsumerOptions[]
): Promise<void> => {
  console.log(`🚀 Starting ${consumersOptions.length} consumers...`);

  const promises = consumersOptions.map((options) => consume(options));

  await Promise.all(promises);

  console.log(`✅ All consumers started successfully`);
};
