/**
 * RabbitMQ Publisher
 *
 * Publishes messages to RabbitMQ exchanges and queues.
 * Handles message persistence, retry logic, and error handling.
 */

import * as rabbitmqConnection from "./connection";

/**
 * Queue names for different events
 */
export enum QueueNames {
  ORDER_CREATED = "order.created",
  ORDER_PAID = "order.paid",
  ORDER_FAILED = "order.failed",
  PAYMENT_VERIFIED = "payment.verified",
  SEND_EMAIL = "notification.email",
  SEND_SMS = "notification.sms",
}

/**
 * Exchange names
 */
export enum ExchangeNames {
  ORDERS = "orders",
  PAYMENTS = "payments",
  NOTIFICATIONS = "notifications",
}

/**
 * Message structure for type safety
 */
export interface MessagePayload {
  eventId: string;
  timestamp: string;
  data: any;
}

/**
 * Ensure queue exists (create if not exists)
 */
const assertQueue = async (queueName: string): Promise<boolean> => {
  try {
    const channel = rabbitmqConnection.getChannel();

    if (!channel) {
      console.error("❌ RabbitMQ channel not available");
      return false;
    }

    // Assert queue with durable option (survives broker restart)
    // Don't specify arguments to avoid PRECONDITION_FAILED errors
    // if queue already exists with different configuration
    await channel.assertQueue(queueName, {
      durable: true, // Queue survives broker restart
    });

    return true;
  } catch (error: any) {
    console.error(`❌ Failed to assert queue ${queueName}:`, error.message);
    return false;
  }
};

/**
 * Publish message to a queue
 */
export const publishToQueue = async (
  queueName: string,
  payload: MessagePayload
): Promise<boolean> => {
  try {
    if (!rabbitmqConnection.isConnected()) {
      console.warn("⚠️ RabbitMQ not connected, attempting to connect...");
      await rabbitmqConnection.connect();
    }

    const channel = rabbitmqConnection.getChannel();

    if (!channel) {
      console.error("❌ RabbitMQ channel not available");
      return false;
    }

    // Ensure queue exists
    const queueAsserted = await assertQueue(queueName);
    if (!queueAsserted) {
      return false;
    }

    // Convert payload to buffer
    const message = Buffer.from(JSON.stringify(payload));

    // Send message to queue
    const sent = channel.sendToQueue(queueName, message, {
      persistent: true, // Message survives broker restart
      contentType: "application/json",
      timestamp: Date.now(),
    });

    if (sent) {
      console.log(`✅ Message published to queue: ${queueName}`);
      console.log(`📦 Payload:`, payload);
      return true;
    } else {
      console.warn(`⚠️ Failed to publish message to queue: ${queueName}`);
      return false;
    }
  } catch (error: any) {
    console.error(
      `❌ Error publishing to queue ${queueName}:`,
      error.message
    );
    return false;
  }
};

/**
 * Publish message to an exchange (fan-out pattern)
 */
export const publishToExchange = async (
  exchangeName: string,
  routingKey: string,
  payload: MessagePayload
): Promise<boolean> => {
  try {
    if (!rabbitmqConnection.isConnected()) {
      console.warn("⚠️ RabbitMQ not connected, attempting to connect...");
      await rabbitmqConnection.connect();
    }

    const channel = rabbitmqConnection.getChannel();

    if (!channel) {
      console.error("❌ RabbitMQ channel not available");
      return false;
    }

    // Assert exchange (create if not exists)
    await channel.assertExchange(exchangeName, "topic", {
      durable: true,
    });

    // Convert payload to buffer
    const message = Buffer.from(JSON.stringify(payload));

    // Publish to exchange
    const published = channel.publish(exchangeName, routingKey, message, {
      persistent: true,
      contentType: "application/json",
      timestamp: Date.now(),
    });

    if (published) {
      console.log(
        `✅ Message published to exchange: ${exchangeName} with routing key: ${routingKey}`
      );
      return true;
    } else {
      console.warn(`⚠️ Failed to publish message to exchange: ${exchangeName}`);
      return false;
    }
  } catch (error: any) {
    console.error(
      `❌ Error publishing to exchange ${exchangeName}:`,
      error.message
    );
    return false;
  }
};

/**
 * Helper: Publish order created event
 */
export const publishOrderCreated = async (orderData: any): Promise<boolean> => {
  const payload: MessagePayload = {
    eventId: `order-created-${Date.now()}`,
    timestamp: new Date().toISOString(),
    data: orderData,
  };

  return publishToQueue(QueueNames.ORDER_CREATED, payload);
};

/**
 * Helper: Publish order paid event
 */
export const publishOrderPaid = async (orderData: any): Promise<boolean> => {
  const payload: MessagePayload = {
    eventId: `order-paid-${Date.now()}`,
    timestamp: new Date().toISOString(),
    data: orderData,
  };

  return publishToQueue(QueueNames.ORDER_PAID, payload);
};

/**
 * Helper: Publish email notification
 */
export const publishEmailNotification = async (
  emailData: any
): Promise<boolean> => {
  const payload: MessagePayload = {
    eventId: `email-${Date.now()}`,
    timestamp: new Date().toISOString(),
    data: emailData,
  };

  return publishToQueue(QueueNames.SEND_EMAIL, payload);
};

/**
 * Helper: Publish SMS notification
 */
export const publishSMSNotification = async (
  smsData: any
): Promise<boolean> => {
  const payload: MessagePayload = {
    eventId: `sms-${Date.now()}`,
    timestamp: new Date().toISOString(),
    data: smsData,
  };

  return publishToQueue(QueueNames.SEND_SMS, payload);
};
