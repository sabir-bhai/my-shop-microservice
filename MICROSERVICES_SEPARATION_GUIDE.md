# 🏗️ Microservices Separation Guide

## Order Service vs Payment Service Separation

This document explains the separation of concerns between Order Service and Payment Service.

---

## 📊 Architecture Overview

### **Before (Monolithic in Order Service)**
```
Order Service
├── Create Order
├── Create Razorpay Payment ❌
├── Verify Payment ❌
├── Capture Payment ❌
└── Get Orders
```

### **After (Proper Microservices)**
```
Order Service                    Payment Service
├── Create Order                 ├── Create Payment Order
├── Update Order Status          ├── Verify Payment
├── Get Orders                   ├── Capture Payment
├── Cancel Order                 ├── Get Payment Details
└── Order Management             ├── Initiate Refund
                                 └── Payment Management
```

---

## 🔄 Complete Flow: Order → Payment → Notification

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER CREATES ORDER                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  1. Frontend → Order Service                                         │
│     POST /order/api/create                                           │
│     {                                                                │
│       cartItems: [...],                                              │
│       addressId: "...",                                              │
│       total: 1000                                                    │
│     }                                                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  2. Order Service                                                    │
│     ✅ Creates order in database (status: CREATED)                  │
│     🚀 Publishes "order.created" to RabbitMQ                        │
│     ✅ Returns orderId to frontend                                  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  3. Frontend → Payment Service                                       │
│     POST /payment/api/create-order                                   │
│     {                                                                │
│       orderId: "...",                                                │
│       amount: 1000                                                   │
│     }                                                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  4. Payment Service                                                  │
│     ✅ Creates payment record (status: PENDING)                     │
│     ✅ Calls Razorpay API to create order                           │
│     ✅ Returns razorpayOrderId + razorpayKeyId                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  5. Frontend shows Razorpay Checkout                                 │
│     User enters card/UPI details                                     │
│     Razorpay processes payment                                       │
│     Returns razorpay_payment_id + signature                          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  6. Frontend → Payment Service                                       │
│     POST /payment/api/verify                                         │
│     {                                                                │
│       razorpay_order_id: "...",                                      │
│       razorpay_payment_id: "...",                                    │
│       razorpay_signature: "...",                                     │
│       paymentId: "..."                                               │
│     }                                                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  7. Payment Service                                                  │
│     ✅ Verifies Razorpay signature                                  │
│     ✅ Updates payment status (SUCCESS/FAILED)                      │
│     🚀 Publishes "payment.verified" to RabbitMQ                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  8. Order Service (Consumes RabbitMQ)                                │
│     👂 Listens to "payment.verified" queue                          │
│     ✅ Updates order status to PAID                                 │
│     🚀 Publishes "notification.email" to RabbitMQ                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  9. Notification Service (Consumes RabbitMQ)                         │
│     👂 Listens to "notification.email" queue                        │
│     📧 Sends order confirmation email                               │
│     📱 Sends SMS notification (optional)                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

### **Order Service**
```
apps/order-service/
├── src/
│   ├── controllers/
│   │   ├── order.controller.ts (OLD - contains payment logic)
│   │   └── order.controller.new.ts (NEW - only order logic) ✅
│   ├── routes/
│   │   ├── order.route.ts (OLD)
│   │   └── order.route.new.ts (NEW) ✅
│   └── main.ts (Updated with RabbitMQ)
└── prisma/
    └── schema.prisma (Order, OrderItem, OrderTimeline)
```

### **Payment Service**
```
apps/payments-service/
├── src/
│   ├── controllers/
│   │   └── payment.controller.ts ✅ (NEW)
│   ├── routes/
│   │   └── payment.route.ts ✅ (NEW)
│   └── main.ts ✅ (Updated)
└── prisma/
    └── schema.prisma (Payment, Refund)
```

### **RabbitMQ Library**
```
packages/libs/rabbitmq/
├── connection.ts ✅ (Connection management)
├── publisher.ts ✅ (Publish messages)
├── consumer.ts ✅ (Consume messages)
├── index.ts ✅ (Central exports)
└── README.md ✅ (Documentation)
```

---

## 🚀 API Endpoints

### **Order Service (Port 6005)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/order/api/create` | Create new order | User |
| GET | `/order/api/user/orders` | Get user orders | User |
| GET | `/order/api/:orderId` | Get order by ID | User |
| PATCH | `/order/api/:orderId/cancel` | Cancel order | User |
| GET | `/order/api/all` | Get all orders | Admin |

### **Payment Service (Port 6008)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/payment/api/create-order` | Create Razorpay order | User |
| POST | `/payment/api/verify` | Verify payment signature | Public |
| POST | `/payment/api/capture` | Capture payment | User |
| GET | `/payment/api/user/payments` | Get user payments | User |
| GET | `/payment/api/:paymentId` | Get payment details | User |
| POST | `/payment/api/refund` | Initiate refund | Admin |

