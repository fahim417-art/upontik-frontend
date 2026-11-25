"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Star,
  UploadCloud,
  X,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Camera,
  Sparkles,
} from "lucide-react";

function compressReviewImage(file: File, maxDim = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas error"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AccountReviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoadingUser, showToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingList, setPendingList] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    orderId: string;
    productId: string;
    productName: string;
    productSlug: string;
    productImage: string;
  } | null>(null);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/auth/login");
      return;
    }

    const qOrderId = searchParams.get("orderId");
    const qProductId = searchParams.get("productId");
    const qProductName = searchParams.get("productName");
    const qProductSlug = searchParams.get("productSlug") || "";
    const qProductImage = searchParams.get("productImage") || "";

    if (qProductId && qProductName) {
      setSelectedItem({
        orderId: qOrderId || "",
        productId: qProductId,
        productName: qProductName,
        productSlug: qProductSlug,
        productImage: qProductImage,
      });
    }

    if (user) {
      fetchPending();
    }
  }, [user, isLoadingUser, searchParams, router]);

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
      if (data.success && Array.isArray(data.data)) {
        setPendingList(data.data);
        if (!searchParams.get("productId") && data.data.length > 0) {
          setSelectedItem(data.data[0]);
        }
      }
    } catch {}
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remainingSlots = 3 - images.length;
    if (remainingSlots <= 0) {
      showToast("সর্বোচ্চ ৩টি ছবি আপলোড করা যাবে।", "info");
      return;
    }

    const chosen = Array.from(files).slice(0, remainingSlots);
    const compressed: string[] = [];
    for (const f of chosen) {
      try {
        const dataUrl = await compressReviewImage(f);
        compressed.push(dataUrl);
      } catch {
        showToast("ছবি প্রসেস করতে সমস্যা হয়েছে।", "error");
      }
    }
    setImages((prev) => [...prev, ...compressed]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !comment.trim()) {
      showToast("অনুগ্রহ করে আপনার মতামত (Message) লিখুন।", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("upontik_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          productId: selectedItem.productId,
          orderId: selectedItem.orderId || undefined,
          customerName: user?.name || "UPONTIK Patron",
          rating,
          title: title.trim() || `${selectedItem.productName} Review`,
          comment: comment.trim(),
          images,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("ধন্যবাদ! আপনার রিভিউ সফলভাবে প্রকাশিত হয়েছে।", "success");
        setSubmittedSlug(selectedItem.productSlug || "");
        setComment("");
        setTitle("");
        setImages([]);
      } else {
        showToast(data.error || "রিভিউ সাবমিট করা যায়নি।", "error");
      }
    } catch {
      showToast("নেটওয়ার্ক সমস্যা, অনুগ্রহ করে আবার চেষ্টা করুন।", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ivory dark:bg-[#0E0C0A]">
        <Loader2 className="w-6 h-6 animate-spin text-[#D49542]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-ivory dark:bg-[#0E0C0A] text-[#211D1A] dark:text-[#F5EFE8]">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-[#80644B] dark:text-[#D49542] hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Orders</span>
        </Link>

        <div className="pb-6 border-b border-[#E8DFC8] dark:border-[#2C2620] mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D49542] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Patron Review</span>
          </span>
          <h1 className="font-serif text-3xl text-[#211D1A] dark:text-[#FAF6F0]">
            Share Your Experience & Photos
          </h1>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
            আপনার রিভিউ ও প্রোডাক্টের ছবি প্রোডাক্ট পেজ এবং হোম পেজে প্রদর্শিত হবে।
          </p>
        </div>

        {submittedSlug !== null ? (
          <div className="p-8 bg-ivory-light dark:bg-[#171411] border border-[#D49542]/50 rounded-sm text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="font-serif text-2xl">ধন্যবাদ! আপনার রিভিউ প্রকাশিত হয়েছে</h2>
            <p className="text-xs text-[#80644B] dark:text-[#A39789]">
              আপনার মতামত ও ছবি এখন হোম পেজ এবং প্রোডাক্ট ডিটেইলস পেজে দেখা যাচ্ছে।
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {submittedSlug && (
                <Link
                  href={`/product/${submittedSlug}`}
                  className="px-5 py-2.5 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-bold uppercase tracking-editorial rounded-sm"
                >
                  প্রোডাক্ট পেজে দেখুন
                </Link>
              )}
              <Link
                href="/account"
                className="px-5 py-2.5 border border-[#E8DFC8] dark:border-[#2C2620] text-xs font-bold uppercase tracking-editorial rounded-sm"
              >
                ড্যাশবোর্ডে ফিরে যান
              </Link>
            </div>
          </div>
        ) : !selectedItem ? (
          <div className="p-8 bg-ivory-light dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-center space-y-3">
            <p className="font-serif text-lg">এই মুহূর্তে রিভিউ দেওয়ার মতো কোনো ডেলিভারি হওয়া অর্ডার নেই।</p>
            <Link href="/shop" className="inline-block text-xs text-[#D49542] underline">
              নতুন কালেকশন দেখুন
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-ivory-light dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] p-6 sm:p-8 rounded-sm">
            {/* Delivered Product Selector if multiple */}
            {pendingList.length > 1 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                  Select Delivered Product
                </label>
                <select
                  value={selectedItem.productId}
                  onChange={(e) => {
                    const found = pendingList.find((p) => p.productId === e.target.value);
                    if (found) setSelectedItem(found);
                  }}
                  className="w-full p-2.5 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-xs"
                >
                  {pendingList.map((p) => (
                    <option key={`${p.orderId}_${p.productId}`} value={p.productId}>
                      {p.productName} ({p.orderNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selected Product Preview */}
            <div className="flex items-center gap-4 p-4 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm">
              <div className="w-16 h-16 bg-sand/30 rounded overflow-hidden relative shrink-0">
                {selectedItem.productImage ? (
                  <Image
                    src={selectedItem.productImage}
                    alt={selectedItem.productName}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D49542] font-bold">
                  Reviewing Piece
                </span>
                <h3 className="font-serif text-lg">{selectedItem.productName}</h3>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Your Rating (রেটিং দিন) *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? "fill-[#D49542] text-[#D49542]"
                          : "text-sand dark:text-[#383028]"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-mono text-[#80644B] dark:text-[#D49542]">
                  {rating} / 5
                </span>
              </div>
            </div>

            {/* Title (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                Review Headline (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. অসাধারণ কোয়ালিটি এবং ফিনিশিং!"
                className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-xs focus:outline-none focus:border-[#D49542]"
              />
            </div>

            {/* Review Message */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                Your Review Message (আপনার মতামত লিখুন) *
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="প্রোডাক্টটির মান, ডেলিভারি ও আপনার অভিজ্ঞতা সম্পর্কে লিখুন..."
                className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-xs focus:outline-none focus:border-[#D49542]"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#D49542]" />
                <span>Upload Product Photos (সর্বোচ্চ ৩টি ছবি - ঐচ্ছিক)</span>
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D49542]/50 rounded-sm p-6 text-center cursor-pointer hover:bg-[#FAF7F2] dark:hover:bg-[#1E1A16] transition-colors"
              >
                <UploadCloud className="w-7 h-7 text-[#D49542] mx-auto mb-2" />
                <p className="text-xs font-medium">
                  ছবি আপলোড করতে এখানে ক্লিক করুন (JPG, PNG, WEBP)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageFiles(e.target.files)}
                  className="hidden"
                />
              </div>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded overflow-hidden border border-[#E8DFC8]">
                      <img src={img} alt="Review upload" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-bold uppercase tracking-editorial rounded-sm flex items-center justify-center gap-2 hover:bg-[#80644B] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <span>Submit Review & Photos</span>
              )}
            </button>
          </form>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function AccountReviewsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-ivory dark:bg-[#0E0C0A]">
          <Loader2 className="w-6 h-6 animate-spin text-[#D49542]" />
        </main>
      }
    >
      <AccountReviewsContent />
    </Suspense>
  );
}
