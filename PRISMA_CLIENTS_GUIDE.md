# 🗄️ Prisma Clients - Database Per Service Guide

## Database Per Service Pattern

Each microservice has its **own database** and **own Prisma client** for complete independence.

---

## 📊 Service → Database → Prisma Client Mapping

| Service | Port | Database | Prisma Client | Schema Location |
|---------|------|----------|---------------|-----------------|
| Auth Service | 6001 | `auth_db` | `.prisma/auth-client` | `apps/auth-service/prisma/schema.prisma` |
| Product Service | 6002 | `product_db` | `.prisma/product-client` | `apps/product-service/prisma/schema.prisma` |
| Cart Service | 6004 | `cart_wishlist_db` | `.prisma/cart-client` | `apps/add-to-cart-service/prisma/schema.prisma` |
| Order Service | 6005 | `order_db` | `.prisma/order-client` | `apps/order-service/prisma/schema.prisma` |
| Users Service | 6006 | `auth_db` | `.prisma/users-client` | `apps/users-service/prisma/schema.prisma` |
| Reviews Service | 6007 | `review_db` | `.prisma/review-client` | `apps/reviews-service/prisma/schema.prisma` |
| Payment Service | 6008 | `payment_db` | `.prisma/payment-client` | `apps/payments-service/prisma/schema.prisma` |
| Notification Service | 6009 | `notification_db` | `.prisma/notification-client` | `apps/notification-service/prisma/schema.prisma` |

---

## ✅ All Prisma Clients Generated

```bash
node_modules/.prisma/
├── auth-client/          ✅
├── product-client/       ✅
├── cart-client/          ✅
├── order-client/         ✅
├── users-client/         ✅
├── review-client/        ✅
├── payment-client/       ✅
└── notification-client/  ✅
```

---

## 📝 Correct Import Syntax for Each Service

### **Auth Service**
```typescript
import { PrismaClient } from ".prisma/auth-client";
const prisma = new PrismaClient();
```

### **Product Service**
```typescript
import { PrismaClient } from ".prisma/product-client";
const prisma = new PrismaClient();
```

### **Cart Service**
```typescript
import { PrismaClient } from ".prisma/cart-client";
const prisma = new PrismaClient();
```

### **Order Service** ✅
```typescript
import { PrismaClient } from ".prisma/order-client";
const prisma = new PrismaClient();

// Models available:
// - prisma.order
// - prisma.orderItem
// - prisma.orderTimeline
```

### **Users Service**
```typescript
import { PrismaClient } from ".prisma/users-client";
const prisma = new PrismaClient();
```

### **Reviews Service**
```typescript
import { PrismaClient } from ".prisma/review-client";
const prisma = new PrismaClient();
```

### **Payment Service** ✅
```typescript
import { PrismaClient } from ".prisma/payment-client";
const prisma = new PrismaClient();

// Models available:
// - prisma.payment
// - prisma.refund
```

### **Notification Service** ✅
```typescript
import { PrismaClient } from ".prisma/notification-client";
const prisma = new PrismaClient();

// Models available:
// - prisma.notification
// - prisma.emailLog
// - prisma.smsLog
// - prisma.pushLog
// - prisma.deviceToken
```

---

## 🔧 Commands Reference

### **Generate All Clients**
```bash
# Order Service
npx prisma generate --schema=apps/order-service/prisma/schema.prisma

# Payment Service
npx prisma generate --schema=apps/payments-service/prisma/schema.prisma

# Notification Service
npx prisma generate --schema=apps/notification-service/prisma/schema.prisma

# Users Service
npx prisma generate --schema=apps/users-service/prisma/schema.prisma

# Product Service
npx prisma generate --schema=apps/product-service/prisma/schema.prisma

# Cart Service
npx prisma generate --schema=apps/add-to-cart-service/prisma/schema.prisma

# Reviews Service
npx prisma generate --schema=apps/reviews-service/prisma/schema.prisma

# Auth Service
npx prisma generate --schema=apps/auth-service/prisma/schema.prisma
```

### **Push Database Schema**
```bash
# Order Service
npx prisma db push --schema=apps/order-service/prisma/schema.prisma

# Payment Service
npx prisma db push --schema=apps/payments-service/prisma/schema.prisma

# Notification Service
npx prisma db push --schema=apps/notification-service/prisma/schema.prisma
```

### **View Database in Prisma Studio**
```bash
# Order Service
npx prisma studio --schema=apps/order-service/prisma/schema.prisma

# Payment Service
npx prisma studio --schema=apps/payments-service/prisma/schema.prisma

# Notification Service
npx prisma studio --schema=apps/notification-service/prisma/schema.prisma
```

---

## 🗂️ Database Schemas

### **Order Service Schema**
```prisma
model Order {
  id                 String          @id @default(auto()) @map("_id") @db.ObjectId
  userId             String          @db.ObjectId
  addressId          String          @db.ObjectId
  amountPaise        Int
  currency           String          @default("INR")
  subtotal           Float
  shipping           Float           @default(0)
  total              Float
  itemsCount         Int
  status             OrderStatus     @default(CREATED)
  orderItems         OrderItem[]
  timeline           OrderTimeline[]
  razorpayOrderId    String?
  razorpayPaymentId  String?
  signatureVerified  Boolean         @default(false)
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt
}

enum OrderStatus {
  CREATED
  ATTEMPTED
  PAID
  CAPTURED
  FAILED
}
```

