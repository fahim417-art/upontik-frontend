"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Sparkles,
  CheckCheck,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function LiveChatWidget() {
  const pathname = usePathname();
  const { user, isLoadingUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If on admin routes or if authenticated user is admin, completely hide customer support widget
  if (pathname.startsWith("/admin") || user?.role === "admin") {
    return null;
  }

  // Consistent session ID based on authenticated Customer ID
  const sessionId = user ? `cust_${user.userId}` : "";

  // Poll for messages when signed in
  useEffect(() => {
    if (!sessionId) return;
    fetchMessages();

    const interval = setInterval(fetchMessages, isOpen ? 3000 : 12000);
    return () => clearInterval(interval);
  }, [sessionId, isOpen]);

  // When widget is open, mark admin messages as seen and scroll down
  useEffect(() => {
    if (isOpen && sessionId) {
      setUnreadCount(0);
      markAsSeen();
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, sessionId]);

  const markAsSeen = async () => {
    if (!sessionId) return;
    try {
      await fetch("/api/support/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch {}
  };

  const fetchMessages = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/support/messages?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        if (!isOpen) {
          const unreadReplies = data.data.filter(
            (m: any) => m.sender === "admin" && !m.isRead
          ).length;
          setUnreadCount(unreadReplies);
        }
        setMessages(data.data);
      }
    } catch {}
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !sessionId) return;

    const msg = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      const res = await fetch("/api/support/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          customerId: user.userId,
          message: msg,
          senderName: user.name || "Patron",
          senderEmail: user.email,
          senderPhone: user.phone || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchMessages();
      }
    } catch {} finally {
      setIsSending(false);
    }
  };

  const whatsappUrl = `https://wa.me/8801917720875?text=${encodeURIComponent(
    `Hello UPONTIK Team! I need assistance with handcrafted bags and atelier orders. (Patron: ${
      user?.name || "Guest"
    })`
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border border-[#D49542]/50"
          aria-label="Open Live Support"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-[#D49542] dark:text-[#0E0C0A]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#211D1A]" />
          </div>
          <span className="text-xs font-serif font-medium tracking-wide">
            Live Support • সহায়তা
          </span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Live Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[540px] bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#1E1A16] dark:bg-[#0E0C0A] text-[#FAF6F0] p-4 flex items-center justify-between border-b border-[#2C2620]">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-[#D49542] text-[#0E0C0A] flex items-center justify-center font-serif font-bold text-xs shadow-md">
                UP
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1 ring-[#1E1A16]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm tracking-wide flex items-center gap-1.5">
                  <span>UPONTIK Atelier Support</span>
                  <Sparkles className="w-3 h-3 text-[#D49542]" />
                </h3>
                <p className="text-[10px] text-[#A39789] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                  সরাসরি স্টুডিও ইনবক্সে যুক্ত আছেন
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="p-1.5 hover:bg-white/10 rounded-full text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-[#A39789] hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick WhatsApp Link Banner */}
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

          {/* Content Area */}
          {!user ? (
            /* Unauthenticated Gate */
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-[#FAF7F2]/60 dark:bg-[#12100E]">
              <div className="w-14 h-14 rounded-full bg-[#D49542]/15 text-[#D49542] flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg text-[#211D1A] dark:text-[#F5EFE8] font-bold mb-1.5">
                কাস্টমার সাইন-ইন আবশ্যক
              </h4>
              <p className="text-xs text-[#80644B] dark:text-[#A39789] max-w-xs leading-relaxed mb-6">
                লাইভ সাপোর্ট চ্যাট ও ব্যক্তিগত অর্ডারের সহায়তার জন্য অনুগ্রহ করে আপনার কাস্টমার একাউন্টে সাইন-ইন করুন।
              </p>
              <Link
                href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
                onClick={() => setIsOpen(false)}
                className="w-full max-w-xs py-3 px-6 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] rounded-full text-xs font-bold uppercase tracking-editorial flex items-center justify-center gap-2 hover:bg-[#80644B] transition-colors shadow-md"
              >
                <span>কাস্টমার আইডিতে সাইন-ইন করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-[#80644B] dark:text-[#A39789] mt-3">
                নতুন কাস্টমার?{" "}
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="text-[#D49542] font-bold underline"
                >
                  নতুন আইডি খুলুন
                </Link>
              </p>
            </div>
          ) : (
            /* Authenticated Message Thread */
            <>
              {/* Patron ID Verification Pill */}
              <div className="px-3.5 py-1.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border-b border-[#E8DFC8]/60 dark:border-[#2C2620] flex items-center justify-between text-[11px]">
                <span className="text-[#80644B] dark:text-[#A39789] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>ভেরিফায়েড প্যাট্রন: {user.name}</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-[#D49542]">
                  #UPK-CUST-{user.userId.slice(-6).toUpperCase()}
                </span>
              </div>

              {/* Message List */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FAF7F2]/40 dark:bg-[#12100E] text-xs">
                {/* Atelier Studio Greeting */}
                <div className="flex flex-col items-start">
                  <div className="max-w-[85%] rounded-lg px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] text-[#211D1A] dark:text-[#FAF6F0] rounded-bl-none shadow-xs">
                    <p className="font-serif font-bold text-xs text-[#D49542] mb-1">
                      উপন্তিক হ্যান্ডিক্রাফট স্টুডিও
                    </p>
                    <p className="leading-relaxed text-[11px]">
                      স্বাগতম, {user.name}! আপনার অর্ডার, পণ্য বা কার্ট সংক্রান্ত যেকোনো বিষয়ে সরাসরি মেসেজ পাঠাতে পারেন। আমাদের প্রতিনিধি দ্রুত রিপ্লাই দেবেন।
                    </p>
                  </div>
                  <span className="text-[9px] text-[#80644B] dark:text-[#A39789] mt-0.5 px-1 font-mono">
                    Atelier Concierge
                  </span>
                </div>

                {/* Chat History */}
                {messages.map((m, idx) => {
                  const isAdmin = m.sender === "admin";
                  return (
                    <div
                      key={m._id || idx}
                      className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3.5 py-2 shadow-xs leading-relaxed text-xs ${
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
                        {!isAdmin && (
                          <span title={m.isRead ? "Seen by Admin" : "Delivered"}>
                            <CheckCheck
                              className={`w-3 h-3 ${m.isRead ? "text-blue-500" : "text-gray-400"}`}
                            />
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-[#E8DFC8] dark:border-[#2C2620] bg-ivory dark:bg-[#171411] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="একটি বার্তা লিখুন..."
                  className="flex-1 p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSending || !inputText.trim()}
                  className="p-2.5 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] rounded-sm hover:bg-[#80644B] disabled:opacity-40 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
