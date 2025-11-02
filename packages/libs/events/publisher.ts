import redis from "../redis"; // re-use your shared redis client

export async function publishEvent(event: string, payload: any) {
  try {
    if (!redis) {
      console.warn("⚠️ Redis client not initialized, skipping publish");
      return;
    }

    await redis.publish("updates", JSON.stringify({ event, payload }));
    console.log(`📢 Event published: ${event}`);
  } catch (err) {
    // Log but don’t throw — prevents breaking your API response
    console.error(`❌ Failed to publish event "${event}":`, err);
  }
}
