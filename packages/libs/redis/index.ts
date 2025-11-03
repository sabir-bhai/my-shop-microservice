import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  lazyConnect: false, // Connect immediately for Upstash
  tls: redisUrl.startsWith("rediss://") ? {
    rejectUnauthorized: true // Upstash requires proper TLS
  } : undefined,
  family: 0, // Use IPv4 and IPv6
  retryStrategy(times) {
    if (times > 3) {
      console.warn("Redis connection failed after 3 attempts. Running without Redis.");
      return null; // Stop retrying
    }
    const delay = Math.min(times * 200, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
});

let isConnected = false;

redis.on("error", (err) => {
  if (!err.message.includes("ENOTFOUND") && !err.message.includes("ECONNREFUSED")) {
    console.error("❌ Redis error:", err.message);
  } else {
    console.warn("⚠️ Redis connection issue:", err.message);
  }
  isConnected = false;
});

redis.on("connect", () => {
  console.log("✓ Redis connected successfully");
  isConnected = true;
});

redis.on("ready", () => {
  console.log("✓ Redis is ready");
  isConnected = true;
});

redis.on("close", () => {
  console.log("⚠️ Redis connection closed");
  isConnected = false;
});

export default redis;
export { isConnected };