### **API Gateway Routing (Port 8080)**

```
http://localhost:8080/order/*    → Order Service (6005)
http://localhost:8080/payment/*  → Payment Service (6008)
http://localhost:8080/users/*    → Users Service (6006)
http://localhost:8080/product/*  → Product Service (6002)
```

---

## 🔧 Setup Instructions

### **1. Generate Prisma Client for Payment Service**

```bash
npx prisma generate --schema=apps/payments-service/prisma/schema.prisma
```

### **2. Push Database Schema**

```bash
npx prisma db push --schema=apps/payments-service/prisma/schema.prisma
```

### **3. Start Services**

```bash
# Terminal 1: API Gateway
npx nx serve api-gateway

# Terminal 2: Order Service
npx nx serve order-service

# Terminal 3: Payment Service
npx nx serve payments-service

# Terminal 4: Users Service
npx nx serve users-service
```

### **4. Replace Old Controllers (Important!)**

After testing the new implementation, replace the old files:

```bash
# Backup old files (optional)
cp apps/order-service/src/controllers/order.controller.ts apps/order-service/src/controllers/order.controller.old.ts
cp apps/order-service/src/routes/order.route.ts apps/order-service/src/routes/order.route.old.ts

# Replace with new files
mv apps/order-service/src/controllers/order.controller.new.ts apps/order-service/src/controllers/order.controller.ts
mv apps/order-service/src/routes/order.route.new.ts apps/order-service/src/routes/order.route.ts
```

---

## 📋 RabbitMQ Queues

| Queue Name | Publisher | Consumer | Purpose |
|------------|-----------|----------|---------|
| `order.created` | Order Service | - | Order creation event |
| `order.paid` | Order Service | - | Order payment success |
| `payment.verified` | Payment Service | Order Service | Payment verification |
| `notification.email` | Order Service | Notification Service | Email notifications |
| `notification.sms` | Order Service | Notification Service | SMS notifications |

---

## 🎯 Benefits of Separation

### **1. Single Responsibility**
- Order Service: Manages orders only
- Payment Service: Handles payments only

### **2. Independent Scaling**
- Scale payment service separately during high transaction loads
- Scale order service during sales/promotions

### **3. Independent Deployment**
- Update payment logic without touching orders
- Deploy order features without payment downtime

### **4. Better Security**
- Payment service can have stricter security rules
- Razorpay keys isolated to payment service

### **5. Easier Testing**
- Test order flow without payment mocks
- Test payment flow independently

### **6. Technology Flexibility**
- Can switch payment providers without changing order service
- Can rewrite services in different languages

---

## 🧪 Testing the Flow

### **Test 1: Create Order**
```bash
curl -X POST http://localhost:8080/order/api/create \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your_token" \
  -d '{
    "cartItems": [
      {
        "id": "product123",
        "name": "Test Product",
        "sku": "SKU123",
        "quantity": 2,
        "salePrice": 500
      }
    ],
    "addressId": "address123",
    "total": 1000,
    "subtotal": 1000,
    "itemsCount": 1,
    "shipping": 0
  }'
```

### **Test 2: Create Payment Order**
```bash
curl -X POST http://localhost:8080/payment/api/create-order \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your_token" \
  -d '{
    "orderId": "order_id_from_step1",
    "amount": 1000
  }'
```

### **Test 3: Verify Payment**
```bash
curl -X POST http://localhost:8080/payment/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "signature_xxx",
    "paymentId": "payment_id_from_step2"
  }'
```

---

## 📝 Next Steps

1. **Implement Order Service Consumer**
   - Listen to `payment.verified` queue
   - Update order status when payment succeeds

2. **Create Notification Service**
   - Listen to `notification.email` queue
   - Send emails using Nodemailer (SMTP already configured)

3. **Add Webhook Support**
   - Razorpay webhooks for payment status updates
   - Handle refund webhooks

4. **Add More Features**
   - Order tracking
   - Shipment integration
   - Invoice generation

---

## 🛡️ Security Considerations

1. **API Gateway**
   - Rate limiting enabled
   - CORS properly configured

2. **Payment Service**
   - Signature verification for all payments
   - Environment variables for Razorpay keys
   - No sensitive data in logs

3. **Order Service**
   - User can only access their own orders
   - Admin authentication for all orders

4. **RabbitMQ**
   - Secure CloudAMQP connection (AMQPS)
   - Message persistence enabled
   - Retry logic for failed messages

---

## 📚 Additional Resources

- [RabbitMQ Documentation](packages/libs/rabbitmq/README.md)
- [Razorpay API Docs](https://razorpay.com/docs/api/)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

Built with ❤️ for clean microservices architecture
