import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { aiRateLimit } from "@/lib/ratelimit";
import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI conditionally if key exists
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Validate incoming prompt using Zod
const RequestSchema = z.object({
    prompt: z.string().min(1).max(500),
});

export const runtime = "edge"; // Edge function for fast streaming

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Session Validation
        const userId = user?.id || (process.env.NEXT_PUBLIC_MOCK_AUTH === "true" ? "mock-user" : null);

        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // 2. Rate Limit Verification
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

        if (process.env.REDIS_URL) {
            const { success, limit, reset, remaining } = await aiRateLimit.limit(`ai_${ip}`);
            if (!success) {
                return new Response(JSON.stringify({ error: "Too many AI requests. Please slow down." }), {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                    },
                });
            }
        }

        // 3. Payload Validation
        const body = await req.json();
        const parseResult = RequestSchema.safeParse(body);

        if (!parseResult.success) {
            return new Response(JSON.stringify({ error: "Invalid prompt payload." }), { status: 400 });
        }

        // 4. Fallback if no OpenAI Key provided during dev
        if (!openai) {
            // Mock stream response for Friction Wizard testing
            return new Response(JSON.stringify({
                suggestion: "This is a secure mock response returning from the Edge API. Please configure your OPENAI_API_KEY to activate live AI generations."
            }), { status: 200 });
        }

        // 5. OpenAI Execution
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are the 'Break the Block' AI Assistant. Your goal is to help users overcome friction and act. Be hyper-concise, action-oriented, and encouraging."
                },
                {
                    role: "user",
                    content: parseResult.data.prompt
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const reply = response.choices[0]?.message?.content || "Keep going!";

        return new Response(JSON.stringify({ suggestion: reply }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message || "Internal Server Error" }), { status: 500 });
    }
}
