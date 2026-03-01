"use server";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const s3 = new S3Client({
    endpoint: process.env.B2_ENDPOINT!,
    region: process.env.B2_REGION!,
    credentials: {
        accessKeyId: process.env.B2_KEY_ID!,
        secretAccessKey: process.env.B2_APPLICATION_KEY!,
    },
});

const BUCKET = process.env.B2_BUCKET_NAME!;

/**
 * Upload a file buffer to Backblaze B2 and return the public URL.
 */
export async function uploadToB2(
    fileBuffer: Buffer,
    folder: string,
    contentType: string
): Promise<{ url: string; key: string }> {
    const ext = contentType.split("/")[1] || "bin";
    const key = `${folder}/${uuid()}.${ext}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
        })
    );

    const url = `${process.env.B2_ENDPOINT}/${BUCKET}/${key}`;
    return { url, key };
}

/**
 * Delete a file from B2 (used for cleanup on DB failures).
 */
export async function deleteFromB2(key: string): Promise<void> {
    try {
        await s3.send(
            new DeleteObjectCommand({
                Bucket: BUCKET,
                Key: key,
            })
        );
    } catch (err) {
        console.error("B2 cleanup failed:", err);
    }
}
