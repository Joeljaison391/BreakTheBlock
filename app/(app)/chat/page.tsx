"use client";

import { useState, useRef, useEffect } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockChats, type ChatMessage } from "@/lib/mockData";
import { Send, ImageIcon, Users } from "lucide-react";
import { useAppStore } from "@/store";

export default function ChatPage() {
    const [chats, setChats] = useState<ChatMessage[]>(mockChats);
    const [chatInput, setChatInput] = useState("");
    const chatRef = useRef<HTMLDivElement>(null);
    const user = useAppStore(s => s.user);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chats]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !user) return;

        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            user: { name: user.name, avatar: user.avatar },
            text: chatInput,
            timestamp: "Just now"
        };

        setChats([...chats, newMsg]);
        setChatInput("");
    };

    return (
        <PageTransition>
            {/* The main container limits height on desktop, fills on mobile. -8rem accounts for top/bottom navs */}
            <div className="flex flex-col flex-1 h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6rem)] border border-border rounded-2xl overflow-hidden bg-card/50 shadow-sm relative">

                {/* Chat Header */}
                <div className="bg-muted/50 border-b border-border p-3 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold"># San Francisco Hackers</span>
                            <span className="text-[10px] text-muted-foreground">General chat</span>
                        </div>
                    </div>
                    <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">3 Online</span>
                </div>

                {/* Chat Messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
                    {chats.map(c => (
                        <div key={c.id} className="flex gap-3">
                            <img src={c.user.avatar} className="w-8 h-8 rounded-full bg-muted shrink-0" alt="" />
                            <div className="flex flex-col flex-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-sm">{c.user.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">{c.timestamp}</span>
                                </div>
                                {c.text && <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">{c.text}</p>}
                                {c.image && (
                                    <div className="mt-2 rounded-xl overflow-hidden border border-border/50 max-w-[240px]">
                                        <img src={c.image} alt="Upload" className="w-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-card border-t border-border flex items-end gap-2 shrink-0">
                    <button type="button" className="p-2 shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    <div className="flex-1 bg-muted/50 border border-border rounded-2xl flex items-center pr-1 focus-within:ring-1 focus-within:ring-primary focus-within:border-transparent transition-all">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Message # SF Hackers"
                            className="w-full bg-transparent text-sm py-2.5 px-3 focus:outline-none placeholder:text-muted-foreground"
                        />
                        <button
                            type="submit"
                            disabled={!chatInput.trim()}
                            className="p-1.5 shrink-0 bg-primary text-white rounded-xl disabled:opacity-50 transition-opacity"
                        >
                            <Send className="w-4 h-4 ml-0.5 mb-0.5" />
                        </button>
                    </div>
                </form>

            </div>
        </PageTransition>
    );
}
