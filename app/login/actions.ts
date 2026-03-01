"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    if (!data.email || !data.password) {
        return { error: "Email and password are required" };
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
    };

    if (!data.email || !data.password || !data.name) {
        return { error: "Name, email, and password are required" };
    }

    // Attempt Supabase Auth Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });

    if (authError) {
        return { error: authError.message };
    }

    // Use the service role key to bypass RLS for profile creation.
    // The anon-key session isn't fully established right after signUp,
    // so `auth.uid() = id` check fails. Service role bypasses RLS.
    if (authData.user) {
        const { createClient: createServiceClient } = await import("@supabase/supabase-js");
        const adminSupabase = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { detectRegion } = await import("@/app/actions/groups");
        const regionId = await detectRegion();

        const { error: profileError } = await adminSupabase.from('profiles').insert({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            region_id: regionId,
            points: 0,
            streak: 0,
            is_admin: false,
        });

        if (profileError) {
            console.error("Profile creation failed:", profileError);
        }
    }

    // Don't redirect — tell the user to confirm their email first
    return { success: "Check your email for a confirmation link to activate your account!" };
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
