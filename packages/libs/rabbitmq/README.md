# RabbitMQ Utility Library

A clean, maintainable, and function-based RabbitMQ implementation for microservices communication.

## 📦 Features

- ✅ **Function-based** - No classes, pure functions for better readability
- ✅ **Auto-reconnection** - Automatically reconnects on connection loss
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Error handling** - Comprehensive error handling and logging
- ✅ **Message persistence** - Messages survive broker restarts
- ✅ **Retry logic** - Automatic retry on message processing failures

## 🚀 Quick Start

### 1. Setup Environment Variable

Add to your `.env` file:
```env
RABBITMQ_URL=amqps://your-cloudamqp-url
```

### 2. Initialize Connection

```typescript
import * as rabbitmq from "../../../../packages/libs/rabbitmq";

// In your service startup
await rabbitmq.connection.connect();
```

### 3. Publish Messages

```typescript
import { publisher, QueueNames } from "../../../../packages/libs/rabbitmq";

// Option 1: Use helper functions
await publisher.publishOrderCreated({
  orderId: "123",
  userId: "user-456",
  total: 1000,
});

// Option 2: Publish to any queue
await publisher.publishToQueue(QueueNames.SEND_EMAIL, {
  eventId: "email-123",
  timestamp: new Date().toISOString(),
  data: {
    to: "user@example.com",
    subject: "Order Confirmation",
    body: "Your order has been confirmed",
  },
});
```

### 4. Consume Messages

```typescript
import { consumer, QueueNames } from "../../../../packages/libs/rabbitmq";

// Define your message handler
const handleOrderCreated = async (message: any) => {
  console.log("Processing order:", message.data);
  // Your business logic here
};

// Start consuming
await consumer.consume({
  queueName: QueueNames.ORDER_CREATED,
  handler: handleOrderCreated,
  prefetchCount: 1,
  autoAck: false,
});
```

## 📚 API Reference

### Connection

```typescript
// Connect to RabbitMQ
await connection.connect();

// Check connection status
const connected = connection.isConnected();

// Get the active channel
const channel = connection.getChannel();

// Close connection gracefully
await connection.close();
```

### Publisher

```typescript
// Publish to a queue
await publisher.publishToQueue(queueName, payload);

// Publish to an exchange
await publisher.publishToExchange(exchangeName, routingKey, payload);

// Helper functions
await publisher.publishOrderCreated(orderData);
await publisher.publishOrderPaid(orderData);
await publisher.publishEmailNotification(emailData);
await publisher.publishSMSNotification(smsData);
```

### Consumer

```typescript
// Consume from a single queue
await consumer.consume({
  queueName: "order.created",
  handler: handleMessage,
  prefetchCount: 1, // Optional, default: 1
  autoAck: false, // Optional, default: false
  retryOnError: true, // Optional, default: true
  maxRetries: 3, // Optional, default: 3
});

// Consume from multiple queues
await consumer.consumeMultiple([
  {
    queueName: QueueNames.ORDER_CREATED,
    handler: handleOrderCreated,
  },
  {
    queueName: QueueNames.SEND_EMAIL,
    handler: handleEmail,
  },
]);
```

## 🔧 Queue Names

Pre-defined queue names for consistency:

```typescript
enum QueueNames {
  ORDER_CREATED = "order.created",
  ORDER_PAID = "order.paid",
  ORDER_FAILED = "order.failed",
  PAYMENT_VERIFIED = "payment.verified",
  SEND_EMAIL = "notification.email",
  SEND_SMS = "notification.sms",
}
```

## 📖 Usage Examples

### Example 1: Order Service (Publisher)

```typescript
// apps/order-service/src/main.ts
import * as rabbitmq from "../../../packages/libs/rabbitmq";

const server = app.listen(port, async () => {
  console.log(`Order Service listening on ${port}`);

  // Initialize RabbitMQ
  await rabbitmq.connection.connect();
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await rabbitmq.connection.close();
  server.close();
});
```

```typescript
// apps/order-service/src/controllers/order.controller.ts
import * as rabbitmq from "../../../../packages/libs/rabbitmq";

export const createOrder = async (req, res) => {
  const order = await prisma.order.create({ /* ... */ });

  // Publish event
  await rabbitmq.publisher.publishOrderCreated({
    orderId: order.id,
    userId: order.userId,
    total: order.total,
  });

  res.json({ order });
};
```

### Example 2: Notification Service (Consumer)

```typescript
// apps/notification-service/src/main.ts
import * as rabbitmq from "../../../packages/libs/rabbitmq";
import { sendEmail } from "./utils/email";

const startService = async () => {
  // Connect to RabbitMQ
  await rabbitmq.connection.connect();

  // Start consuming email notifications
  await rabbitmq.consumer.consume({
    queueName: rabbitmq.QueueNames.SEND_EMAIL,
    handler: async (message) => {
      const { data } = message;
      await sendEmail(data.to, data.subject, data.body);
      console.log(`Email sent to ${data.to}`);
    },
  });

  console.log("Notification Service started");
};

startService();
```

## 🎯 Message Structure

All messages follow this structure:

```typescript
interface MessagePayload {
  eventId: string; // Unique event identifier
  timestamp: string; // ISO timestamp
  data: any; // Your custom data
}
```

Example:
```json
{
  "eventId": "order-created-1234567890",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "data": {
    "orderId": "order-123",
    "userId": "user-456",
    "total": 1000
  }
}
```

## 🔄 Event Flow Example

```
Order Service (Publisher)
    ↓
  [order.created] Queue
    ↓
Notification Service (Consumer)
    ↓
  Send Email
```

## ⚠️ Error Handling

The library automatically handles:
- Connection failures (auto-reconnect)
- Message processing errors (retry with max attempts)
- Channel errors (logged and handled gracefully)

## 🛡️ Best Practices

1. **Always acknowledge messages** - Set `autoAck: false` and manually ack after processing
2. **Use prefetchCount** - Limit concurrent message processing
3. **Implement idempotency** - Handle duplicate messages gracefully
4. **Monitor queues** - Check CloudAMQP dashboard for queue lengths
5. **Graceful shutdown** - Always close connections on app termination

## 📊 Monitoring

Check your CloudAMQP dashboard at:
```
https://customer.cloudamqp.com/instance
```

Monitor:
- Queue lengths
- Message rates
- Connection status
- Consumer counts

## 🤝 Contributing

When adding new queues:
1. Add to `QueueNames` enum
2. Create helper publish function
3. Document the message structure
4. Update this README

---

Built with ❤️ for microservices communication
