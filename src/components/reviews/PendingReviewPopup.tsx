"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { Star, X, Camera, Sparkles, ArrowRight } from "lucide-react";

interface PendingItem {
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
}

export function PendingReviewPopup() {
  const { user } = useStore();
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (typeof window !== "undefined" && sessionStorage.getItem("upontik_review_popup_dismissed")) {
      return;
    }

    const fetchPending = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("upontik_token") : null;
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch("/api/reviews/pending", {
          headers,
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPendingItem(data.data[0]);
          setIsOpen(true);
        }
      } catch {}
    };

    fetchPending();
  }, [user]);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem("upontik_review_popup_dismissed", "1");
    } catch {}
  };

  if (!isOpen || !pendingItem) return null;

  const reviewHref = `/account/reviews?orderId=${encodeURIComponent(pendingItem.orderId)}&productId=${encodeURIComponent(pendingItem.productId)}&productName=${encodeURIComponent(pendingItem.productName)}&productSlug=${encodeURIComponent(pendingItem.productSlug || "")}&productImage=${encodeURIComponent(pendingItem.productImage || "")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-ivory dark:bg-[#171411] border-2 border-[#D49542]/60 rounded-sm shadow-2xl p-6 sm:p-7">
        <button
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 text-[#80644B] hover:text-[#211D1A] dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#D49542]/15 border border-[#D49542]/40 flex items-center justify-center mx-auto mb-3 text-[#D49542]">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B87932] dark:text-[#D49542] font-bold block mb-1">
            Order Delivered • {pendingItem.orderNumber}
          </span>
          <h2 className="font-serif text-2xl text-[#211D1A] dark:text-[#FAF6F0]">
            Plz review your product
          </h2>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1 leading-relaxed">
            আপনার ডেলিভারি হওয়া প্রোডাক্টটি হাতে পেয়ে কেমন লেগেছে? ছবি আপলোড করে ও রেটিং দিয়ে আপনার মূল্যবান রিভিউ দিন।
          </p>
        </div>

        <div className="p-3.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm flex items-center gap-3.5 mb-6">
          <div className="w-16 h-16 bg-sand/30 rounded overflow-hidden relative shrink-0">
            {pendingItem.productImage ? (
              <Image
                src={pendingItem.productImage}
                alt={pendingItem.productName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#80644B]">
                UPONTIK
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-bold text-[#211D1A] dark:text-[#FAF6F0] truncate">
              {pendingItem.productName}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[#D49542]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D49542]" />
              ))}
            </div>
            <p className="text-[10px] text-[#80644B] dark:text-[#A39789] mt-1 flex items-center gap-1">
              <Camera className="w-3 h-3 text-[#D49542]" />
              <span>Photo + Rating + Message</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            href={reviewHref}
            onClick={handleDismiss}
            className="flex-1 py-3 px-4 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-bold uppercase tracking-editorial rounded-sm flex items-center justify-center gap-2 hover:bg-[#80644B] transition-colors shadow-sm"
          >
            <span>Review Now / রিভিউ দিন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="py-3 px-4 border border-[#E8DFC8] dark:border-[#2C2620] text-xs text-[#80644B] dark:text-[#A39789] rounded-sm hover:text-[#211D1A] dark:hover:text-white transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
