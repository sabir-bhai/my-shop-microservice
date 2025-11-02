// import nodemailer from "nodemailer";
// import ejs from "ejs";
// import path from "path";

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   templateName: string,
//   data: Record<string, any>
// ) => {
//   const templatePath = path.resolve(
//     process.cwd(),
//     "apps/auth-service/src/utils/mail-template",
//     templateName
//   );

//   const html = await ejs.renderFile(templatePath, data);

//   const transporter = nodemailer.createTransport({
//     service: process.env.SMTP_SERVICE,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Eshop" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

/**
 * Sends an email using a given EJS template
 * @param to Recipient email address
 * @param subject Email subject
 * @param templateName Template file name (e.g. 'forgot-password-user.mail.ejs')
 * @param data Data to inject into the EJS template
 */
export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, any>
) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      "apps/auth-service/src/utils/mail-template",
      templateName
    );

    // ✅ Ensure all template variables are defined
    const safeData = {
      ...data,
      name: data?.name || "User", // fallback for optional name
    };

    const html = await ejs.renderFile(templatePath, safeData);

    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Eshop" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw err;
  }
};
