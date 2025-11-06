/**
 * Email Templates
 *
 * HTML templates for different email types
 */

interface PaymentSuccessEmailData {
  customerName: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  paymentId: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * Render payment success email template
 */
export const renderPaymentSuccessEmail = (data: PaymentSuccessEmailData) => {
  const { customerName, orderId, orderNumber, amount, paymentId, items } = data;

  // Calculate total items
  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Render items list
  const itemsHtml = items
    ? items
        .map(
          (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `
        )
        .join('')
    : '';

  const subject = `Payment Successful - Order ${orderNumber}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

              <!-- Header -->
              <tr>
                <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    ✓ Payment Successful!
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333;">
                    Hi <strong>${customerName}</strong>,
                  </p>

                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333;">
                    Great news! Your payment has been successfully processed. Thank you for your purchase!
                  </p>

                  <!-- Order Details Box -->
                  <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
                    <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">Order Details</h2>

                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Number:</td>
                        <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">${orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Order ID:</td>
                        <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">${orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Payment ID:</td>
                        <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">${paymentId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px; border-top: 2px solid #dee2e6; padding-top: 15px;">Total Amount:</td>
                        <td style="padding: 8px 0; color: #28a745; font-weight: bold; font-size: 18px; text-align: right; border-top: 2px solid #dee2e6; padding-top: 15px;">₹${amount.toFixed(2)}</td>
                      </tr>
                    </table>
                  </div>

                  ${
                    items && items.length > 0
                      ? `
                  <!-- Items List -->
                  <div style="margin: 30px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Order Items (${totalItems} ${totalItems === 1 ? 'item' : 'items'})</h3>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0;">
                      <thead>
                        <tr style="background-color: #f8f9fa;">
                          <th style="padding: 12px 10px; text-align: left; color: #666; font-size: 14px; border-bottom: 2px solid #dee2e6;">Item</th>
                          <th style="padding: 12px 10px; text-align: center; color: #666; font-size: 14px; border-bottom: 2px solid #dee2e6;">Qty</th>
                          <th style="padding: 12px 10px; text-align: right; color: #666; font-size: 14px; border-bottom: 2px solid #dee2e6;">Price</th>
                          <th style="padding: 12px 10px; text-align: right; color: #666; font-size: 14px; border-bottom: 2px solid #dee2e6;">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>
                  </div>
                  `
                      : ''
                  }

                  <!-- Next Steps -->
                  <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #2196f3;">
                    <h3 style="margin: 0 0 10px 0; color: #1976d2; font-size: 16px;">What's Next?</h3>
                    <ul style="margin: 10px 0; padding-left: 20px; color: #333; line-height: 1.8;">
                      <li>We're preparing your order for shipment</li>
                      <li>You'll receive a shipping confirmation email with tracking details</li>
                      <li>Track your order status in your account</li>
                    </ul>
                  </div>

                  <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 1.6; color: #333;">
                    If you have any questions about your order, please don't hesitate to contact our support team.
                  </p>

                  <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">
                    Thank you for shopping with us!
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                    Best regards,<br>
                    <strong style="color: #333;">${process.env.SMTP_FROM_NAME || 'My Shop'}</strong>
                  </p>
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                    This is an automated email. Please do not reply to this message.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { html, subject };
};

/**
 * Render order confirmation email template
 */
export const renderOrderConfirmationEmail = (data: {
  customerName: string;
  orderId: string;
  orderNumber: string;
}) => {
  const { customerName, orderId, orderNumber } = data;

  const subject = `Order Confirmation - ${orderNumber}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

              <!-- Header -->
              <tr>
                <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    Order Confirmed!
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333;">
                    Hi <strong>${customerName}</strong>,
                  </p>

                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333;">
                    Thank you for your order! We've received it and will process it soon.
                  </p>

                  <!-- Order Details Box -->
                  <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Number:</td>
                        <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">${orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Order ID:</td>
                        <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">${orderId}</td>
                      </tr>
                    </table>
                  </div>

                  <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">
                    You'll receive another email once your payment is confirmed.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                    Best regards,<br>
                    <strong style="color: #333;">${process.env.SMTP_FROM_NAME || 'My Shop'}</strong>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { html, subject };
};
