/**
 * RabbitMQ Module
 *
 * Central export file for all RabbitMQ utilities.
 * Provides clean API for connection, publishing, and consuming messages.
 */

// Connection
export * as connection from "./connection";

// Publisher
export * as publisher from "./publisher";
export { QueueNames, ExchangeNames } from "./publisher";
export type { MessagePayload } from "./publisher";

// Consumer
export * as consumer from "./consumer";
export type { MessageHandler, ConsumerOptions } from "./consumer";
