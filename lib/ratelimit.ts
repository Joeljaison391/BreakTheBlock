import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis from standard URL connection string or Upstash REST endpoint
const redis =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        })
        : null;

// Helper to implement a basic Sliding Window Rate Limiter
async function baseRateLimit(key: string, limit: number, windowSeconds: number) {
    if (!redis) return { success: true, limit, remaining: limit, reset: 0 }; // Pass-through in dev if no redis

    // Create a new ratelimiter instance dynamically based on the passed parameters
    const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        analytics: true,
        // Optional prefix for the keys used in redis. This is useful if you want to share a redis
        // instance with other applications and want to avoid key collisions. The default prefix is
        // "@upstash/ratelimit"
        prefix: "@upstash/ratelimit",
    });

    const { success, pending, limit: resultLimit, remaining, reset } = await ratelimit.limit(key);
    return { success, limit: resultLimit, remaining, reset };
}

// Wrapper to match previous functional signatures
export const aiRateLimit = {
    limit: async (identifier: string) => await baseRateLimit(`ai:${identifier}`, 5, 60) // 5 per 60s
};

export const uploadRateLimit = {
    limit: async (identifier: string) => await baseRateLimit(`upload:${identifier}`, 10, 60) // 10 per 60s
};

export const actionRateLimit = {
    limit: async (identifier: string) => await baseRateLimit(`action:${identifier}`, 30, 60) // 30 per 60s
};
