import redis, { isConnected } from "./index";

/**
 * Safe Redis wrapper that gracefully handles connection failures
 * Falls back to in-memory cache when Redis is unavailable
 */

// In-memory fallback cache (only used when Redis is down)
const memoryCache = new Map<string, { value: string; expiry: number | null }>();

// Cleanup expired items every 30 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of memoryCache.entries()) {
    if (data.expiry && data.expiry < now) {
      memoryCache.delete(key);
    }
  }
}, 30000);

export class SafeRedis {
  async get(key: string): Promise<string | null> {
    try {
      if (isConnected) {
        return await redis.get(key);
      }

      // Fallback to memory cache
      const cached = memoryCache.get(key);
      if (!cached) return null;

      if (cached.expiry && cached.expiry < Date.now()) {
        memoryCache.delete(key);
        return null;
      }

      return cached.value;
    } catch (error) {
      console.warn(`Redis GET failed for key ${key}, using memory fallback`);
      const cached = memoryCache.get(key);
      return cached && (!cached.expiry || cached.expiry > Date.now()) ? cached.value : null;
    }
  }

  async set(key: string, value: string, mode?: "EX" | "PX", duration?: number): Promise<void> {
    try {
      if (isConnected) {
        if (mode && duration) {
          // ioredis accepts EX/PX as options object
          if (mode === "EX") {
            await redis.setex(key, duration, value);
          } else {
            await redis.psetex(key, duration, value);
          }
        } else {
          await redis.set(key, value);
        }
      }

      // Always store in memory as backup
      const expiry = mode && duration
        ? Date.now() + (mode === "EX" ? duration * 1000 : duration)
        : null;

      memoryCache.set(key, { value, expiry });
    } catch (error) {
      console.warn(`Redis SET failed for key ${key}, using memory fallback only`);

      const expiry = mode && duration
        ? Date.now() + (mode === "EX" ? duration * 1000 : duration)
        : null;

      memoryCache.set(key, { value, expiry });
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (isConnected) {
        await redis.del(key);
      }
      memoryCache.delete(key);
    } catch (error) {
      console.warn(`Redis DEL failed for key ${key}, clearing from memory`);
      memoryCache.delete(key);
    }
  }

  async incr(key: string): Promise<number> {
    try {
      if (isConnected) {
        console.log(`[SafeRedis] INCR ${key} - Using Redis`);
        return await redis.incr(key);
      }

      // Fallback to memory
      console.warn(`[SafeRedis] INCR ${key} - Using memory fallback (Redis not connected)`);
      const cached = memoryCache.get(key);
      const currentValue = cached ? parseInt(cached.value) : 0;
      const newValue = currentValue + 1;
      memoryCache.set(key, { value: String(newValue), expiry: cached?.expiry ?? null });
      return newValue;
    } catch (error) {
      console.warn(`Redis INCR failed for key ${key}, using memory fallback`);

      const cached = memoryCache.get(key);
      const currentValue = cached ? parseInt(cached.value) : 0;
      const newValue = currentValue + 1;
      memoryCache.set(key, { value: String(newValue), expiry: cached?.expiry ?? null });
      return newValue;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      if (isConnected) {
        console.log(`[SafeRedis] EXPIRE ${key} ${seconds}s - Using Redis`);
        await redis.expire(key, seconds);
      } else {
        console.warn(`[SafeRedis] EXPIRE ${key} ${seconds}s - Using memory fallback (Redis not connected)`);
      }

      // Update expiry in memory cache
      const cached = memoryCache.get(key);
      if (cached) {
        cached.expiry = Date.now() + seconds * 1000;
        console.log(`[SafeRedis] Memory cache updated for ${key}, expiry: ${new Date(cached.expiry).toISOString()}`);
      } else {
        console.warn(`[SafeRedis] WARNING: Key ${key} not found in memory cache when setting expiry!`);
      }
    } catch (error) {
      console.warn(`Redis EXPIRE failed for key ${key}, updating memory fallback only`);

      const cached = memoryCache.get(key);
      if (cached) {
        cached.expiry = Date.now() + seconds * 1000;
      }
    }
  }

  isHealthy(): boolean {
    return isConnected;
  }
}

export const safeRedis = new SafeRedis();
