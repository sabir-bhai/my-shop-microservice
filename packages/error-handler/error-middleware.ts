// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "./index";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let details = undefined;

  // Handle custom AppError instances
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  }
  // Handle Prisma errors
  else if (error.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = "Database operation failed";
  }
  // Handle JWT errors
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  // Handle validation errors from express-validator, joi, etc.
  else if (error.name === "ValidationError") {
    statusCode = 400;
    message = error.message;
  }

  // Log error for debugging (optional)
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
  }

  // Send JSON error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(details && { details }),
      // Only show stack in development AND sanitize file paths
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack?.replace(/C:\\Users\\[^\\]+/g, "[USER_PATH]"),
      }),
    },
  });
};
