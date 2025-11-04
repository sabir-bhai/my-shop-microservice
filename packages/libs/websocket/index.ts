import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";

// Types
interface RedisMessage {
  event: string;
  payload: unknown;
}

// Constants
const REDIS_CONNECTION_TIMEOUT = 5000;
const REDIS_CHANNEL = "updates";
const ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"];

/**
 * Creates a Redis client with proper configuration for Socket.IO adapter.
 *
 * Note: Cannot reuse the shared Redis instance from packages/libs/redis because:
 * - Socket.IO adapter requires maxRetriesPerRequest: null (shared instance uses 3)
 * - Pub/Sub clients require enableOfflineQueue: true (shared instance uses false)
 * - Pub/Sub clients enter subscriber mode and cannot execute regular Redis commands
 */
function createRedisClient(url: string): Redis {
  return new Redis(url, {
    maxRetriesPerRequest: null,
    enableOfflineQueue: true,
    tls: url.startsWith("rediss://") ? { rejectUnauthorized: true } : undefined,
    family: 0,
  });
}

/**
 * Waits for a Redis client to be ready with timeout
 */
function waitForRedisClient(client: Redis, name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    client.once("ready", resolve);
    client.once("error", reject);
    setTimeout(
      () => reject(new Error(`Redis ${name} timeout`)),
      REDIS_CONNECTION_TIMEOUT
    );
  });
}

/**
 * Handles incoming Redis messages and broadcasts to Socket.IO clients
 */
function handleRedisMessage(
  io: SocketIOServer,
  channel: string,
  message: string
): void {
  if (channel !== REDIS_CHANNEL) return;

  try {
    const { event, payload } = JSON.parse(message) as RedisMessage;
    io.emit(event, payload);
    console.log(`📢 Broadcasted event: ${event}`);
  } catch (err) {
    console.error("❌ Failed to parse Redis message:", err);
  }
}

/**
 * Sets up Redis adapter for Socket.IO horizontal scaling
 */
async function setupRedisAdapter(io: SocketIOServer): Promise<void> {
  const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

  const pubClient = createRedisClient(redisUrl);
  const subClient = pubClient.duplicate();

  await Promise.all([
    waitForRedisClient(pubClient, "pubClient"),
    waitForRedisClient(subClient, "subClient"),
  ]);

  io.adapter(createAdapter(pubClient, subClient));
  console.log("✓ Socket.IO using Redis adapter for horizontal scaling");

  await subClient.subscribe(REDIS_CHANNEL);
  subClient.on("message", (channel, message) =>
    handleRedisMessage(io, channel, message)
  );
}

/**
 * Handles new Socket.IO client connections
 */
function handleConnection(socket: Socket): void {
  console.log("🔌 Client connected:", socket.id);
}

/**
 * Sets up Socket.IO server with optional Redis adapter
 */
export async function setupSocketIO(server: HTTPServer): Promise<void> {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ALLOWED_ORIGINS,
      credentials: true,
    },
  });

  try {
    await setupRedisAdapter(io);
  } catch (err) {
    console.warn("⚠️ Redis unavailable - Socket.IO using in-memory adapter");
    console.log("ℹ️  App will work fine in single-server mode");
  }

  io.on("connection", handleConnection);
}
