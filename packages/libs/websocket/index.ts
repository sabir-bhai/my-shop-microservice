import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";

export async function setupSocketIO(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      credentials: true
    },
  });

  // Try to setup Redis adapter, but don't fail if Redis is unavailable
  try {
    const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

    // Create pub/sub clients with proper configuration for Upstash
    const pubClient = new Redis(redisUrl, {
      maxRetriesPerRequest: null, // Required for Socket.IO adapter
      enableOfflineQueue: true, // Must be true for pub/sub
      tls: redisUrl.startsWith("rediss://") ? {
        rejectUnauthorized: true
      } : undefined,
      family: 0,
    });

    const subClient = pubClient.duplicate();

    // Wait for both clients to be ready
    await Promise.all([
      new Promise((resolve, reject) => {
        pubClient.once("ready", resolve);
        pubClient.once("error", reject);
        setTimeout(() => reject(new Error("Redis pubClient timeout")), 5000);
      }),
      new Promise((resolve, reject) => {
        subClient.once("ready", resolve);
        subClient.once("error", reject);
        setTimeout(() => reject(new Error("Redis subClient timeout")), 5000);
      }),
    ]);

    io.adapter(createAdapter(pubClient, subClient));
    console.log("✓ Socket.IO using Redis adapter for horizontal scaling");

    await subClient.subscribe("updates");

    subClient.on("message", (channel: string, message: string) => {
      if (channel === "updates") {
        try {
          const { event, payload } = JSON.parse(message);
          io.emit(event, payload);
          console.log(`📢 Broadcasted event: ${event}`);
        } catch (err) {
          console.error("❌ Failed to parse Redis message:", err);
        }
      }
    });
  } catch (err) {
    console.warn("⚠️ Redis unavailable - Socket.IO using in-memory adapter");
    console.log("ℹ️  App will work fine in single-server mode");
  }

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);
  });
}
