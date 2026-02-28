import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware — Auth Guard
 *
 * Currently: always allows access (mock auth is handled client-side).
 * Later: replace with Supabase SSR session check.
 */
export function middleware(request: NextRequest) {
    // TODO: Replace with Supabase session check in production
    // const supabase = createServerClient(...)
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user && isProtectedRoute) redirect to /login

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
