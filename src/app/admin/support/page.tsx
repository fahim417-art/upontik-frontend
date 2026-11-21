"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  MessageSquare,
  Send,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  RefreshCw,
  Search,
  CheckCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function AdminSupportPage() {
  const searchParams = useSearchParams();
  const { user, showToast } = useStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check URL query parameters for direct messaging a customer
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchSessionMessages(selectedSessionId);
      const interval = setInterval(() => fetchSessionMessages(selectedSessionId), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/support/admin/conversations", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        let list = data.data;

        // Check if direct customer initiated via query params
        const targetSessionId = searchParams.get("sessionId");
        const targetName = searchParams.get("name");
        const targetEmail = searchParams.get("email");
        const targetPhone = searchParams.get("phone");
        const targetCustomerId = searchParams.get("customerId");

        if (targetSessionId && !list.some((c: any) => c._id === targetSessionId)) {
          const newThread = {
            _id: targetSessionId,
            customerId: targetCustomerId || targetSessionId.replace("cust_", ""),
            customerName: targetName || "Patron",
            customerEmail: targetEmail || "",
            customerPhone: targetPhone || "",
            lastMessage: "Direct message thread initiated by admin",
            lastSender: "admin",
            lastUpdated: new Date().toISOString(),
            unreadCount: 0,
            totalMessages: 0,
          };
          list = [newThread, ...list];
          setSelectedSessionId(targetSessionId);
        } else if (!selectedSessionId) {
          if (targetSessionId) {
            setSelectedSessionId(targetSessionId);
          } else if (list.length > 0) {
            setSelectedSessionId(list[0]._id);
          }
        }

        setConversations(list);
      }
    } catch {} finally {
      setIsLoading(false);
    }
  };

  const fetchSessionMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/support/admin/messages/${sessionId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMessages(data.data);
      }
    } catch {}
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedSessionId) return;

    setIsSending(true);
    try {
      const selectedThread = conversations.find((c) => c._id === selectedSessionId);
      const res = await fetch("/api/support/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId: selectedSessionId,
          customerId: selectedThread?.customerId || selectedSessionId.replace("cust_", ""),
          message: replyText.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyText("");
        fetchSessionMessages(selectedSessionId);
        fetchConversations();
      } else {
        showToast(data.error || "Failed to send reply", "error");
      }
    } catch {
      showToast("Reply error", "error");
    } finally {
      setIsSending(false);
    }
  };

  const selectedConv = conversations.find((c) => c._id === selectedSessionId);

  const filteredConversations = conversations.filter(
    (c) =>
      c.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerPhone?.includes(searchQuery) ||
      c.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC8]/70 dark:border-[#2C2620] gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#FAF6F0] font-normal">
            Customer Support & Direct Inboxes
          </h1>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
            Real-time inquiries and direct message inboxes for every patron. See live read receipts (Seen / পঠিত).
          </p>
        </div>

        <button
          onClick={() => {
            fetchConversations();
            if (selectedSessionId) fetchSessionMessages(selectedSessionId);
            showToast("Messages refreshed", "info");
          }}
          className="py-2 px-4 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] text-[#211D1A] dark:text-[#F5EFE8] rounded text-xs flex items-center gap-2 hover:border-[#D49542] transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#D49542]" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Main Two-Pane Chat Container */}
      <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        {/* Left Pane: Conversations List (5 Cols) */}
        <div className="md:col-span-5 border-r border-[#E8DFC8]/60 dark:border-[#2C2620] flex flex-col bg-[#FAF7F2]/40 dark:bg-[#12100E]">
          {/* Search box */}
          <div className="p-3 border-b border-[#E8DFC8]/60 dark:border-[#2C2620]">
            <div className="flex items-center gap-2 bg-ivory dark:bg-[#1E1A16] px-3 py-1.5 rounded border border-[#E8DFC8]/60 dark:border-[#2C2620]">
              <Search className="w-3.5 h-3.5 text-[#80644B] dark:text-[#A39789]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patron by name, phone, or message..."
                className="w-full bg-transparent text-xs text-[#211D1A] dark:text-[#FAF6F0] focus:outline-none placeholder-[#80644B]/60 dark:placeholder-[#A39789]/60"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620]">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-[#80644B] dark:text-[#A39789]">
                Loading patron inboxes...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#80644B] dark:text-[#A39789]">
                No customer conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv._id === selectedSessionId;
                return (
                  <button
                    key={conv._id}
                    onClick={() => setSelectedSessionId(conv._id)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                      isSelected
                        ? "bg-[#FAF7F2] dark:bg-[#1E1A16] border-l-4 border-l-[#D49542]"
                        : "hover:bg-[#EAE0D0]/20 dark:hover:bg-[#1E1A16]/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#D49542]/15 text-[#B87932] dark:text-[#D49542] flex items-center justify-center shrink-0 font-bold text-xs uppercase border border-[#D49542]/30">
                      {conv.customerName ? conv.customerName.charAt(0) : "P"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-serif font-bold text-xs text-[#211D1A] dark:text-[#F5EFE8] truncate">
                          {conv.customerName || "Patron"}
                        </span>
                        <span className="text-[10px] text-[#80644B] dark:text-[#A39789] shrink-0 font-mono">
                          {new Date(conv.lastUpdated).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#80644B] dark:text-[#A39789] truncate">
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {conv.customerPhone && (
                          <span className="text-[9px] font-mono text-[#D49542]">
                            📞 {conv.customerPhone}
                          </span>
                        )}
                        {conv.customerId && (
                          <span className="text-[9px] font-mono bg-[#D49542]/10 text-[#B87932] dark:text-[#D49542] px-1 rounded">
                            #CUST-{String(conv.customerId).slice(-5).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#D49542] text-[#0E0C0A] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Live Chat Thread (7 Cols) */}
        <div className="md:col-span-7 flex flex-col justify-between bg-ivory dark:bg-[#171411]">
          {selectedSessionId && selectedConv ? (
            <>
              {/* Header */}
              <div className="p-3.5 border-b border-[#E8DFC8]/60 dark:border-[#2C2620] flex items-center justify-between bg-[#FAF7F2]/60 dark:bg-[#1E1A16]/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D49542] text-[#0E0C0A] flex items-center justify-center font-serif font-bold text-xs uppercase shadow-sm">
                    {selectedConv.customerName ? selectedConv.customerName.charAt(0) : "P"}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#211D1A] dark:text-[#F5EFE8] flex items-center gap-2">
                      <span>{selectedConv.customerName || "Patron"}</span>
                      {selectedConv.customerId && (
                        <span className="text-[10px] font-mono font-normal text-[#D49542] bg-[#D49542]/15 px-1.5 py-0.5 rounded">
                          #UPK-CUST-{String(selectedConv.customerId).slice(-6).toUpperCase()}
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-[#80644B] dark:text-[#A39789] flex items-center gap-3 mt-0.5">
                      {selectedConv.customerPhone && <span>📞 {selectedConv.customerPhone}</span>}
                      {selectedConv.customerEmail && <span>✉️ {selectedConv.customerEmail}</span>}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Direct Customer Inbox</span>
                </span>
              </div>

              {/* Message thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[380px] max-h-[460px]">
                {messages.length === 0 ? (
                  <div className="py-20 text-center text-xs text-[#80644B] dark:text-[#A39789]">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#D49542]/60" />
                    <p className="font-serif text-sm text-[#211D1A] dark:text-[#FAF6F0]">
                      No previous messages with this customer.
                    </p>
                    <p className="mt-1">Type below to send a direct message to this patron.</p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isAdmin = m.sender === "admin";
                    return (
                      <div
                        key={m._id || idx}
                        className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                            isAdmin
                              ? "bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] rounded-br-none"
                              : "bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] text-[#211D1A] dark:text-[#FAF6F0] rounded-bl-none"
                          }`}
                        >
                          <p>{m.message}</p>
                        </div>
                        {isAdmin ? (
                          <span className="flex items-center gap-1.5 text-[9px] text-[#80644B] dark:text-[#A39789] mt-0.5 font-mono px-1">
                            <span>
                              Studio Support •{" "}
                              {new Date(m.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {m.isRead ? (
                              <span className="text-blue-500 font-bold flex items-center gap-0.5 ml-1">
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>
                                  Seen{" "}
                                  {m.readAt
                                    ? new Date(m.readAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "পঠিত"}
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-400 flex items-center gap-0.5 ml-1">
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>Delivered (অদেখা)</span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#80644B] dark:text-[#A39789] mt-0.5 font-mono px-1">
                            {m.senderName || "Customer"} •{" "}
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Form */}
              <form
                onSubmit={handleSendReply}
                className="p-3 border-t border-[#E8DFC8]/60 dark:border-[#2C2620] bg-[#FAF7F2]/40 dark:bg-[#12100E] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Send message to ${selectedConv.customerName || "customer"}...`}
                  className="flex-1 p-2.5 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-xs text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSending || !replyText.trim()}
                  className="px-5 py-2.5 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] text-xs font-bold rounded flex items-center gap-1.5 hover:bg-[#80644B] disabled:opacity-50 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#80644B] dark:text-[#A39789]">
              Select a customer conversation from the list to view inquiry details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
