# Notification Service - Email Notifications with RabbitMQ

This service handles sending email notifications using Nodemailer after payment success. It uses RabbitMQ to consume messages from other services.

## Features

- Send payment success emails with order details
- Send order confirmation emails
- Professional HTML email templates
- RabbitMQ integration for asynchronous processing
- Automatic retry logic for failed emails

## Setup

### 1. Environment Variables

The following environment variables are already configured in your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sksabiruddin81@gmail.com
SMTP_PASSWORD=tlcrbeifietzfnok
SMTP_FROM=sksabiruddin81@gmail.com
SMTP_FROM_NAME="My Shop"

# RabbitMQ
RABBITMQ_URL=amqps://odxdyycy:3X5qEUj1J4_hybQm1gDMMn5dVmL1V9cf@campbell.lmq.cloudamqp.com/odxdyycy

# Service Port
NOTIFICATION_SERVICE_PORT=6009
```

### 2. Running the Service

```bash
# Build the service
npx nx run notification-service:build

# Run the service
npx nx run notification-service:serve
```

The service will:
1. Test email configuration
2. Connect to RabbitMQ
3. Start listening for messages on these queues:
   - `order.paid` - Payment success notifications
   - `order.created` - Order created notifications
   - `notification.email` - Generic email notifications

## Usage from Payment Service

### Example: Send Email After Payment Success

When a payment is successful, publish a message to RabbitMQ from your payment service:

```typescript
// In your payment controller after successful payment verification
import * as rabbitmq from '../../../packages/libs/rabbitmq';

// After payment is verified
const paymentData = {
  email: 'customer@example.com',
  customerName: 'John Doe',
  orderId: order.id,
  orderNumber: order.orderNumber,
  amount: order.totalAmount,
  paymentId: razorpayPaymentId,
  items: [
    {
      name: 'Product Name',
      quantity: 2,
      price: 999.99
    }
  ]
};

// Publish to RabbitMQ
await rabbitmq.publisher.publishOrderPaid(paymentData);
```

### Message Format

The notification service expects messages in this format:

```typescript
{
  eventId: "order-paid-1234567890",
  timestamp: "2024-01-15T10:30:00.000Z",
  data: {
    email: "customer@example.com",          // Required
    customerName: "John Doe",                // Required
    orderId: "order_123",                    // Required
    orderNumber: "ORD-12345678",            // Optional (auto-generated if not provided)
    amount: 1999.98,                        // Optional
    paymentId: "pay_ABC123XYZ",             // Optional
    items: [                                // Optional
      {
        name: "Product Name",
        quantity: 2,
        price: 999.99
      }
    ]
  }
}
```

## Email Templates

### Payment Success Email

Sent when payment is verified. Includes:
- Order details
- Payment ID
- Item list with quantities and prices
- Total amount
- Professional branding

### Order Confirmation Email

Sent when order is created. Includes:
- Order number
- Order ID
- Next steps information

## API Endpoints

### Health Check
```
GET http://localhost:6009/health
```

Response:
```json
{
  "status": "ok",
  "service": "notification-service",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "rabbitmq": "connected"
}
```

### Service Info
```
GET http://localhost:6009/
```

Response:
```json
{
  "service": "Notification Service",
  "version": "1.0.0",
  "description": "Handles email notifications via RabbitMQ"
}
```

## Integration Example: Payment Service

Here's how to integrate this into your payment service controller:

```typescript
// apps/payments-service/src/controllers/payment.controller.ts

import * as rabbitmq from '../../../../packages/libs/rabbitmq';

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify payment signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Get order details from database
    const order = await getOrderById(razorpay_order_id);

    // Update order status to paid
    await updateOrderStatus(order.id, 'PAID');

    // Publish payment success event to RabbitMQ
    await rabbitmq.publisher.publishOrderPaid({
      email: order.customerEmail,
      customerName: order.customerName,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      paymentId: razorpay_payment_id,
      items: order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      }))
    });

    res.json({
      success: true,
      message: 'Payment verified successfully. Confirmation email will be sent shortly.'
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};
```

## Monitoring

Check the notification service logs to see:
- Email sending status
- RabbitMQ message processing
- Any errors or failures

```bash
# View logs when running
npx nx run notification-service:serve
```

## Error Handling

The service includes:
- Automatic retry (up to 3 attempts) for failed messages
- Dead letter queue for permanently failed messages
- Detailed error logging
- Graceful shutdown handling

## Testing

You can test the email service by:

1. Starting the notification service
2. Publishing a test message from your payment service
3. Checking your email inbox

The service will log all email operations to the console for debugging.
