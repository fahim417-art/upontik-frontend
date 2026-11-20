"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Gift,
  Tag,
  Check,
  Loader2,
} from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    cartSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    showToast,
  } = useStore();

  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 3000;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const giftPackagingFee = isGift ? 50 : 0;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const estimatedTotal = Math.max(0, cartSubtotal - discount + giftPackagingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAppliedCoupon({
          code: data.data.code,
          discountAmount: data.data.discountAmount,
        });
        showToast(`Promo Applied: -৳${data.data.discountAmount.toLocaleString()}`, "success");
      } else {
        showToast(data.error || "Invalid coupon code", "error");
      }
    } catch {
      showToast("Coupon validation failed", "error");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-ivory dark:bg-[#120F0C] text-[#211D1A] dark:text-[#F5EFE8] shadow-2xl flex flex-col justify-between border-l border-sand/60 dark:border-[#2C2620] transition-colors">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-sand/60 dark:border-[#2C2620] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAE0D0] dark:bg-[#1E1A16] flex items-center justify-center text-[#D49542]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-normal leading-tight">
                Shopping Bag
              </h2>
              <span className="text-[11px] font-mono text-[#80644B] dark:text-[#D49542]">
                {cart.reduce((total, i) => total + i.quantity, 0)} artisan piece(s)
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-sand/30 dark:hover:bg-[#1E1A16] transition-colors text-charcoal-muted dark:text-[#A39789] hover:text-[#D49542]"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Dynamic Progress */}
        {cart.length > 0 && (
          <div className="px-5 sm:px-6 py-3 bg-[#FAF7F2] dark:bg-[#171411] border-b border-sand/40 dark:border-[#2C2620] text-xs font-sans">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[11px] text-[#80644B] dark:text-[#A39789]">
                আর মাত্র{" "}
                <span className="font-bold text-[#D49542]">
                  {formatPrice(remainingForFreeShipping)}
                </span>{" "}
                টাকার পণ্য যোগ করলেই ফ্রি কুরিয়ার ডেলিভারি!
              </p>
            ) : (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D49542]" />
                অভিনন্দন! আপনি ফ্রি ডেলিভারি আনলক করেছেন।
              </p>
            )}
            <div className="w-full bg-[#E8DFC8] dark:bg-[#2C2620] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#B87932] to-[#E8B878] h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#EAE0D0] dark:bg-[#1E1A16] flex items-center justify-center mb-4 text-[#D49542]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl mb-1">
                Your bag is empty
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-[#A39789] max-w-xs mb-6">
                Discover handcrafted textile and wooden pieces woven with heritage care and modern grace.
              </p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="py-2.5 px-6 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded-full hover:bg-[#B87932] transition-colors shadow-sm"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedVariant || "default"}`}
                  className="flex gap-3.5 pb-4 border-b border-sand/40 dark:border-[#2C2620]"
                >
                  {/* Product Thumbnail */}
                  <div className="relative w-20 h-24 rounded bg-sand/20 dark:bg-[#1E1A16] overflow-hidden shrink-0 border border-sand/40 dark:border-[#2A241F]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="font-serif text-sm hover:text-[#D49542] transition-colors line-clamp-1 font-medium"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() =>
                            removeFromCart(item.productId, item.selectedVariant)
                          }
                          className="text-charcoal-muted dark:text-[#A39789] hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] font-sans text-charcoal-muted dark:text-[#A39789] mt-0.5">
                          Variant: {item.selectedVariant}
                        </p>
                      )}

                      <p className="text-xs font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controller */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-sand dark:border-[#2C2620] rounded-full bg-ivory-light dark:bg-[#1E1A16]">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.selectedVariant
                            )
                          }
                          className="p-1 hover:text-[#D49542] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-medium font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.selectedVariant
                            )
                          }
                          className="p-1 hover:text-[#D49542] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-serif font-bold text-[#D49542]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Gift Packaging Checkbox & Message */}
              <div className="p-3 bg-[#FAF7F2] dark:bg-[#171411] rounded-sm border border-sand/60 dark:border-[#2C2620] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="accent-[#D49542] rounded-xs w-3.5 h-3.5"
                  />
                  <span className="flex items-center gap-1.5 font-medium">
                    <Gift className="w-3.5 h-3.5 text-[#D49542]" />
                    <span>উপহার প্যাকেজিং ও স্পেশাল চিরকুট যোগ করুন (+৳৫০)</span>
                  </span>
                </label>
                {isGift && (
                  <input
                    type="text"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="চিরকুটের বার্তা লিখুন (e.g. শুভ জন্মদিন!)"
                    className="w-full px-3 py-1.5 text-xs bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm focus:outline-none focus:border-[#D49542]"
                  />
                )}
              </div>

              {/* In-Drawer Promo Code Box */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-1">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#80644B] dark:text-[#D49542] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="PROMO CODE"
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-[#FAF7F2] dark:bg-[#171411] border border-sand/80 dark:border-[#2C2620] rounded-full focus:outline-none focus:border-[#D49542] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isValidatingCoupon || !couponCode}
                  className="px-4 py-2 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-bold rounded-full hover:bg-[#B87932] disabled:opacity-50 transition-colors"
                >
                  {isValidatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-mono px-1">
                  <span>Coupon &ldquo;{appliedCoupon.code}&rdquo; Applied:</span>
                  <span>-৳{appliedCoupon.discountAmount}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-5 sm:p-6 bg-[#FAF7F2] dark:bg-[#171411] border-t border-sand/60 dark:border-[#2C2620] space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-charcoal-muted dark:text-[#A39789]">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(cartSubtotal)}</span>
              </div>
              {isGift && (
                <div className="flex items-center justify-between text-charcoal-muted dark:text-[#A39789]">
                  <span>Gift Box & Handwritten Note</span>
                  <span className="font-mono">+৳50</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-৳{appliedCoupon.discountAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-bold pt-1 border-t border-sand/40 dark:border-[#2C2620]">
                <span>Estimated Total</span>
                <span className="font-serif text-lg font-bold text-[#D49542]">
                  {formatPrice(estimatedTotal)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-3.5 bg-[#B87932] hover:bg-[#A36827] text-white text-xs uppercase tracking-editorial font-bold rounded-full flex items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-2.5 border border-sand dark:border-[#2C2620] text-xs uppercase tracking-editorial text-center rounded-full hover:border-[#D49542] transition-colors"
              >
                View Full Bag Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
