"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Phone, Sparkles, CheckCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function LiveChatWidget() {
  const { user } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or restore session
  useEffect(() => {
    let sid = "";
    try {
      sid = localStorage.getItem("upontik_chat_sid") || "";
      if (!sid) {
        sid = `upk_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        localStorage.setItem("upontik_chat_sid", sid);
      }
      setSessionId(sid);

      const savedName = localStorage.getItem("upontik_chat_name") || user?.name || "";
      const savedPhone = localStorage.getItem("upontik_chat_phone") || user?.phone || "";
      if (savedName) {
        setCustomerName(savedName);
        setHasStarted(true);
      }
      if (savedPhone) setCustomerPhone(savedPhone);
    } catch {}
  }, [user]);

  // Poll for replies when open or periodic
  useEffect(() => {
    if (!sessionId) return;
    fetchMessages();

    const interval = setInterval(fetchMessages, isOpen ? 3000 : 15000);
    return () => clearInterval(interval);
  }, [sessionId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const fetchMessages = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/support/messages?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        if (!isOpen && data.data.length > messages.length) {
          const newReplies = data.data.filter(
            (m: any) => m.sender === "admin" && !m.isRead
          ).length;
          if (newReplies > 0) setUnreadCount(newReplies);
        }
        setMessages(data.data);
        if (data.data.length > 0) setHasStarted(true);
      }
    } catch {}
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const msg = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      if (customerName) {
        localStorage.setItem("upontik_chat_name", customerName);
      }
      if (customerPhone) {
        localStorage.setItem("upontik_chat_phone", customerPhone);
      }
    } catch {}

    try {
      const res = await fetch("/api/support/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: msg,
          senderName: customerName.trim() || user?.name || "Customer",
          senderEmail: user?.email || undefined,
          senderPhone: customerPhone.trim() || user?.phone || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHasStarted(true);
        fetchMessages();
      }
    } catch {} finally {
      setIsSending(false);
    }
  };

  const whatsappUrl = `https://wa.me/8801917720875?text=${encodeURIComponent(
    "Hello UPONTIK Team! I need assistance with handcrafted bags and orders."
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border border-[#D49542]/40"
          aria-label="Open Live Chat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-[#D49542] dark:text-[#0E0C0A]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#211D1A]" />
          </div>
          <span className="text-xs font-serif font-medium tracking-wide">
            Live Support • সহায়তা
          </span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Live Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#1F1B17] text-[#FAF6F0] p-4 flex items-center justify-between border-b border-[#2C2620]">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full bg-[#D49542] text-[#0E0C0A] flex items-center justify-center font-serif font-bold text-xs">
                UP
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1 ring-[#1F1B17]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xs tracking-wide">
                  UPONTIK Atelier Support
                </h3>
                <p className="text-[10px] text-[#A39789] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                  সরাসরি স্টুডিওতে যুক্ত আছেন
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="p-1.5 hover:bg-white/10 rounded text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded text-[#A39789] hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick WhatsApp Banner */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 border-b border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> হোয়াটসঅ্যাপে সরাসরি কথা বলতে চান?
            </span>
            <span className="font-bold underline text-[10px]">Open WhatsApp →</span>
          </a>

          {/* Message Thread */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FAF7F2]/40 dark:bg-[#12100E] text-xs">
            {/* Studio Welcome Bubble */}
            <div className="flex flex-col items-start">
              <div className="max-w-[85%] rounded-md px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] text-[#211D1A] dark:text-[#FAF6F0] rounded-bl-none shadow-xs">
                <p className="font-serif font-bold text-xs text-[#D49542] mb-1">
                  উপন্তিক হ্যান্ডিক্রাফট স্টুডিও
                </p>
                <p className="leading-relaxed text-[11px]">
                  স্বাগতম! আমাদের হস্তশিল্পের যেকোনো পণ্য, কার্ট বা ডেলিভারি নিয়ে আপনার কোনো জিজ্ঞাসা থাকলে সরাসরি লিখুন। আমাদের টিম দ্রুত উত্তর দেবে।
                </p>
              </div>
              <span className="text-[9px] text-[#80644B] dark:text-[#A39789] mt-0.5 px-1 font-mono">
                Atelier Team
              </span>
            </div>

            {/* Conversation Messages */}
            {messages.map((m, idx) => {
              const isAdmin = m.sender === "admin";
              return (
                <div
                  key={m._id || idx}
                  className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-md px-3.5 py-2 shadow-xs leading-relaxed text-xs ${
                      isAdmin
                        ? "bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] text-[#211D1A] dark:text-[#FAF6F0] rounded-bl-none"
                        : "bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] rounded-br-none"
                    }`}
                  >
                    <p>{m.message}</p>
                  </div>
                  <span className="text-[9px] text-[#80644B] dark:text-[#A39789] mt-0.5 px-1 font-mono flex items-center gap-1">
                    <span>
                      {isAdmin ? "Studio Support" : "You"} •{" "}
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {!isAdmin && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Contact Form if first message */}
          {!hasStarted && (
            <div className="p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border-t border-[#E8DFC8]/60 dark:border-[#2C2620] text-[11px] space-y-1.5">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="আপনার নাম (ঐচ্ছিক)"
                className="w-full p-1.5 bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-xs text-[#211D1A] dark:text-[#FAF6F0] focus:outline-none"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="মোবাইল নম্বর (যেমন: 017...)"
                className="w-full p-1.5 bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-xs text-[#211D1A] dark:text-[#FAF6F0] focus:outline-none"
              />
            </div>
          )}

          {/* Chat Input Field */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 border-t border-[#E8DFC8] dark:border-[#2C2620] bg-ivory dark:bg-[#171411] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="একটি বার্তা লিখুন..."
              className="flex-1 p-2 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="p-2 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] rounded-sm hover:bg-[#80644B] disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
