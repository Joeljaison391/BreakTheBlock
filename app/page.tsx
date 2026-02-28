import { redirect } from "next/navigation";

/**
 * Landing page — redirects to login.
 * Later: check session and redirect to /dashboard if logged in.
 */
export default function HomePage() {
    redirect("/login");
}
