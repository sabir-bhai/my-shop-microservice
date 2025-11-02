
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// 400 - Bad Request (Validation errors)
export class ValidationError extends AppError {
  constructor(message = "Invalid request data", details?: any) {
    super(message, 400, true, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// 401 - Unauthorized (Authentication errors)
export class AuthError extends AppError {
  code: string;

  constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
    super(message, 401);
    this.code = code;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

// 403 - Forbidden (Authorization errors)
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access", details?: any) {
    super(message, 403, true, details);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

// 404 - Not Found - UPDATED to support details
export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: any) {
    super(message, 404, true, details);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// 409 - Conflict (e.g., duplicate email)
export class ConflictError extends AppError {
  constructor(message = "Resource already exists", details?: any) {
    super(message, 409, true, details);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

// 422 - Unprocessable Entity (semantic errors)
export class UnprocessableEntityError extends AppError {
  constructor(message = "Unable to process the request", details?: any) {
    super(message, 422, true, details);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

// 429 - Too Many Requests (Rate limiting)
export class RateLimitError extends AppError {
  constructor(
    message = "Too many requests, please try again later",
    details?: any
  ) {
    super(message, 429, true, details);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

// 500 - Internal Server Error
export class InternalServerError extends AppError {
  constructor(message = "Internal server error", details?: any) {
    super(message, 500, true, details);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

// 502 - Bad Gateway (external service errors)
export class BadGatewayError extends AppError {
  constructor(message = "Bad gateway error", details?: any) {
    super(message, 502, true, details);
    Object.setPrototypeOf(this, BadGatewayError.prototype);
  }
}

// 503 - Service Unavailable
export class ServiceUnavailableError extends AppError {
  constructor(message = "Service temporarily unavailable", details?: any) {
    super(message, 503, true, details);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

// Database specific errors
export class DatabaseError extends AppError {
  constructor(message = "Database error", details?: any) {
    super(message, 500, true, details);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

// JWT specific errors
export class TokenError extends AppError {
  constructor(message = "Invalid or expired token", details?: any) {
    super(message, 401, true, details);
    Object.setPrototypeOf(this, TokenError.prototype);
  }
}

// File upload errors
export class FileUploadError extends AppError {
  constructor(message = "File upload failed", details?: any) {
    super(message, 400, true, details);
    Object.setPrototypeOf(this, FileUploadError.prototype);
  }
}

// Payment errors
export class PaymentError extends AppError {
  constructor(message = "Payment processing failed", details?: any) {
    super(message, 402, true, details);
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

// Email service errors
export class EmailError extends AppError {
  constructor(message = "Email service error", details?: any) {
    super(message, 500, true, details);
    Object.setPrototypeOf(this, EmailError.prototype);
  }
}

// Cache errors
export class CacheError extends AppError {
  constructor(message = "Cache operation failed", details?: any) {
    super(message, 500, true, details);
    Object.setPrototypeOf(this, CacheError.prototype);
  }
}
