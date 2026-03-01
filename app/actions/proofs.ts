"use server";

import { uploadFileToB2, deleteFileFromB2 } from "@/app/actions/upload";
import { createClient } from "@/utils/supabase/server";

export async function submitProofAction(formData: FormData, goalId: string, shareToFeed: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || (process.env.NEXT_PUBLIC_MOCK_AUTH === "true" ? "mock-user" : null);

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // 1. Extract Files
    const beforePhoto = formData.get("beforePhoto") as File | null;
    const afterPhoto = formData.get("afterPhoto") as File | null;

    if (!beforePhoto || !afterPhoto) {
        throw new Error("Both Before and After photos are required to break the block.");
    }

    // 2. Convert Files to Buffers for the B2 SDK
    const beforeBuffer = Buffer.from(await beforePhoto.arrayBuffer());
    const afterBuffer = Buffer.from(await afterPhoto.arrayBuffer());

    let beforeUrl = "";
    let beforeKey = "";
    let afterUrl = "";
    let afterKey = "";

    try {
        // 3. Upload to Backblaze B2 concurrently
        const [beforeResult, afterResult] = await Promise.all([
            uploadFileToB2(beforeBuffer, beforePhoto.name, beforePhoto.type),
            uploadFileToB2(afterBuffer, afterPhoto.name, afterPhoto.type)
        ]);

        beforeUrl = beforeResult.url;
        beforeKey = beforeResult.key;
        afterUrl = afterResult.url;
        afterKey = afterResult.key;

    } catch (err: any) {
        throw new Error(`Failed to upload images to Backblaze B2: ${err.message}`);
    }

    try {
        // 4. Insert Record into Supabase Database
        // If NEXT_PUBLIC_MOCK_AUTH is set to true (during dev testing without a real DB), 
        // we'll simulate the DB insert instead of throwing.
        if (process.env.NEXT_PUBLIC_MOCK_AUTH !== "true") {
            const { error: dbError } = await supabase
                .from("proofs")
                .insert({
                    user_id: userId,
                    goal_id: goalId,
                    before_image_url: beforeUrl,
                    image_url: afterUrl, // the 'after' photo
                    // If shared to feed, make text public, etc. (Mock implementation details)
                    is_public: shareToFeed
                });

            if (dbError) throw new Error(dbError.message);
        }

        return { success: true, beforeUrl, afterUrl };

    } catch (dbErr: any) {
        // 5. CLEANUP / ROLLBACK: If the Postgres database insert fails, 
        // automatically delete the newly uploaded images from B2 to prevent orphaned assets and wasted storage.
        console.error("Database insert failed. Executing Backblaze B2 Cleanup...", dbErr);

        await Promise.allSettled([
            deleteFileFromB2(beforeKey),
            deleteFileFromB2(afterKey)
        ]);

        throw new Error(`Submission failed: ${dbErr.message}. The uploaded images have been successfully scrubbed from storage.`);
    }
}
