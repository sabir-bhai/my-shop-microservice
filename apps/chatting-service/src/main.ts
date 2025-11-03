import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import redis from "../../../packages/libs/redis"; // your ioredis instance
import chatRoutes from "./routes/chat.route";
import { prisma } from "../../../packages/libs/prisma";
import cors from "cors";
const app = express();

app.use(express.json());

// API routes
app.use("/api/chat", chatRoutes);

// Create HTTP server and bind Socket.IO
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow all origins (customize this for production)
    methods: ["GET", "POST"],
  },
});

(async () => {
  try {
    // Redis Pub/Sub setup - with proper error handling
    try {
      const Redis = require("ioredis");
      const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

      // Create separate clients with proper configuration for Socket.IO
      const pubClient = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        enableOfflineQueue: true,
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
      console.log("✓ Chatting service using Redis adapter");
    } catch (redisErr) {
      console.warn("⚠️ Redis unavailable - using in-memory adapter");
    }

    io.on("connection", (socket) => {
      console.log(`✅ Socket connected: ${socket.id}`);

      // 🟢 Join room by userId (recommended)
      socket.on("join", (userId: string) => {
        if (userId) {
          socket.join(userId);
          console.log(`🔗 ${socket.id} joined room: ${userId}`);
        }
      });

      // 🟢 Send message (user to admin OR admin to user)
      socket.on(
        "sendMessage",
        async ({
          fromUserId,
          toUserId,
          content,
        }: {
          fromUserId?: string;
          toUserId?: string;
          content: string;
        }) => {
          try {
            if (!content || (!fromUserId && !toUserId)) return;

            const admin = await prisma.admin.findFirst();
            if (!admin) return;

            let message;

            if (fromUserId) {
              // 🟢 User → Admin
              message = await prisma.message.create({
                data: {
                  content,
                  fromUserId,
                  toAdminId: admin.id,
                },
              });

              // Broadcast to admin (or dashboard)
              io.emit("receiveMessage", message);
            } else if (toUserId) {
              // 🟢 Admin → User
              message = await prisma.message.create({
                data: {
                  content,
                  fromAdminId: admin.id,
                  toUserId,
                },
              });

              // Send directly to the user's room
              io.to(toUserId).emit("receiveMessage", message);
            }
          } catch (error) {
            console.error("❌ Error sending message:", error);
          }
        }
      );

      // 🔴 Disconnect
      socket.on("disconnect", () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
      });
    });

    const PORT = process.env.PORT || 6003;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Chatting service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    process.exit(1);
  }
})();
