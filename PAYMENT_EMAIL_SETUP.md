# Payment Success Email Setup Guide

## Summary of Changes

I've fixed the issue where `handlePaymentSuccess()` wasn't being called. The problem was:

1. **Queue Mismatch**: Payment service was publishing to `PAYMENT_VERIFIED` queue, but notification service was listening to `ORDER_PAID` queue
2. **RabbitMQ Channel Error**: Existing queues had different configurations causing channel to close

## What Was Fixed

### 1. RabbitMQ Queues Cleaned Up
All queues were deleted and will be recreated with correct settings:
- ✅ `payment.verified`
- ✅ `order.paid`
- ✅ `order.created`
- ✅ `notification.email`

### 2. Payment Service Updated
The payment verification endpoint now:
- Publishes to **`ORDER_PAID`** queue (triggers email)
- Still publishes to `PAYMENT_VERIFIED` queue (for other services)
- Accepts email/customer data in request body

### 3. Notification Service Ready
- ✅ Email service with Nodemailer configured
- ✅ Beautiful HTML email templates
- ✅ RabbitMQ consumers listening
- ✅ Retry logic (3 attempts)

## How to Use

### Step 1: Restart All Services

```bash
# Stop all running services first (Ctrl+C)

# Then restart them:

# Terminal 1 - Notification Service
npx nx run notification-service:serve

# Terminal 2 - Payment Service
npx nx run payments-service:serve

# Terminal 3 - Other services as needed
```

### Step 2: Update Your Frontend Payment Verification

When calling the payment verification endpoint, pass the required data:

```javascript
// In your frontend (after Razorpay payment succeeds)
const verifyPayment = async (paymentData) => {
  const response = await fetch('http://localhost:8080/payment/api/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      paymentId: yourInternalPaymentId,

      // 🎯 Add these fields for email notification:
      email: userEmail,                    // User's email address
      customerName: userName,              // User's name
      orderNumber: orderNumber,            // Your order number
      items: [                             // Order items (optional)
        {
          name: "Product Name",
          quantity: 2,
          price: 999.99
        }
      ]
    }),
  });

  return response.json();
};
```

### Step 3: Test the Flow

1. **Make a test payment** through your frontend
2. **Check notification service logs** - you should see:
   ```
   🔔 Processing payment success notification...
   ✅ Email sent successfully
   ```
3. **Check your email inbox** - you'll receive a beautiful payment confirmation email

## Troubleshooting

### Issue: "handlePaymentSuccess is not calling"

**Check these:**

1. **Is notification service running?**
   ```bash
   # Should see this in logs:
   ✅ Notification Service started successfully
   👂 Started consuming from queue: order.paid
   ```

2. **Is RabbitMQ connected?**
   ```bash
   # Check health endpoint:
   curl http://localhost:6009/health

   # Should return:
   {
     "status": "ok",
     "rabbitmq": "connected"
   }
   ```

3. **Is payment service publishing correctly?**
   ```bash
   # After payment verification, check payment service logs:
   ✅ Payment notification sent to queue: ORDER_PAID
   ```

4. **Are you passing email/customerName in the request?**
   - Check your frontend code
   - Email and customerName must be in the request body

### Issue: RabbitMQ Channel Errors

If you see `PRECONDITION_FAILED` errors:

```bash
# Run the cleanup script again:
npx ts-node scripts/cleanup-rabbitmq-queues.ts

# Then restart all services
```

### Issue: Email Not Sending

Check SMTP configuration in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=sksabiruddin81@gmail.com
SMTP_PASSWORD=tlcrbeifietzfnok
```

**Gmail Security Note:** Make sure you're using an App Password, not your regular Gmail password.

## Expected Flow

```
User completes payment on frontend
    ↓
Frontend calls /payment/api/verify with user data
    ↓
Payment Service verifies signature
    ↓
Payment Service publishes to ORDER_PAID queue
    ↓
Notification Service receives message
    ↓
handlePaymentSuccess() is called ← YOU ARE HERE
    ↓
sendPaymentSuccessEmail() sends email
    ↓
Customer receives beautiful HTML email ✉️
```

## Logs to Watch

**Notification Service (Terminal 1):**
```
🚀 Starting Notification Service...
📧 Testing email configuration...
✅ Email server is ready to send emails
🔌 Connecting to RabbitMQ...
✅ RabbitMQ connected successfully
🚀 Starting notification service consumers...
👂 Started consuming from queue: order.paid
👂 Started consuming from queue: order.created
👂 Started consuming from queue: notification.email
✅ Notification Service is running on port 6009

// When payment succeeds:
📨 Received message from queue: order.paid
🔔 Processing payment success notification...
✅ Email sent successfully: <message-id>
📧 To: customer@example.com
✅ Message acknowledged
```

**Payment Service (Terminal 2):**
```
// When verifying payment:
✅ Payment verified successfully: <payment-id>
✅ Payment notification sent to queue: ORDER_PAID
```

## Test Email Data

For testing, you can use this sample data structure:

```json
{
  "razorpay_order_id": "order_abc123",
  "razorpay_payment_id": "pay_xyz789",
  "razorpay_signature": "signature_here",
  "paymentId": "your_payment_id",
  "email": "test@example.com",
  "customerName": "John Doe",
  "orderNumber": "ORD-12345678",
  "items": [
    {
      "name": "Test Product",
      "quantity": 1,
      "price": 999.99
    }
  ]
}
```

## Quick Start Commands

```bash
# 1. Clean up queues (if needed)
npx ts-node scripts/cleanup-rabbitmq-queues.ts

# 2. Start notification service
npx nx run notification-service:serve

# 3. Start payment service
npx nx run payments-service:serve

# 4. Make a test payment from frontend
# 5. Check email!
```

## Success Checklist

- [ ] Ran cleanup script
- [ ] Notification service is running
- [ ] Payment service is running
- [ ] RabbitMQ shows "connected" in health check
- [ ] Frontend passes email/customerName in verification request
- [ ] Logs show "Processing payment success notification"
- [ ] Email received in inbox

---

**🎉 Once you see the email in your inbox, everything is working!**
