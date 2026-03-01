"use client";

import { useState, useRef, useEffect } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import { Send, ImageIcon, Users, Loader2 } from "lucide-react";
import { useAppStore } from "@/store";
import { getUserGroup, fetchMessages, sendMessage } from "@/app/actions/chat";
import { createClient } from "@/utils/supabase/client";

interface ChatMessage {
    id: string;
    user_id: string;
    text: string | null;
    image_url: string | null;
    created_at: string;
    profiles?: { name: string; avatar_url: string | null };
}

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [groupId, setGroupId] = useState<string | null>(null);
    const [groupName, setGroupName] = useState("Group Chat");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const user = useAppStore(s => s.user);

    // Load group + messages on mount
    useEffect(() => {
        async function load() {
            try {
                const group = await getUserGroup();
                if (group) {
                    setGroupId(group.id);
                    setGroupName(group.name);
                    const msgs = await fetchMessages(group.id);
                    setMessages(msgs);
                }
            } catch (e) {
                console.error("[Chat] Load error:", e);
            }
            setLoading(false);
        }
        load();
    }, []);

    // Subscribe to realtime inserts
    useEffect(() => {
        if (!groupId) return;

        const supabase = createClient();
        const channel = supabase
            .channel(`chat_${groupId}`)
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "chat_messages",
                filter: `group_id=eq.${groupId}`,
            }, async (payload) => {
                // Fetch the full message with profile join
                const { data } = await supabase
                    .from("chat_messages")
                    .select("*, profiles:user_id(name, avatar_url)")
                    .eq("id", payload.new.id)
                    .single();
                if (data) {
                    setMessages(prev => [...prev, data]);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [groupId]);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !user || !groupId || sending) return;

        const text = chatInput.trim();
        setChatInput("");
        setSending(true);

        try {
            const formData = new FormData();
            formData.set("text", text);
            const result = await sendMessage(groupId, formData);
            if (result.error) {
                console.error("[Chat] Send error:", result.error);
            }
        } catch (e) {
            console.error("[Chat] Send error:", e);
        }
        setSending(false);
    };

    const formatTime = (ts: string) => {
        const d = new Date(ts);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        if (diffMs < 60000) return "Just now";
        if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
        if (diffMs < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return d.toLocaleDateString();
    };

    if (loading) {
        return (
            <PageTransition>
                <div className="flex items-center justify-center h-[50vh]">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            </PageTransition>
        );
    }

    if (!groupId) {
        return (
            <PageTransition>
                <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
                    <div className="text-5xl mb-4">💬</div>
                    <h3 className="font-black text-xl mb-2">No Group Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Join or create a group to start chatting with your crew. Head to the Leaderboard page to create one!
                    </p>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="flex flex-col flex-1 h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6rem)] border border-border rounded-2xl overflow-hidden bg-card/50 shadow-sm relative">

                {/* Chat Header */}
                <div className="bg-muted/50 border-b border-border p-3 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold"># {groupName}</span>
                            <span className="text-[10px] text-muted-foreground">Group chat</span>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                            No messages yet. Be the first to say hi! 👋
                        </div>
                    ) : messages.map(c => (
                        <div key={c.id} className="flex gap-3">
                            <img
                                src={c.profiles?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${c.profiles?.name || "user"}`}
                                className="w-8 h-8 rounded-full bg-muted shrink-0"
                                alt=""
                            />
                            <div className="flex flex-col flex-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-sm">{c.profiles?.name || "User"}</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">{formatTime(c.created_at)}</span>
                                </div>
                                {c.text && <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">{c.text}</p>}
                                {c.image_url && (
                                    <div className="mt-2 rounded-xl overflow-hidden border border-border/50 max-w-[240px]">
                                        <img src={c.image_url} alt="Upload" className="w-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-card border-t border-border flex items-end gap-2 shrink-0">
                    <div className="flex-1 bg-muted/50 border border-border rounded-2xl flex items-center pr-1 focus-within:ring-1 focus-within:ring-primary focus-within:border-transparent transition-all">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={`Message # ${groupName}`}
                            className="w-full bg-transparent text-sm py-2.5 px-3 focus:outline-none placeholder:text-muted-foreground"
                        />
                        <button
                            type="submit"
                            disabled={!chatInput.trim() || sending}
                            className="p-1.5 shrink-0 bg-primary text-white rounded-xl disabled:opacity-50 transition-opacity"
                        >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5 mb-0.5" />}
                        </button>
                    </div>
                </form>

            </div>
        </PageTransition>
    );
}
