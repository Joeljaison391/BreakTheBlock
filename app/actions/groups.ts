"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { v4 as uuid } from "uuid";

export async function createGroup(name: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Check if user is already in a group
    const { data: existing } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (existing) return { error: "You are already in a group. Leave your current group first." };

    // Get user's region for auto-assignment
    const { data: profile } = await supabase
        .from("profiles")
        .select("region_id")
        .eq("id", user.id)
        .single();

    const groupId = uuid().slice(0, 8);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let inviteCode = "";
    for (let i = 0; i < 6; i++) {
        inviteCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const { error: groupError } = await supabase.from("groups").insert({
        id: groupId,
        name,
        region_id: profile?.region_id || "north-america",
        admin_id: user.id,
        invite_code: inviteCode,
        stone_progress: 0,
        member_count: 1,
        points: 0,
    });

    if (groupError) return { error: groupError.message };

    // Add creator as member
    const { error: memberError } = await supabase.from("group_members").insert({
        user_id: user.id,
        group_id: groupId,
    });

    if (memberError) return { error: memberError.message };

    return { error: null, inviteCode, groupId };
}

export async function joinGroup(inviteCode: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Check if user is already in a group
    const { data: existing } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (existing) return { error: "You are already in a group. Leave your current group first." };

    // Find group by invite code
    const { data: group } = await supabase
        .from("groups")
        .select("id")
        .eq("invite_code", inviteCode.toUpperCase().trim())
        .single();

    if (!group) return { error: "Invalid invite code" };

    const { error } = await supabase.from("group_members").insert({
        user_id: user.id,
        group_id: group.id,
    });

    if (error) return { error: error.message };

    return { error: null };
}

export async function getUserGroup() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("group_members")
        .select("group_id, groups(*)")
        .eq("user_id", user.id)
        .maybeSingle();

    return data?.groups || null;
}

export async function fetchGroups() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("groups")
        .select("*")
        .order("points", { ascending: false });
    return data || [];
}

export async function fetchRegions() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("regions")
        .select("*")
        .order("points", { ascending: false });
    return data || [];
}

/**
 * Auto-detect region from request headers (used during signup)
 */
export async function detectRegion(): Promise<string> {
    const h = await headers();
    const country = h.get("x-vercel-ip-country") || "";

    const regionMap: Record<string, string> = {
        US: "north-america", CA: "north-america", MX: "north-america",
        GB: "europe", DE: "europe", FR: "europe", IT: "europe", ES: "europe", NL: "europe",
        IN: "asia-pacific", CN: "asia-pacific", JP: "asia-pacific", KR: "asia-pacific", SG: "asia-pacific", AU: "oceania", NZ: "oceania",
        BR: "south-america", AR: "south-america", CL: "south-america", CO: "south-america",
        NG: "africa", ZA: "africa", KE: "africa", EG: "africa",
    };

    return regionMap[country] || "asia-pacific"; // Default fallback
}
