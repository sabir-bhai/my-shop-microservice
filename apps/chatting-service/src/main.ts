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
    // Redis Pub/Sub setup
    const pubClient = redis.duplicate();
    const subClient = redis.duplicate();

    // ✅ DO NOT CALL connect() unless you use lazyConnect: true in your Redis config
    io.adapter(createAdapter(pubClient, subClient));

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
    console.error("❌ Redis connection error:", error);
    process.exit(1);
  }
})();
