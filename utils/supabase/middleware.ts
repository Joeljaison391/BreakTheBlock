import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If the user is NOT authenticated and trying to access protected routes, redirect to /login
    const isProtected = request.nextUrl.pathname.startsWith('/feed') ||
        request.nextUrl.pathname.startsWith('/goals') ||
        request.nextUrl.pathname.startsWith('/groups') ||
        request.nextUrl.pathname.startsWith('/leaderboard') ||
        request.nextUrl.pathname.startsWith('/profile');

    if (!user && isProtected && process.env.NEXT_PUBLIC_MOCK_AUTH !== 'true') {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Rewrite `/` to `/landing` for unauthenticated users
    if (!user && request.nextUrl.pathname === '/' && process.env.NEXT_PUBLIC_MOCK_AUTH !== 'true') {
        const url = request.nextUrl.clone();
        url.pathname = '/landing';
        const rewriteResponse = NextResponse.rewrite(url);
        // Preserve any cookie updates
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            rewriteResponse.cookies.set(cookie.name, cookie.value);
        });
        return rewriteResponse;
    }

    // Redirect `/landing` to `/` for authenticated users
    if (user && request.nextUrl.pathname === '/') {
        // Wait, no, we want to redirect if they explicitly visit `/landing`.
    }
    if (user && request.nextUrl.pathname === '/landing') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
