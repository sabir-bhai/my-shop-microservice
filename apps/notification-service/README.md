# 📧 Notification Service

An event-driven notification service for My Shop Backend that handles emails, in-app notifications, and more.

## 🎯 Features

- ✅ **Email Notifications** - Using Nodemailer
- ✅ **In-App Notifications** - Stored in database
- ✅ **Event-Driven Architecture** - Listens to RabbitMQ events
- ✅ **Professional Email Templates** - Beautiful HTML emails
- ✅ **Notification Logging** - Track all sent notifications
- 🔜 **SMS Notifications** - Coming soon
- 🔜 **Push Notifications** - Coming soon

## 📬 Supported Notification Types

### Email Notifications
1. **Order Created** - Confirmation email when order is placed
2. **Payment Success** - Payment receipt
3. **Payment Failed** - Payment failure notification with retry link
4. **Order Shipped** - Shipping confirmation with tracking
5. **Order Delivered** - Delivery confirmation
6. **Welcome Email** - Sent when user registers

### In-App Notifications
All the above events also create in-app notifications that users can view in their dashboard.

## 🏗️ Architecture

```
┌─────────────────┐
│  Order Service  │──┐
└─────────────────┘  │
                     │
┌─────────────────┐  │    ┌──────────┐     ┌──────────────────┐
│ Payment Service │──┼───>│ RabbitMQ │────>│ Notification     │
└─────────────────┘  │    └──────────┘     │ Service          │
                     │                      └──────────────────┘
┌─────────────────┐  │                              │
│  User Service   │──┘                              │
└─────────────────┘                                 ▼
                                          ┌──────────────────┐
                                          │ - Send Email     │
                                          │ - Create In-App  │
                                          │ - Log to DB      │
                                          └──────────────────┘
```

## 🚀 Setup

### 1. Environment Variables

Add these to your `.env` file:

```env
# Notification Service
NOTIFICATION_SERVICE_PORT=6009
NOTIFICATION_DATABASE_URL=mongodb://localhost:27017/notification-db

# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_FROM_NAME=My Shop

# For testing
TEST_EMAIL=test@example.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### 2. Gmail Setup (Recommended for Development)

If using Gmail:

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate an "App Password" for "Mail"
4. Use this app password as `SMTP_PASSWORD`

### 3. Alternative SMTP Providers

**SendGrid** (Recommended for production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

**Mailgun**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-user
SMTP_PASSWORD=your-mailgun-smtp-password
```

**Amazon SES**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

### 4. Generate Prisma Client

```bash
cd apps/notification-service
npx prisma generate
```

### 5. Run the Service

```bash
# Development
npx nx serve notification-service

# Production
npx nx build notification-service
node dist/apps/notification-service/main.js
```

## 🎨 Email Templates

All email templates are in `src/templates/email.templates.ts`. They include:

- Modern, responsive design
- Professional styling
- Clear call-to-action buttons
- Mobile-friendly layout
- Brand colors and gradients

## 📊 Database Schema

### Notification (In-App)
```prisma
model Notification {
  id        String           @id @default(auto()) @map("_id") @db.ObjectId
  userId    String           @db.ObjectId
  type      NotificationType
  channel   NotificationChannel
  title     String
  message   String
  data      Json?
  isRead    Boolean          @default(false)
  sentAt    DateTime         @default(now())
  createdAt DateTime         @default(now())
}
```

### EmailLog
```prisma
model EmailLog {
  id        String             @id @default(auto()) @map("_id") @db.ObjectId
  userId    String?            @db.ObjectId
  to        String
  subject   String
  body      String
  type      NotificationType?
  status    NotificationStatus @default(PENDING)
  error     String?
  sentAt    DateTime?
  createdAt DateTime           @default(now())
  updatedAt DateTime           @updatedAt
}
```

## 🔄 RabbitMQ Events

The service listens to these events:

| Event | Queue | Description |
|-------|-------|-------------|
| `order.created` | Order Service | Order confirmation |
| `payment.success` | Payment Service | Payment receipt |
| `payment.failed` | Payment Service | Payment failure |
| `order.shipped` | Order Service | Shipping update |
| `order.delivered` | Order Service | Delivery confirmation |
| `user.registered` | User Service | Welcome email |

## 📝 Adding New Notification Types

1. **Add to Prisma Schema** (`prisma/schema.prisma`)
```prisma
enum NotificationType {
  // ... existing types
  NEW_TYPE
}
```

2. **Create Email Template** (`src/templates/email.templates.ts`)
```typescript
export const newTemplate = (data: any): string => {
  return `<!-- HTML template -->`;
};
```

3. **Create Handler** (`src/handlers/notification.handlers.ts`)
```typescript
export const handleNewEvent = async (data: any) => {
  await sendEmail({
    to: data.email,
    subject: 'Subject',
    html: emailTemplates.newTemplate(data),
    userId: data.userId,
    type: 'NEW_TYPE',
  });
};
```

4. **Subscribe to Event** (`src/consumers/notification.consumer.ts`)
```typescript
await rabbitmq.consumer.subscribe('event.name', async (message: any) => {
  await handlers.handleNewEvent(message);
});
```

## 🧪 Testing

You can test email sending by triggering events from other services. Make sure:
- RabbitMQ is running
- SMTP credentials are configured
- TEST_EMAIL is set in .env

## 📈 Future Enhancements

### SMS Notifications (Priority 3)
- Integrate Twilio or AWS SNS
- Send order updates via SMS
- Estimated cost: ~$0.01 per SMS

### Push Notifications (Priority 4)
- Integrate Firebase Cloud Messaging (FCM)
- Real-time notifications on mobile
- Requires mobile app

### Notification Preferences
- Let users choose which notifications to receive
- Email vs SMS vs Push preferences
- Frequency settings

## 🐛 Troubleshooting

### Emails not sending
1. Check SMTP credentials in .env
2. Verify SMTP connection: Check service logs for "SMTP server is ready"
3. Check EmailLog table for error messages
4. Ensure Gmail App Password (not regular password)

### RabbitMQ not connecting
1. Ensure RabbitMQ is running: `docker ps`
2. Check RABBITMQ_URL in .env
3. Check consumer connection logs

### TypeScript errors
1. Generate Prisma client: `npx prisma generate`
2. Rebuild: `npx nx build notification-service`

## 📞 Support

For issues or questions, check the main project documentation or create an issue.
