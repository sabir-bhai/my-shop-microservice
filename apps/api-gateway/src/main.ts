import express, { Request, Response, NextFunction, Application } from "express";
import cors, { CorsOptions } from "cors";
import proxy from "express-http-proxy";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { initializeWebSocket } from "../../../packages/libs/websocket";
import http, { Server } from "http";
import { errorHandler } from "../../../packages/error-handler/error-middleware";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Type definitions
interface CustomError extends Error {
  statusCode?: number;
  status?: number;
}

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  services: string[];
}

interface ErrorResponse {
  error: string;
  message: string;
  availableEndpoints?: string[];
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

const app: Application = express();

// Define allowed origins based on environment
const getAllowedOrigins = (): string[] => {
  const baseOrigins: string[] = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5173", // Vite default
    "http://localhost:5174",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
  ];

  // Add production origins from environment
  if (process.env.FRONTEND_URLS) {
    const prodOrigins: string[] = process.env.FRONTEND_URLS.split(",")
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);
    return [...baseOrigins, ...prodOrigins];
  }

  return baseOrigins;
};

// CORS setup - More secure approach
const isDevelopment = process.env.NODE_ENV !== "production";

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (
      error: Error | null,
      origin?: boolean | string | RegExp | (boolean | string | RegExp)[]
    ) => void
  ) => {
    const allowedOrigins: string[] = getAllowedOrigins();

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {

      return callback(null, true);
    }

    // In development, allow all localhost origins
    if (isDevelopment && (origin.includes("localhost") || origin.includes("127.0.0.1"))) {

      return callback(null, true);
    }

    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {

      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked origin: ${origin}`);
      console.warn(`Allowed origins:`, allowedOrigins);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "Pragma",
    "Expires",
    "X-File-Name",
  ],
  exposedHeaders: ["set-cookie"], // Expose cookies to frontend
  optionsSuccessStatus: 200, // Legacy browser support
  maxAge: 86400, // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly for all routes
app.options("*", cors(corsOptions));

// Logging, parsing, and middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Trust proxy (important for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// Enhanced rate limiting with different limits for different routes
// const createRateLimiter = (
//   windowMs: number,
//   max: number,
//   message: string
// ): RateLimitRequestHandler => {
//   return rateLimit({
//     windowMs,
//     max,
//     message: { error: message },
//     standardHeaders: true,
//     legacyHeaders: false,
//     // Remove keyGenerator to use default behavior
//     skip: (req: Request): boolean => {
//       return req.path === "/health" || req.path === "/status";
//     },
//   });
// };

// // Apply different rate limits
// const generalLimiter: RateLimitRequestHandler = createRateLimiter(
//   15 * 60 * 1000,
//   100,
//   "Too many requests, please try again later."
// );

// app.use(generalLimiter);

// Health check endpoint (before proxies)
app.get("/health", (req: Request, res: Response): void => {
  const response: HealthCheckResponse = {
    status: "OK",
    timestamp: new Date().toISOString(),
    services: ["order", "cart", "chat", "product", "auth", "users", "reviews"],
  };
  res.status(200).json(response);
});

// Enhanced proxy configuration with better error handling
const createProxyMiddleware = (
  target: string,
  pathRewrite: Record<string, string> = {}
) => {
  return proxy(target, {
    proxyReqOptDecorator: (proxyReqOpts: any, srcReq: Request) => {
      // Forward original headers
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      proxyReqOpts.headers["x-forwarded-for"] = srcReq.ip;
      proxyReqOpts.headers["x-original-url"] = srcReq.originalUrl;
      return proxyReqOpts;
    },
    proxyReqPathResolver: (req: Request): string => {
      // Handle path rewriting if needed
      let newPath: string = req.originalUrl;
      Object.keys(pathRewrite).forEach((pattern: string) => {
        newPath = newPath.replace(new RegExp(pattern), pathRewrite[pattern]);
      });
      return newPath;
    },
    userResDecorator: (_proxyRes: any, proxyResData: any, userReq: Request, userRes: Response) => {
      // Ensure CORS headers are present in the response
      const origin = userReq.headers.origin;
      const allowedOrigins = getAllowedOrigins();

      if (origin) {
        const isAllowed =
          allowedOrigins.includes(origin) ||
          (isDevelopment && (origin.includes("localhost") || origin.includes("127.0.0.1")));

        if (isAllowed) {
          console.log(`✅ [Proxy] CORS allowed for origin: ${origin}`);
          userRes.setHeader('Access-Control-Allow-Origin', origin);
          userRes.setHeader('Access-Control-Allow-Credentials', 'true');
        } else {
          console.warn(`❌ [Proxy] CORS blocked for origin: ${origin}`);
          console.warn(`   Allowed origins:`, allowedOrigins);
        }
      }
      return proxyResData;
    },
    proxyErrorHandler: (
      err: Error,
      res: Response,
      next: NextFunction
    ): void => {
      console.error("Proxy Error:", err.message);
      if (res.headersSent) {
        return next(err);
      }
      res.status(502).json({
        error: "Service temporarily unavailable",
        message:
          "The requested service is currently unavailable. Please try again later.",
      });
    },
    timeout: 30000, // 30 second timeout
  });
};

// Proxy routes with enhanced error handling

app.use(
  "/reviews",
  createProxyMiddleware("http://localhost:6007", { "^/reviews": "" })
);

// Debug middleware for /users route
app.use("/users", (req, _res, next) => {
  console.log("🔍 [API Gateway /users] Proxying request:", req.method, req.originalUrl);
  console.log("🔍 [API Gateway /users] Target: http://localhost:6006");
  next();
});

app.use(
  "/users",
  createProxyMiddleware("http://localhost:6006", { "^/users": "" })
);
app.use("/order", createProxyMiddleware("http://localhost:6005"));
app.use(
  "/payment",
  createProxyMiddleware("http://localhost:6008", { "^/payment": "" })
);
app.use("/cart", createProxyMiddleware("http://localhost:6004"));
app.use("/chat", createProxyMiddleware("http://localhost:6003"));
app.use(
  "/product",
  createProxyMiddleware("http://localhost:6002", { "^/product": "" })
);
app.use("/", createProxyMiddleware("http://localhost:6001"));

// Handle 404 for API routes specifically
app.use("/api/*", (req: Request, res: Response, next: NextFunction): void => {
  const error: CustomError = new Error(
    `API endpoint ${req.originalUrl} not found`
  );
  error.statusCode = 404;
  next(error);
});

// Catch-all for non-API routes (useful for SPA routing)
app.get("*", (req: Request, res: Response): void => {
  const response: ErrorResponse = {
    error: "Route not found",
    message: `The route ${req.originalUrl} was not found on this server.`,
    availableEndpoints: [
      "/auth",
      "/order",
      "/cart",
      "/chat",
      "/product",
      "/users",
      "/reviews",
      "/health",
    ],
  };
  res.status(404).json(response);
});

// Global error handler - MUST be last
app.use(
  (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    console.error("Gateway Error:", error);

    // Handle CORS errors specifically
    if (error.message === "Not allowed by CORS") {
      res.status(403).json({
        error: "CORS Error",
        message: "Origin not allowed",
      });
      return;
    }
    errorHandler(error, req, res, next);
  }
);

// Graceful shutdown handler
const gracefulShutdown = (signal: string): void => {
  console.log(`🛑 ${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log("✅ Process terminated");
    process.exit(0);
  });
};

// Create HTTP server
const port: number = parseInt(process.env.PORT || "8080", 10);
const server: Server = http.createServer(app);

server.listen(port, async (): Promise<void> => {
  console.log(`🚀 API Gateway listening at http://localhost:${port}`);
  console.log(`📋 Health check available at http://localhost:${port}/health`);

  try {
    // Setup WebSocket + Redis
    initializeWebSocket(server, {
      cors: {
        origin: getAllowedOrigins(),
        credentials: true,
      },
    });
    console.log("✅ WebSocket server initialized");
  } catch (err) {
    console.error("❌ Startup error:", err);
  }
});

server.on("error", (err: Error): void => {
  console.error("❌ Server error:", err);
});

// Graceful shutdown
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
