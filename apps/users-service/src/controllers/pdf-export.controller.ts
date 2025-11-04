import { NextFunction, Request, Response } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";
import { safeRedis } from "../../../../packages/libs/redis/safe-redis";

// Constants for PDF generation
const MAX_ROWS_PER_PDF = 5000;
const PDF_TIMEOUT_MS = 60000; // 60 seconds
const RATE_LIMIT_KEY_PREFIX = "ratelimit:pdf:";
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 PDF downloads
const RATE_LIMIT_WINDOW = 3600; // Per hour (3600 seconds)

// Rate limiting helper (based on IP since no auth)
async function checkRateLimit(ip: string): Promise<boolean> {
  const rateLimitKey = `${RATE_LIMIT_KEY_PREFIX}${ip}`;

  try {
    const requestCount = await safeRedis.incr(rateLimitKey);

    if (requestCount === 1) {
      await safeRedis.expire(rateLimitKey, RATE_LIMIT_WINDOW);
    }

    return requestCount <= RATE_LIMIT_MAX_REQUESTS;
  } catch (err) {
    console.error("Rate limit check failed:", err);
    return true; // Allow request if Redis is down
  }
}

// Export users as PDF (Public access)
export const exportUsersPDF = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Rate Limiting (based on IP address since no user login)
    const userIp = req.ip || "unknown";
    const isAllowed = await checkRateLimit(userIp);
    if (!isAllowed) {
      throw new ValidationError(
        `Too many PDF export requests. Maximum ${RATE_LIMIT_MAX_REQUESTS} per hour allowed.`
      );
    }

    // 2. Input Validation & Sanitization
    const { status, limit = "1000" } = req.query;

    const limitNum = parseInt(limit as string, 10);
    if (isNaN(limitNum) || limitNum < 1) {
      throw new ValidationError("Invalid limit parameter");
    }

    if (limitNum > MAX_ROWS_PER_PDF) {
      throw new ValidationError(
        `Cannot export more than ${MAX_ROWS_PER_PDF} rows at once`
      );
    }

    const validStatuses = [
      "active",
      "inactive",
      "banned",
      "suspended",
      "deleted",
    ];
    if (
      status &&
      typeof status === "string" &&
      !validStatuses.includes(status)
    ) {
      throw new ValidationError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    // 3. Query Database with timeout
    let whereClause: any = {};
    if (status && typeof status === "string" && status !== "all") {
      whereClause.status = status;
    }

    const users = await Promise.race([
      prisma.user.findMany({
        where: whereClause,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          role: true,
          createdAt: true,
          lastLogin: true,
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), PDF_TIMEOUT_MS)
      ),
    ]);

    if (users.length === 0) {
      throw new ValidationError("No users found to export");
    }

    console.log(
      `📄 PDF Export: Public Request | Status: ${status || "all"} | Rows: ${
        users.length
      }`
    );

    // 4. Generate PDF
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 50,
      bufferPages: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=users-export-${Date.now()}.pdf`
    );

    doc.pipe(res);

    // PDF Header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Users Export Report", { align: "center" });

    doc.moveDown();
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated on: ${new Date().toLocaleString()}`, {
        align: "center",
      });
    doc.text(`Status Filter: ${status || "All"}`, { align: "center" });
    doc.text(`Total Users: ${users.length}`, { align: "center" });
    doc.moveDown(2);

    // Table Header
    const tableTop = doc.y;
    const colWidths = {
      no: 30,
      name: 120,
      email: 150,
      status: 80,
      role: 60,
      created: 100,
      lastLogin: 100,
    };

    doc.fontSize(9).font("Helvetica-Bold");

    let xPos = 50;
    doc.text("No.", xPos, tableTop, { width: colWidths.no, align: "left" });
    xPos += colWidths.no;
    doc.text("Name", xPos, tableTop, { width: colWidths.name, align: "left" });
    xPos += colWidths.name;
    doc.text("Email", xPos, tableTop, {
      width: colWidths.email,
      align: "left",
    });
    xPos += colWidths.email;
    doc.text("Status", xPos, tableTop, {
      width: colWidths.status,
      align: "left",
    });
    xPos += colWidths.status;
    doc.text("Role", xPos, tableTop, { width: colWidths.role, align: "left" });
    xPos += colWidths.role;
    doc.text("Created", xPos, tableTop, {
      width: colWidths.created,
      align: "left",
    });
    xPos += colWidths.created;
    doc.text("Last Login", xPos, tableTop, {
      width: colWidths.lastLogin,
      align: "left",
    });

    doc
      .moveTo(50, doc.y + 5)
      .lineTo(750, doc.y + 5)
      .stroke();
    doc.moveDown();

    // Table Rows
    doc.fontSize(8).font("Helvetica");
    users.forEach((user, index) => {
      if (doc.y > 500) {
        doc.addPage();
        doc.fontSize(9).font("Helvetica-Bold");

        let xPos = 50;
        doc.text("No.", xPos, doc.y, { width: colWidths.no, align: "left" });
        xPos += colWidths.no;
        doc.text("Name", xPos, doc.y - 10, {
          width: colWidths.name,
          align: "left",
        });
        xPos += colWidths.name;
        doc.text("Email", xPos, doc.y - 10, {
          width: colWidths.email,
          align: "left",
        });
        xPos += colWidths.email;
        doc.text("Status", xPos, doc.y - 10, {
          width: colWidths.status,
          align: "left",
        });
        xPos += colWidths.status;
        doc.text("Role", xPos, doc.y - 10, {
          width: colWidths.role,
          align: "left",
        });
        xPos += colWidths.role;
        doc.text("Created", xPos, doc.y - 10, {
          width: colWidths.created,
          align: "left",
        });
        xPos += colWidths.created;
        doc.text("Last Login", xPos, doc.y - 10, {
          width: colWidths.lastLogin,
          align: "left",
        });

        doc
          .moveTo(50, doc.y + 5)
          .lineTo(750, doc.y + 5)
          .stroke();
        doc.moveDown();
        doc.fontSize(8).font("Helvetica");
      }

      const rowY = doc.y;
      let x = 50;

      doc.text(`${index + 1}`, x, rowY, { width: colWidths.no, align: "left" });
      x += colWidths.no;

      const name =
        user.name.length > 20 ? user.name.substring(0, 17) + "..." : user.name;
      doc.text(name, x, rowY, { width: colWidths.name, align: "left" });
      x += colWidths.name;

      const email =
        user.email.length > 25
          ? user.email.substring(0, 22) + "..."
          : user.email;
      doc.text(email, x, rowY, { width: colWidths.email, align: "left" });
      x += colWidths.email;

      doc.text(user.status, x, rowY, {
        width: colWidths.status,
        align: "left",
      });
      x += colWidths.status;

      doc.text(user.role, x, rowY, { width: colWidths.role, align: "left" });
      x += colWidths.role;

      const createdDate = new Date(user.createdAt).toLocaleDateString();
      doc.text(createdDate, x, rowY, {
        width: colWidths.created,
        align: "left",
      });
      x += colWidths.created;

      const lastLogin = user.lastLogin
        ? new Date(user.lastLogin).toLocaleDateString()
        : "Never";
      doc.text(lastLogin, x, rowY, {
        width: colWidths.lastLogin,
        align: "left",
      });

      doc.moveDown(0.5);
    });

    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
          align: "center",
        });
    }

    doc.end();
    console.log(`✅ PDF Export Complete | ${users.length} rows`);
  } catch (error: any) {
    console.error("❌ PDF Export Error:", error);
    if (error.message === "Query timeout") {
      return next(
        new ValidationError(
          "PDF generation timed out. Try reducing the number of rows."
        )
      );
    }
    next(error);
  }
};
