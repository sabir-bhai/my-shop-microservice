import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import { errorHandler } from "../../../packages/error-handler/error-middleware";
import router from "./routes/order.route";
import * as rabbitmq from "../../../packages/libs/rabbitmq";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

// Enable CORS for frontend origin
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/order/api", router);

app.use(errorHandler);

const port = process.env.PORT || 6005;
const server = app.listen(port, async () => {
  console.log(`🚀 Order Service listening at http://localhost:${port}/api`);

  // Initialize RabbitMQ connection
  try {
    await rabbitmq.connection.connect();
    console.log("✅ Order Service: RabbitMQ initialized");
  } catch (error) {
    console.error("❌ Order Service: Failed to initialize RabbitMQ:", error);
  }
});

server.on("error", console.error);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  await rabbitmq.connection.close();
  server.close(() => {
    console.log("✅ Order Service terminated");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  await rabbitmq.connection.close();
  server.close(() => {
    console.log("✅ Order Service terminated");
    process.exit(0);
  });
});
