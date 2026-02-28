import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Break the Block",
        template: "%s | Break the Block",
    },
    description:
        "A gamified goal-tracking app. Set goals, log progress, and break through your blocks — one tiny step at a time.",
    keywords: ["goal tracking", "productivity", "gamification", "habit tracker"],
    openGraph: {
        title: "Break the Block",
        description: "Track goals. Earn points. Break through.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={inter.variable}>
                <ThemeProvider>
                    {children}
                    <Toaster
                        position="bottom-right"
                        richColors
                        theme="dark"
                        toastOptions={{
                            style: {
                                background: "var(--color-card)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-foreground)",
                            },
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
