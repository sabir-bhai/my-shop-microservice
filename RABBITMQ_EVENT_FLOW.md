# RabbitMQ Event-Driven Architecture

## Overview
This document describes the event-driven communication between microservices using RabbitMQ.

## Architecture

```
┌─────────────────┐      ┌──────────────┐      ┌────────────────────┐
│  Order Service  │─────▶│   RabbitMQ   │◀────▶│ Notification       │
│                 │      │              │      │ Service            │
└─────────────────┘      └──────────────┘      └────────────────────┘
                               ▲  ▼
                               │  │
                         ┌─────┴──┴────────┐
                         │ Payment Service │
                         └─────────────────┘
```

## Event Flows

### 1. Order Created Flow
**Publisher:** Order Service
**Queue:** `order.created`
**Consumers:** Notification Service

**Flow:**
1. User creates order via Order Service
2. Order Service publishes `order.created` event
3. Notification Service receives event and sends confirmation email

**Event Payload:**
```json
{
  "eventId": "order-created-1234567890",
  "timestamp": "2025-01-05T10:30:00.000Z",
  "data": {
    "orderId": "uuid",
    "userId": "uuid",
    "addressId": "uuid",
    "total": 1500,
    "itemsCount": 3,
    "status": "CREATED",
    "cartItems": [...]
  }
}
```

---

### 2. Payment Verification Flow
**Publisher:** Payment Service
**Queue:** `payment.verified`
**Consumers:** Notification Service

**Flow:**
1. User completes payment on frontend
2. Frontend sends payment details to Payment Service
3. Payment Service verifies signature
4. Payment Service publishes `payment.verified` event
5. Notification Service receives event and sends payment confirmation email

**Event Payload:**
```json
{
  "eventId": "payment-verified-1234567890",
  "timestamp": "2025-01-05T10:35:00.000Z",
  "data": {
    "paymentId": "uuid",
    "orderId": "uuid",
    "userId": "uuid",
    "amount": 1500,
    "razorpay_order_id": "order_xxx",
    "razorpayPaymentId": "pay_xxx",
    "status": "SUCCESS"
  }
}
```

---

### 3. Additional Event Queues
These queues are defined but need to be implemented:

- `payment.success` - Payment successful notification
- `payment.failed` - Payment failed notification
- `order.shipped` - Order shipped notification
- `order.delivered` - Order delivered notification
- `user.registered` - Welcome email for new users

---

## RabbitMQ Library API

### Connection Module
```typescript
import * as rabbitmq from 'packages/libs/rabbitmq';

// Connect to RabbitMQ
await rabbitmq.connection.connect();

// Check connection status
const connected = rabbitmq.connection.isConnected();

// Close connection
await rabbitmq.connection.close();
```

### Publisher Module
```typescript
// Publish to a queue
await rabbitmq.publisher.publishToQueue('queue.name', {
  eventId: 'event-1234',
  timestamp: new Date().toISOString(),
  data: { /* your data */ }
});

// Helper function for order created
await rabbitmq.publisher.publishOrderCreated({
  orderId: 'uuid',
  userId: 'uuid',
  // ... other order data
});
```

### Consumer Module
```typescript
// Consume from a single queue
await rabbitmq.consumer.consume({
  queueName: 'order.created',
  handler: async (message) => {
    console.log('Received:', message);
  },
  prefetchCount: 1,
  autoAck: false,
});

// Consume from multiple queues
await rabbitmq.consumer.consumeMultiple([
  {
    queueName: 'order.created',
    handler: handleOrderCreated,
  },
  {
    queueName: 'payment.success',
    handler: handlePaymentSuccess,
  },
]);
```

---

## Service Integration Examples

### Order Service (Publisher)
```typescript
// apps/order-service/src/controllers/order.controller.ts

export const createOrder = async (req, res, next) => {
  // 1. Create order in database
  const order = await prisma.order.create({ /* ... */ });

  // 2. Publish event to RabbitMQ
  await rabbitmq.publisher.publishOrderCreated({
    orderId: order.id,
    userId,
    total,
    status: "CREATED",
  });

  // 3. Return response
  res.status(201).json({ success: true, data: order });
};
```

### Payment Service (Publisher)
```typescript
// apps/payments-service/src/controllers/payment.controller.ts

export const verifyPayment = async (req, res, next) => {
  // 1. Verify signature
  const isValid = verifySignature(/* ... */);

  // 2. Update payment in database
  const payment = await prisma.payment.update({ /* ... */ });

  // 3. Publish event to RabbitMQ
  if (isValid) {
    await rabbitmq.publisher.publishToQueue(
      rabbitmq.QueueNames.PAYMENT_VERIFIED,
      {
        eventId: `payment-verified-${Date.now()}`,
        timestamp: new Date().toISOString(),
        data: {
          paymentId: payment.id,
          orderId: payment.orderId,
          status: "SUCCESS",
        },
      }
    );
  }

  // 4. Return response
  res.status(200).json({ success: true });
};
```

### Notification Service (Consumer)
```typescript
// apps/notification-service/src/consumers/notification.consumer.ts

export const startConsumer = async () => {
  // 1. Connect to RabbitMQ
  await rabbitmq.connection.connect();

  // 2. Start consuming from multiple queues
  await rabbitmq.consumer.consumeMultiple([
    {
      queueName: 'order.created',
      handler: handlers.handleOrderCreated,
    },
    {
      queueName: 'payment.success',
      handler: handlers.handlePaymentSuccess,
    },
  ]);
};
```

---

## Environment Variables

Each service needs the following RabbitMQ configuration in `.env`:

```env
RABBITMQ_URL=amqp://localhost:5672
```

---

## Best Practices

### 1. Event Naming Convention
- Use dot notation: `resource.action`
- Examples: `order.created`, `payment.verified`, `user.registered`

### 2. Message Structure
Always use the standardized message payload:
```typescript
{
  eventId: string;      // Unique event identifier
  timestamp: string;    // ISO timestamp
  data: any;           // Event-specific data
}
```

### 3. Error Handling
- Consumer automatically retries failed messages (max 3 times)
- After max retries, message moves to dead letter queue
- Always log errors with context

### 4. Connection Management
- Initialize RabbitMQ connection on service startup
- Close connection gracefully on shutdown (SIGTERM/SIGINT)
- Automatic reconnection on connection loss (max 5 attempts)

### 5. Queue Configuration
- Durable queues: survive broker restart
- Persistent messages: survive broker restart
- Message TTL: 24 hours

---

## Testing Events

### Manually Publish Event (for testing)
```typescript
await rabbitmq.publisher.publishToQueue('order.created', {
  eventId: 'test-event-123',
  timestamp: new Date().toISOString(),
  data: {
    orderId: 'test-order-id',
    userId: 'test-user-id',
    total: 1000,
  },
});
```

### Monitor Queue
Use RabbitMQ Management UI:
- URL: http://localhost:15672
- Username: guest
- Password: guest

---

## Future Improvements

1. **Add Type Safety**
   - Define TypeScript interfaces for each event type
   - Use discriminated unions for event data

2. **Add Event Versioning**
   - Include version in event payload
   - Support backward compatibility

3. **Add Dead Letter Queue Handler**
   - Create service to process failed messages
   - Implement alerting for failed events

4. **Add Event Sourcing**
   - Store all events in database
   - Enable event replay and audit trail

5. **Add Circuit Breaker**
   - Prevent cascading failures
   - Graceful degradation when RabbitMQ is down
