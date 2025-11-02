import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import redis from "../redis";

export async function setupSocketIO(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: { origin: "http://localhost:3000", credentials: true },
  });

  const pubClient = redis;
  const subClient = redis.duplicate();

  // ioredis auto-connects, no need for manual connect()
  io.adapter(createAdapter(pubClient as any, subClient as any));

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);
  });

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
}
