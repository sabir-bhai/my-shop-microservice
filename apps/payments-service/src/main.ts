/**
 * Payment Service
 *
 * Handles all payment operations using Razorpay.
 * Communicates with Order Service via RabbitMQ.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import { errorHandler } from "../../../packages/error-handler/error-middleware";
import router from "./routes/payment.route";
import * as rabbitmq from "../../../packages/libs/rabbitmq";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8080"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Debug middleware
app.use((req, _res, next) => {
  console.log("🔍 [Payment Service] Request:", req.method, req.originalUrl);
  next();
});

// Routes
app.use("/api", router);

// Error handler
app.use(errorHandler);

// Start server
const port = process.env.PORT || 6008;
const server = app.listen(port, async () => {
  console.log(`🚀 Payment Service listening at http://localhost:${port}`);

  // Initialize RabbitMQ connection
  try {
    await rabbitmq.connection.connect();
    console.log("✅ Payment Service: RabbitMQ initialized");
  } catch (error) {
    console.error("❌ Payment Service: Failed to initialize RabbitMQ:", error);
  }
});

server.on("error", console.error);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  await rabbitmq.connection.close();
  server.close(() => {
    console.log("✅ Payment Service terminated");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  await rabbitmq.connection.close();
  server.close(() => {
    console.log("✅ Payment Service terminated");
    process.exit(0);
  });
});

export default app;