### **Payment Service Schema**
```prisma
model Payment {
  id                String        @id @default(auto()) @map("_id") @db.ObjectId
  orderId           String        @db.ObjectId
  userId            String        @db.ObjectId
  amount            Float
  currency          String        @default("INR")
  razorpayOrderId   String?
  razorpayPaymentId String?       @unique
  razorpaySignature String?
  status            PaymentStatus @default(PENDING)
  method            String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}

model Refund {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  paymentId       String   @db.ObjectId
  orderId         String   @db.ObjectId
  amount          Float
  reason          String?
  status          String   @default("PENDING")
  razorpayRefundId String? @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}
```

### **Notification Service Schema**
```prisma
model Notification {
  id        String           @id @default(auto()) @map("_id") @db.ObjectId
  userId    String           @db.ObjectId
  type      NotificationType
  channel   NotificationChannel @default(IN_APP)
  title     String
  message   String
  data      Json?
  isRead    Boolean          @default(false)
  sentAt    DateTime         @default(now())
  createdAt DateTime         @default(now())
}

model EmailLog {
  id        String             @id @default(auto()) @map("_id") @db.ObjectId
  userId    String?            @db.ObjectId
  to        String
  from      String?
  subject   String
  body      String
  type      NotificationType?
  status    NotificationStatus @default(PENDING)
  error     String?
  sentAt    DateTime?
  createdAt DateTime           @default(now())
  updatedAt DateTime           @updatedAt
}

model SMSLog {
  id          String             @id @default(auto()) @map("_id") @db.ObjectId
  userId      String?            @db.ObjectId
  phoneNumber String
  message     String
  type        NotificationType?
  status      NotificationStatus @default(PENDING)
  provider    String?
  messageId   String?
  error       String?
  sentAt      DateTime?
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
}
```

---

## ⚠️ Common Errors & Solutions

### **Error: Cannot find module '.prisma/xxx-client'**

**Solution:**
```bash
# Generate the specific Prisma client
npx prisma generate --schema=apps/xxx-service/prisma/schema.prisma
```

### **Error: Environment variable not found: XXX_DATABASE_URL**

**Solution:**
Check your `.env` file has the correct database URL:
```env
ORDER_DATABASE_URL="mongodb+srv://..."
PAYMENT_DATABASE_URL="mongodb+srv://..."
NOTIFICATION_DATABASE_URL="mongodb+srv://..."
```

### **Error: Schema parsing error**

**Solution:**
```bash
# Validate the schema
npx prisma validate --schema=apps/xxx-service/prisma/schema.prisma

# Format the schema
npx prisma format --schema=apps/xxx-service/prisma/schema.prisma
```

---

## 🎯 Best Practices

### **1. Always Use Service-Specific Client**
```typescript
// ✅ CORRECT - Order Service
import { PrismaClient } from ".prisma/order-client";

// ❌ WRONG - Using wrong client
import { PrismaClient } from "@prisma/client";
```

### **2. Initialize Prisma Once Per Service**
```typescript
// ✅ CORRECT - Single instance
const prisma = new PrismaClient();

// ❌ WRONG - Multiple instances
function someFunction() {
  const prisma = new PrismaClient(); // Don't do this!
}
```

### **3. Handle Prisma Errors**
```typescript
try {
  const order = await prisma.order.findUnique({ where: { id } });
} catch (error) {
  console.error("Database error:", error);
  // Handle error appropriately
}
```

### **4. Close Connection on Shutdown**
```typescript
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

---

## 🔄 When to Regenerate Clients

Regenerate Prisma clients when:
- ✅ You modify the schema file
- ✅ You add/remove models
- ✅ You change field types
- ✅ After pulling schema changes from git
- ✅ After npm install (if node_modules was deleted)

---

## 📚 Quick Reference Commands

```bash
# Generate all clients at once
npx prisma generate --schema=apps/order-service/prisma/schema.prisma && \
npx prisma generate --schema=apps/payments-service/prisma/schema.prisma && \
npx prisma generate --schema=apps/notification-service/prisma/schema.prisma

# Push all schemas to database
npx prisma db push --schema=apps/order-service/prisma/schema.prisma && \
npx prisma db push --schema=apps/payments-service/prisma/schema.prisma && \
npx prisma db push --schema=apps/notification-service/prisma/schema.prisma

# View all databases in Prisma Studio (open in different terminals)
npx prisma studio --schema=apps/order-service/prisma/schema.prisma --port 5555
npx prisma studio --schema=apps/payments-service/prisma/schema.prisma --port 5556
npx prisma studio --schema=apps/notification-service/prisma/schema.prisma --port 5557
```

---

## ✅ Verification Checklist

- [x] All Prisma clients generated in `node_modules/.prisma/`
- [x] Each service uses its own specific Prisma client
- [x] Database URLs configured in `.env`
- [x] Schemas pushed to MongoDB
- [x] Services can connect to their respective databases

---

## 🚀 You're All Set!

All Prisma clients are now properly configured for the **database per service** pattern. Each microservice is completely independent! 🎉

---

**Need help?**
- Prisma Docs: https://www.prisma.io/docs/
- MongoDB with Prisma: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb
