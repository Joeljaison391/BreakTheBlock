"use server";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";
import { uploadRateLimit } from "@/lib/ratelimit";
import { createClient } from "@/utils/supabase/server";

// 1. Initialize S3 Client exclusively for Backblaze B2
const b2Client = new S3Client({
    endpoint: process.env.B2_ENDPOINT!, // e.g., 'https://s3.us-west-004.backblazeb2.com'
    region: process.env.B2_REGION!,     // e.g., 'us-west-004'
    credentials: {
        accessKeyId: process.env.B2_KEY_ID!,
        secretAccessKey: process.env.B2_APPLICATION_KEY!,
    }
});

const BUCKET_NAME = process.env.B2_BUCKET_NAME || "breaktheblock";

/**
 * Validates the user session and upload rate limits.
 */
async function validateUploadRequest() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || (process.env.NEXT_PUBLIC_MOCK_AUTH === "true" ? "mock-user" : null);

    if (!userId) throw new Error("Unauthorized");

    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    if (process.env.REDIS_URL) {
        const { success } = await uploadRateLimit.limit(`upload_${ip}`);
        if (!success) throw new Error("Upload rate limit exceeded. Slow down.");
    }

    return userId;
}

/**
 * Uploads a file (Buffer) directly from the NextJS backend to Backblaze. 
 * Returns the public URL and the exact B2 Key for future cleanup.
 */
export async function uploadFileToB2(fileBuffer: Buffer, fileName: string, contentType: string) {
    const userId = await validateUploadRequest();

    // Sanitize and generate a universally unique path
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const uniqueKey = `${userId}/${Date.now()}_${uuidv4()}_${cleanFileName}`;

    await b2Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: uniqueKey,
        Body: fileBuffer,
        ContentType: contentType,
    }));

    // Construct the public URL assuming the bucket is public read
    // Format: https://bucket-name.s3.region.backblazeb2.com/key
    const endpoint = new URL(process.env.B2_ENDPOINT!);
    const publicUrl = `https://${BUCKET_NAME}.${endpoint.hostname}/${uniqueKey}`;

    return { success: true, url: publicUrl, key: uniqueKey };
}

/**
 * Deletes a file from B2 by its Key. Critical for cleanup if DB inserts fail.
 */
export async function deleteFileFromB2(key: string) {
    try {
        await b2Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        }));
        return { success: true };
    } catch (err) {
        console.error(`Failed to delete orphaned file from B2 (Key: ${key}):`, err);
        return { success: false, error: err };
    }
}
