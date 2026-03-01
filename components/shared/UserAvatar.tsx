"use client";

import { cn, getInitials } from "@/lib/utils";
import type { MockUser } from "@/lib/mockData";

interface UserAvatarProps {
    user: MockUser | null;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeMap = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-12 w-12 text-base",
};

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
    if (!user) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center rounded-full bg-muted text-muted-foreground",
                    sizeMap[size],
                    className
                )}
            >
                ?
            </div>
        );
    }

    if (user.avatar) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={user.avatar}
                alt={user.name}
                className={cn("rounded-full object-cover", sizeMap[size], className)}
            />
        );
    }

    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-semibold text-white",
                sizeMap[size],
                className
            )}
        >
            {getInitials(user.name)}
        </div>

    );
}
