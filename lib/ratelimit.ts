import { Redis } from "ioredis";

// Initialize Redis from standard URL connection string
export const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

if (redis) {
    redis.on('error', (err: Error) => console.log('Redis Client Error', err));
}

// Helper to implement a basic Sliding Window Rate Limiter via native Redis commands
async function baseRateLimit(key: string, limit: number, windowSeconds: number) {
    if (!redis) return { success: true, limit, remaining: limit, reset: 0 }; // Pass-through in dev if no redis

    const now = Date.now();
    const windowStart = now - (windowSeconds * 1000);

    // Execute multiple commands atomically in a transaction pipeline
    const pipeline = redis.pipeline();

    // 1. Remove all old requests outside the current window
    pipeline.zremrangebyscore(key, 0, windowStart);
    // 2. Count how many requests are in the current window
    pipeline.zcard(key);
    // 3. Add the current request timestamp
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    // 4. Set TTL on the key so it expires entirely if unused
    pipeline.expire(key, windowSeconds);

    const results = await pipeline.exec();

    // results[1][1] is the output of the zcard command (the count)
    const currentCount = (results?.[1]?.[1] as number) || 0;

    const remaining = Math.max(0, limit - currentCount - 1);
    const success = currentCount < limit;
    const reset = now + (windowSeconds * 1000);

    return { success, limit, remaining, reset };
}

// Wrapper to match previous @upstash/ratelimit function signatures as closely as possible

export const aiRateLimit = {
    limit: async (identifier: string) => await baseRateLimit(`ratelimit:ai:${identifier}`, 5, 60) // 5 per 60s
};

export const uploadRateLimit = {
    limit: async (identifier: string) => await baseRateLimit(`ratelimit:upload:${identifier}`, 10, 60) // 10 per 60s
};

export const actionRateLimit = {
    limit: async (identifier: string) => await baseRateLimit(`ratelimit:action:${identifier}`, 30, 60) // 30 per 60s
};
