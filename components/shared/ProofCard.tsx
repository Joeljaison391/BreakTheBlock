"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowBigUp, MessageCircle, MoreHorizontal } from "lucide-react";
import type { Proof } from "@/lib/mockData";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { UserAvatar } from "./UserAvatar"; // Assuming we have this, else we'll mock it
import { formatPoints, cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export function ProofCard({ proof }: { proof: Proof }) {
    const [isHovered, setIsHovered] = useState(false);
    const [upvotes, setUpvotes] = useState(proof.upvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [mockComments, setMockComments] = useState(proof.comments);
    const addPoints = useAppStore((s) => s.addPoints);

    const handleUpvote = () => {
        if (hasUpvoted) return;
        setUpvotes((u) => u + 1);
        setHasUpvoted(true);
        addPoints(2); // Earn 2 pts for upvoting
        toast.success("+2 points for supporting a block breaker!");

        // Mini confetti at origin of click ideally, but center screen is fine for mock
        confetti({
            particleCount: 15,
            spread: 40,
            origin: { y: 0.8 },
            colors: ['#ff6b35', '#ef4444']
        });
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newCmd = {
            id: Date.now().toString(),
            text: commentText,
            user: { name: "You (Mock)", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=You" },
            timestamp: "Just now"
        };
        setMockComments([...mockComments, newCmd]);
        setCommentText("");
        addPoints(5);
        toast.success("+5 points for engaging with the community!");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 rounded-2xl bg-card border border-border/50 p-4 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={proof.user.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{proof.user.name}</span>
                        <span className="text-xs text-muted-foreground">{proof.timestamp} &middot; {proof.goalTitle}</span>
                    </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Caption */}
            <p className="text-sm text-foreground">{proof.caption}</p>

            {/* Before / After Images */}
            <div
                className="relative w-full max-w-sm mx-auto aspect-[4/5] sm:aspect-square rounded-xl overflow-hidden bg-black cursor-pointer group shadow-inner"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(!isHovered)}
            >
                <img
                    src={proof.beforePhoto}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-contain"
                />

                <motion.div
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    initial={{ clipPath: "inset(0 0 0 100%)" }}
                    animate={{ clipPath: isHovered ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <img
                        src={proof.afterPhoto}
                        alt="After"
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </motion.div>

                {/* Swipe Hint */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/50 backdrop-blur text-[10px] font-bold text-white uppercase tracking-wider">
                    Before
                </div>
                <motion.div
                    className="absolute top-3 right-3 px-2 py-1 rounded bg-secondary/80 backdrop-blur text-[10px] font-bold text-white uppercase tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                >
                    After
                </motion.div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleUpvote}
                        className={cn(
                            "flex items-center gap-1.5 text-sm font-medium transition-colors",
                            hasUpvoted ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <ArrowBigUp className={cn("w-6 h-6", hasUpvoted && "fill-primary")} />
                        <span>{upvotes}</span>
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={cn(
                            "flex items-center gap-1.5 text-sm font-medium transition-colors",
                            showComments ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>{mockComments.length} Comments</span>
                    </button>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">
                    +{formatPoints(proof.points)}
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-2 pt-3 border-t border-border/50 flex flex-col gap-3">
                    {mockComments.map(c => (
                        <div key={c.id} className="flex gap-2">
                            <img src={c.user.avatar} className="w-6 h-6 rounded-full bg-muted mt-0.5" alt="" />
                            <div className="flex flex-col bg-muted/30 rounded-xl px-3 py-2 flex-1">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-bold">{c.user.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{c.timestamp}</span>
                                </div>
                                <span className="text-sm mt-0.5">{c.text}</span>
                            </div>
                        </div>
                    ))}
                    <form onSubmit={handleAddComment} className="flex gap-2 mt-1 relative">
                        <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full text-sm bg-muted/50 border border-border rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:opacity-50 font-bold text-xs px-2"
                        >
                            Post
                        </button>
                    </form>
                </div>
            )}
        </motion.div>
    );
}
