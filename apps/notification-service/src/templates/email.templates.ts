/**
 * Email Templates
 * Professional HTML email templates for different notification types
 */

interface OrderCreatedData {
  orderId: string;
  customerName: string;
  total: number;
  itemsCount: number;
}

interface PaymentSuccessData {
  orderId: string;
  customerName: string;
  total: number;
  paymentId: string;
}

interface OrderShippedData {
  orderId: string;
  customerName: string;
  trackingNumber?: string;
}

interface OrderDeliveredData {
  orderId: string;
  customerName: string;
}

const baseStyle = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 20px;
  }
  .header {
    text-align: center;
    padding: 20px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px 10px 0 0;
  }
  .content {
    padding: 30px 20px;
  }
  .button {
    display: inline-block;
    padding: 12px 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white !important;
    text-decoration: none;
    border-radius: 5px;
    margin: 20px 0;
  }
  .footer {
    text-align: center;
    padding: 20px;
    font-size: 12px;
    color: #666;
    border-top: 1px solid #eee;
  }
  .order-details {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
  }
`;

export const orderCreatedTemplate = (data: OrderCreatedData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyle}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.customerName},</h2>
          <p>Thank you for your order! We're excited to let you know that we've received your order and it's being processed.</p>

          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Items:</strong> ${data.itemsCount}</p>
            <p><strong>Total:</strong> ₹${data.total.toFixed(2)}</p>
          </div>

          <p>We'll send you another email once your order has been shipped.</p>

          <center>
            <a href="${process.env.FRONTEND_URL}/orders/${data.orderId}" class="button">View Order Details</a>
          </center>
        </div>
        <div class="footer">
          <p>© 2025 My Shop. All rights reserved.</p>
          <p>If you have any questions, please contact us at support@myshop.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const paymentSuccessTemplate = (data: PaymentSuccessData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyle}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Successful!</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.customerName},</h2>
          <p>Great news! Your payment has been successfully processed.</p>

          <div class="order-details">
            <h3>Payment Details:</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Payment ID:</strong> ${data.paymentId}</p>
            <p><strong>Amount Paid:</strong> ₹${data.total.toFixed(2)}</p>
            <p><strong>Status:</strong> <span style="color: green;">Paid</span></p>
          </div>

          <p>Your order is now being prepared for shipment. We'll notify you once it's on its way!</p>

          <center>
            <a href="${process.env.FRONTEND_URL}/orders/${data.orderId}" class="button">View Order</a>
          </center>
        </div>
        <div class="footer">
          <p>© 2025 My Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const paymentFailedTemplate = (orderId: string, customerName: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyle}</style>
    </head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <h1>❌ Payment Failed</h1>
        </div>
        <div class="content">
          <h2>Hi ${customerName},</h2>
          <p>Unfortunately, we were unable to process your payment for order <strong>${orderId}</strong>.</p>

          <p>This could be due to:</p>
          <ul>
            <li>Insufficient funds</li>
            <li>Card declined by bank</li>
            <li>Incorrect card details</li>
            <li>Network issues</li>
          </ul>

          <p>Don't worry! Your order is still saved. You can try again anytime.</p>

          <center>
            <a href="${process.env.FRONTEND_URL}/orders/${orderId}" class="button">Retry Payment</a>
          </center>
        </div>
        <div class="footer">
          <p>© 2025 My Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const orderShippedTemplate = (data: OrderShippedData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyle}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Order Shipped!</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.customerName},</h2>
          <p>Exciting news! Your order is on its way!</p>

          <div class="order-details">
            <h3>Shipping Details:</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            ${data.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ''}
            <p><strong>Status:</strong> <span style="color: #ff6b35;">In Transit</span></p>
          </div>

          <p>Your package should arrive within 3-5 business days. We'll send you another email once it's delivered.</p>

          <center>
            <a href="${process.env.FRONTEND_URL}/orders/${data.orderId}" class="button">Track Order</a>
          </center>
        </div>
        <div class="footer">
          <p>© 2025 My Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const orderDeliveredTemplate = (data: OrderDeliveredData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyle}</style>
    </head>
    <body>
      <div class="container">
        <div class="header" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
          <h1>🎊 Order Delivered!</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.customerName},</h2>
          <p>Congratulations! Your order has been successfully delivered.</p>

          <div class="order-details">
            <h3>Delivery Confirmation:</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Status:</strong> <span style="color: green;">Delivered</span></p>
          </div>

          <p>We hope you love your purchase! If you have any issues, please don't hesitate to contact us.</p>

          <p><strong>Enjoying your purchase?</strong> We'd love to hear your feedback!</p>

          <center>
            <a href="${process.env.FRONTEND_URL}/orders/${data.orderId}/review" class="button">Leave a Review</a>
          </center>
        </div>
        <div class="footer">
          <p>© 2025 My Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const welcomeEmailTemplate = (customerName: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyle}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👋 Welcome to My Shop!</h1>
        </div>
        <div class="content">
          <h2>Hi ${customerName},</h2>
          <p>Welcome to My Shop! We're thrilled to have you as part of our community.</p>

          <p>Here's what you can do now:</p>
          <ul>
            <li>🛍️ Browse thousands of products</li>
            <li>💳 Secure checkout with multiple payment options</li>
            <li>📦 Track your orders in real-time</li>
            <li>⭐ Leave reviews and ratings</li>
          </ul>

          <p>Start exploring and find your perfect products today!</p>

          <center>
            <a href="${process.env.FRONTEND_URL}" class="button">Start Shopping</a>
          </center>
        </div>
        <div class="footer">
          <p>© 2025 My Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
