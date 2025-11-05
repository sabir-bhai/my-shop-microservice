/**
 * RabbitMQ Connection Manager
 *
 * Handles connection lifecycle, reconnection logic, and error handling.
 * Uses functional approach with closure to maintain state.
 */

import amqp from "amqplib";

// Connection state (private to this module)
let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;
let isConnecting: boolean = false;
let reconnectAttempts: number = 0;

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000; // 5 seconds

/**
 * Handle connection close and attempt reconnection
 */
const handleConnectionClose = async (): Promise<void> => {
  connection = null;
  channel = null;

  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    console.log(
      `🔄 Attempting to reconnect to RabbitMQ (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`
    );

    setTimeout(() => {
      connect();
    }, RECONNECT_DELAY);
  } else {
    console.error(
      "❌ Max reconnection attempts reached. Please restart the service."
    );
  }
};

/**
 * Connect to RabbitMQ server
 */
export const connect = async (): Promise<void> => {
  if (connection && channel) {
    console.log("✅ RabbitMQ already connected");
    return;
  }

  if (isConnecting) {
    console.log("⏳ RabbitMQ connection in progress...");
    return;
  }

  const rabbitmqUrl = process.env.RABBITMQ_URL;

  if (!rabbitmqUrl) {
    console.error("❌ RABBITMQ_URL not found in environment variables");
    return;
  }

  try {
    isConnecting = true;
    console.log("🔌 Connecting to RabbitMQ...");

    // Create connection
    connection = await amqp.connect(rabbitmqUrl);

    // Create channel
    channel = await connection.createChannel();

    // Reset reconnect attempts on successful connection
    reconnectAttempts = 0;

    console.log("✅ RabbitMQ connected successfully");

    // Handle connection close
    connection.on("close", () => {
      console.warn("⚠️ RabbitMQ connection closed");
      handleConnectionClose();
    });

    // Handle connection error
    connection.on("error", (error: Error) => {
      console.error("❌ RabbitMQ connection error:", error.message);
    });

    // Handle channel error
    channel.on("error", (error: Error) => {
      console.error("❌ RabbitMQ channel error:", error.message);
    });

    // Handle channel close
    channel.on("close", () => {
      console.warn("⚠️ RabbitMQ channel closed");
    });
  } catch (error: any) {
    console.error("❌ Failed to connect to RabbitMQ:", error.message);
    handleConnectionClose();
  } finally {
    isConnecting = false;
  }
};

/**
 * Get the active channel
 */
export const getChannel = (): amqp.Channel | null => {
  return channel;
};

/**
 * Get the active connection
 */
export const getConnection = (): amqp.Connection | null => {
  return connection;
};

/**
 * Check if connected
 */
export const isConnected = (): boolean => {
  return connection !== null && channel !== null;
};

/**
 * Close connection gracefully
 */
export const close = async (): Promise<void> => {
  try {
    if (channel) {
      await channel.close();
      console.log("✅ RabbitMQ channel closed");
    }

    if (connection) {
      await connection.close();
      console.log("✅ RabbitMQ connection closed");
    }

    channel = null;
    connection = null;
  } catch (error: any) {
    console.error("❌ Error closing RabbitMQ connection:", error.message);
  }
};
