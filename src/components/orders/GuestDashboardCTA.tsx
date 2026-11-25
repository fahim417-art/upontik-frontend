"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LayoutDashboard, ShieldCheck, ArrowRight } from "lucide-react";

interface GuestDashboardCTAProps {
  orderId: string;
  orderNumber: string;
}

export function GuestDashboardCTA({ orderId, orderNumber }: GuestDashboardCTAProps) {
  const { user, isLoadingUser } = useStore();

  useEffect(() => {
    if (!orderId || user) return;
    try {
      const raw = localStorage.getItem("upontik_guest_orders");
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(orderId)) {
        localStorage.setItem("upontik_guest_orders", JSON.stringify([orderId, ...list].slice(0, 10)));
      }
    } catch {}
  }, [orderId, user]);

  if (isLoadingUser) return null;

  if (user) {
    return (
      <div className="my-6 p-5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-[#211D1A] dark:text-[#FAF6F0]">
              অর্ডার ({orderNumber}) আপনার ড্যাশবোর্ডে সংরক্ষিত আছে
            </p>
            <p className="text-[#80644B] dark:text-[#A39789] mt-0.5">
              যেকোনো সময় লাইভ ট্র্যাকিং ও অর্ডার স্ট্যাটাস দেখতে আপনার একাউন্টে যান।
            </p>
          </div>
        </div>
        <Link
          href="/account/orders"
          className="px-5 py-2.5 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-bold uppercase tracking-editorial rounded-sm flex items-center gap-2 shrink-0 hover:bg-[#80644B] transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>আমার ড্যাশবোর্ড</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="my-6 p-5 sm:p-6 bg-[#FAF7F2] dark:bg-[#171411] border-2 border-[#D49542]/50 rounded-sm shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-bold text-[#B87932] dark:text-[#D49542] bg-[#D49542]/15 px-2.5 py-0.5 rounded-full">
            <LayoutDashboard className="w-3 h-3" />
            <span>ড্যাশবোর্ড ও লাইভ ট্র্যাকিং সুবিধা</span>
          </span>
          <h3 className="font-serif text-lg sm:text-xl text-[#211D1A] dark:text-[#FAF6F0]">
            আপনার অর্ডারটি লাইভ ট্র্যাক বা বাতিল করতে চান?
          </h3>
          <p className="text-xs sm:text-sm text-[#5C4A38] dark:text-[#D6C7B2] leading-relaxed">
            যদি আপনার ড্যাশবোর্ড এবং লাইভ পার্সেল ট্র্যাকিং দেখতে চান অথবা অর্ডার বাতিল (Cancel) করতে চান,
            তাহলে নিচের বাটন থেকে <strong>Google Sign-In</strong> করে সরাসরি ড্যাশবোর্ডে যেতে পারবেন।
          </p>
        </div>

        <div className="w-full md:w-72 shrink-0">
          <GoogleSignInButton
            label="Google দিয়ে সাইন-ইন করে ড্যাশবোর্ডে যান"
            redirectTo="/account/orders"
          />
        </div>
      </div>
    </div>
  );
}
