"use server";

import { createClient } from "@/utils/supabase/server";
import { uploadToB2 } from "./b2";

export async function getUserGroup() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("group_members")
        .select("group_id, groups(*)")
        .eq("user_id", user.id)
        .single();

    return data?.groups || null;
}

export async function fetchMessages(groupId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("chat_messages")
        .select("*, profiles:user_id(name, avatar_url)")
        .eq("group_id", groupId)
        .order("created_at", { ascending: true })
        .limit(100);

    if (error) return [];
    return data || [];
}

export async function sendMessage(groupId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const text = formData.get("text") as string | null;
    const file = formData.get("image") as File | null;

    let imageUrl: string | null = null;

    if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadToB2(buffer, "chat", file.type);
        imageUrl = result.url;
    }

    const { error } = await supabase.from("chat_messages").insert({
        group_id: groupId,
        user_id: user.id,
        text: text || null,
        image_url: imageUrl,
    });

    if (error) return { error: error.message };
    return { error: null };
}
