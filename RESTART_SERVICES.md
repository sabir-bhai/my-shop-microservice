# How to Restart Services After RabbitMQ Queue Cleanup

## Problem
You're seeing these errors:
```
❌ Failed to assert queue order.created: Channel closed
❌ Failed to assert queue payment.verified: Channel closed
```

This means the RabbitMQ channel was closed and your services need to be restarted to get new connections.

## Solution: Stop ALL Services and Restart

### Step 1: Stop ALL Running Services

Press `Ctrl+C` in **ALL** terminal windows running these services:
- API Gateway
- Order Service
- Payment Service
- Notification Service
- Any other microservices

**IMPORTANT**: Don't just restart one service - stop them ALL first!

### Step 2: Wait 5 Seconds

Give RabbitMQ time to clean up old connections.

### Step 3: Start Services in Order

Start them one by one:

```bash
# Terminal 1 - Notification Service (START THIS FIRST!)
cd "c:\Users\sksab\OneDrive\Desktop\my-shop-backend"
npx nx run notification-service:serve
```

Wait until you see:
```
✅ Notification Service started successfully
👂 Started consuming from queue: order.paid
```

```bash
# Terminal 2 - Payment Service
cd "c:\Users\sksab\OneDrive\Desktop\my-shop-backend"
npx nx run payments-service:serve
```

```bash
# Terminal 3 - Order Service
cd "c:\Users\sksab\OneDrive\Desktop\my-shop-backend"
npx nx run order-service:serve
```

```bash
# Terminal 4 - API Gateway (if needed)
cd "c:\Users\sksab\OneDrive\Desktop\my-shop-backend"
npx nx run api-gateway:serve
```

```bash
# Terminal 5+ - Other services
# Add any other services you're running
```

### Step 4: Verify Connections

Check notification service health:
```bash
curl http://localhost:6009/health
```

Should return:
```json
{
  "status": "ok",
  "rabbitmq": "connected"
}
```

### Step 5: Test Payment Again

Now try making a payment. You should see in the logs:

**Payment Service:**
```
✅ Payment verified successfully: xxx
✅ Payment notification sent to queue: ORDER_PAID
```

**Notification Service:**
```
📨 Received message from queue: order.paid
🔔 Processing payment success notification...
✅ Email sent successfully
```

## If You Still Get Errors

If you still see "Channel closed" errors after restart:

### Option 1: Clean Queues Again
```bash
npx ts-node scripts/cleanup-rabbitmq-queues.ts
```

Then restart all services.

### Option 2: Check RabbitMQ Connection

Make sure your RabbitMQ URL is correct in `.env`:
```env
RABBITMQ_URL=amqps://odxdyycy:3X5qEUj1J4_hybQm1gDMMn5dVmL1V9cf@campbell.lmq.cloudamqp.com/odxdyycy
```

### Option 3: Check CloudAMQP Dashboard

1. Go to https://customer.cloudamqp.com/
2. Check if your RabbitMQ instance is running
3. Look at connections - you should see active connections from your services

## Quick Restart Script

Save this as `restart-all.sh` (Git Bash on Windows):

```bash
#!/bin/bash

echo "🛑 Stopping all services..."
echo "Please press Ctrl+C in all service terminals"
echo ""
read -p "Press Enter once all services are stopped..."

echo ""
echo "🚀 Starting services..."
echo ""

# Start notification service
echo "Starting Notification Service..."
cmd.exe /c "start cmd.exe /k cd c:\Users\sksab\OneDrive\Desktop\my-shop-backend && npx nx run notification-service:serve"
sleep 5

# Start payment service
echo "Starting Payment Service..."
cmd.exe /c "start cmd.exe /k cd c:\Users\sksab\OneDrive\Desktop\my-shop-backend && npx nx run payments-service:serve"
sleep 3

# Start order service
echo "Starting Order Service..."
cmd.exe /c "start cmd.exe /k cd c:\Users\sksab\OneDrive\Desktop\my-shop-backend && npx nx run order-service:serve"
sleep 3

echo ""
echo "✅ All services started!"
echo "Check each terminal window for successful startup messages."
```

## Common Mistakes

❌ **DON'T**: Restart only one service
✅ **DO**: Restart ALL services that use RabbitMQ

❌ **DON'T**: Start services too quickly
✅ **DO**: Wait for each service to fully start before starting the next

❌ **DON'T**: Forget to check health endpoints
✅ **DO**: Verify RabbitMQ connection after restart

## Success Indicators

You know everything is working when you see:

1. **No "Channel closed" errors** in any service logs
2. **Notification service shows** `👂 Started consuming from queue: order.paid`
3. **Payment verification triggers** the notification handler
4. **Email is sent** and you see `✅ Email sent successfully`

---

**Current Status**: Your RabbitMQ channels are closed. Follow these steps to fix it!
