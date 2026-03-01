"use server";

import { createClient } from "@/utils/supabase/server";
import { uploadToB2, deleteFromB2 } from "./b2";

export async function fetchFeed() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("proofs")
        .select("*, profiles:user_id(name, avatar_url), comments(*, profiles:user_id(name, avatar_url))")
        .order("created_at", { ascending: false })
        .limit(30);

    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
}

export async function createProof(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const text = formData.get("text") as string;
    const file = formData.get("image") as File | null;

    let imageUrl: string | null = null;
    let b2Key: string | null = null;

    // Upload image if provided
    if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadToB2(buffer, "feed", file.type);
        imageUrl = result.url;
        b2Key = result.key;
    }

    const { error } = await supabase.from("proofs").insert({
        user_id: user.id,
        text,
        image_url: imageUrl,
    });

    // Cleanup B2 if DB insert failed
    if (error && b2Key) {
        await deleteFromB2(b2Key);
        return { error: error.message };
    }
    if (error) return { error: error.message };

    return { error: null };
}

export async function addComment(proofId: string, text: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("comments").insert({
        proof_id: proofId,
        user_id: user.id,
        text,
    });

    if (error) return { error: error.message };
    return { error: null };
}
