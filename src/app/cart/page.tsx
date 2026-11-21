"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    showToast,
  } = useStore();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Free shipping rule: >= 3000 BDT
  const FREE_SHIPPING_THRESHOLD = 3000;
  const isFreeDelivery = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const estimatedDelivery = cart.length > 0 ? (isFreeDelivery ? 0 : 80) : 0;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, cartSubtotal - discount + estimatedDelivery);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal: cartSubtotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.data.code,
          discountAmount: data.data.discountAmount,
        });
        showToast(data.message || "Promotional coupon applied successfully", "success");
      } else {
        showToast(data.error || "Invalid coupon code", "error");
      }
    } catch {
      showToast("Failed to validate coupon", "error");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    showToast("Coupon removed.", "info");
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-charcoal-muted mb-6">
          <Link href="/" className="hover:text-charcoal transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sand" />
          <Link href="/shop" className="hover:text-charcoal transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sand" />
          <span className="text-charcoal font-medium">Shopping Bag</span>
        </nav>

        {/* Page Title & Item Count */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 mb-8 border-b border-sand gap-2">
          <div>
            <span className="text-xs uppercase tracking-wideDisplay text-earth font-bold block mb-1">
              Curated Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Your Shopping Bag
            </h1>
          </div>
          <p className="text-xs font-sans text-charcoal-muted">
            {cart.reduce((tot, item) => tot + item.quantity, 0)} artisanal piece
            {cart.reduce((tot, item) => tot + item.quantity, 0) === 1 ? "" : "s"} reserved
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center bg-ivory-light border border-sand/70 rounded-sm p-8 sm:p-12 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mx-auto mb-4 text-earth">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-2 font-normal">
              Your Bag is Currently Empty
            </h2>
            <p className="text-xs text-charcoal-muted mb-8 leading-relaxed max-w-md mx-auto">
              Our handcrafted pieces are loomed and assembled in small artisan editions.
              Explore our signature Dhol bags, crossbody pouches, and daily totes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="py-3 px-8 bg-charcoal text-ivory text-xs uppercase tracking-editorial rounded hover:bg-charcoal-light shadow-elevated transition-colors"
              >
                Explore Full Catalog
              </Link>
              <Link
                href="/category/dhol-bag"
                className="py-3 px-6 border border-sand bg-ivory text-charcoal text-xs uppercase tracking-editorial rounded hover:border-charcoal transition-colors"
              >
                Signature Dhol Bags
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Free Shipping Progress Meter */}
            <div className="p-4 bg-sand/20 border border-sand/60 rounded-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-sans text-charcoal gap-2 mb-2">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-mustard" />
                  {remainingForFree > 0 ? (
                    <span>
                      Add{" "}
                      <strong className="text-mustard font-serif text-sm">
                        {formatPrice(remainingForFree)}
                      </strong>{" "}
                      more to unlock <strong>Complimentary Courier Delivery</strong>
                    </span>
                  ) : (
                    <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-mustard" />
                      Congratulations! Your order qualifies for Complimentary Courier Delivery.
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-charcoal-muted">
                  Threshold: {formatPrice(FREE_SHIPPING_THRESHOLD)}
                </span>
              </div>
              <div className="w-full bg-sand/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-mustard h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Items Table (8 Cols) */}
              <div className="lg:col-span-8 bg-ivory-light border border-sand/70 rounded-sm p-6 shadow-sm">
                <div className="hidden sm:grid grid-cols-12 pb-4 border-b border-sand text-xs uppercase tracking-editorial text-charcoal-muted font-bold">
                  <span className="col-span-6">Handcrafted Piece</span>
                  <span className="col-span-2 text-center">Quantity</span>
                  <span className="col-span-2 text-right">Unit Price</span>
                  <span className="col-span-2 text-right">Subtotal</span>
                </div>

                <div className="divide-y divide-sand/40">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedVariant || "std"}`}
                      className="py-4 sm:py-5 flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center gap-3 sm:gap-4"
                    >
                      {/* Item Image and Title */}
                      <div className="col-span-6 flex items-center gap-3 sm:gap-4 w-full">
                        <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded bg-sand/20 overflow-hidden shrink-0 border border-sand/40">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-serif text-sm sm:text-base text-charcoal font-medium hover:text-mustard transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          {item.selectedVariant && (
                            <p className="text-xs text-charcoal-muted mt-0.5">
                              Variant: <span className="text-charcoal font-medium">{item.selectedVariant}</span>
                            </p>
                          )}
                          <p className="text-[10px] sm:text-[11px] text-earth uppercase tracking-wider mt-0.5">
                            SKU: {item.sku}
                          </p>
                          <button
                            onClick={() =>
                              removeFromCart(item.productId, item.selectedVariant)
                            }
                            className="text-xs text-charcoal-muted hover:text-red-500 transition-colors flex items-center gap-1 mt-1.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Responsive Quantity & Price Row on Mobile / Columns on Desktop */}
                      <div className="flex sm:contents items-center justify-between w-full pt-2 sm:pt-0 border-t sm:border-0 border-sand/30">
                        {/* Quantity Stepper */}
                        <div className="col-span-2 flex items-center justify-start sm:justify-center">
                          <div className="flex items-center border border-sand rounded bg-ivory">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.selectedVariant
                                )
                              }
                              aria-label="Decrease quantity"
                              className="p-1.5 sm:p-2 text-charcoal hover:text-earth transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 sm:w-8 text-center text-xs font-bold text-charcoal">
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
                              aria-label="Increase quantity"
                              className="p-1.5 sm:p-2 text-charcoal hover:text-earth transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Unit Price (hidden on mobile, visible on desktop) */}
                        <div className="col-span-2 text-right text-xs font-serif text-charcoal hidden sm:block">
                          {formatPrice(item.price)}
                        </div>

                        {/* Item Subtotal */}
                        <div className="col-span-2 text-right font-serif text-sm sm:text-base font-bold text-[#D49542]">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-sand flex items-center justify-between">
                  <Link
                    href="/shop"
                    className="text-xs uppercase tracking-editorial text-earth hover:text-mustard font-bold transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-xs text-charcoal-muted hover:text-red-500 transition-colors"
                  >
                    Clear Bag
                  </button>
                </div>
              </div>

              {/* Right Order Summary (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Order Summary Box */}
                <div className="bg-ivory-light border border-sand/70 rounded-sm p-6 space-y-4 shadow-sm">
                  <h3 className="font-serif text-xl text-charcoal font-medium pb-3 border-b border-sand">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-xs font-sans">
                    <div className="flex items-center justify-between text-charcoal">
                      <span>Subtotal ({cart.reduce((t, i) => t + i.quantity, 0)} items)</span>
                      <span className="font-serif text-sm font-bold">
                        {formatPrice(cartSubtotal)}
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-emerald-800 font-medium">
                        <span>Promotional Discount ({appliedCoupon.code})</span>
                        <span className="font-serif text-sm">
                          -{formatPrice(appliedCoupon.discountAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-charcoal">
                      <span>Estimated Courier Delivery</span>
                      <span>
                        {isFreeDelivery ? (
                          <span className="text-emerald-700 font-bold">FREE</span>
                        ) : (
                          formatPrice(estimatedDelivery)
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-sand flex items-center justify-between text-charcoal">
                    <span className="text-xs uppercase tracking-editorial font-bold">
                      Estimated Total
                    </span>
                    <span className="font-serif text-2xl font-bold">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-4 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center justify-center gap-2 hover:bg-charcoal-light shadow-elevated transition-colors"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-mustard" />
                  </Link>
                </div>

                {/* Promotional Coupon Entry */}
                <div className="bg-ivory-light border border-sand/70 rounded-sm p-6 shadow-sm">
                  <h4 className="text-xs uppercase tracking-editorial text-earth font-bold mb-3 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4" />
                    <span>Promotional Coupon</span>
                  </h4>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded text-xs">
                      <div>
                        <p className="font-bold text-emerald-900">
                          {appliedCoupon.code} applied
                        </p>
                        <p className="text-emerald-700">
                          Saved {formatPrice(appliedCoupon.discountAmount)}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="COUPON CODE"
                          className="flex-1 p-2.5 bg-ivory border border-sand rounded text-xs uppercase font-sans text-charcoal focus:outline-none focus:border-mustard"
                        />
                        <button
                          type="submit"
                          disabled={isValidatingCoupon || !couponCode.trim()}
                          className="px-4 py-2 bg-charcoal text-ivory text-xs uppercase tracking-editorial rounded font-bold hover:bg-charcoal-light transition-colors disabled:opacity-50"
                        >
                          {isValidatingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      <p className="text-[11px] text-charcoal-muted">
                        Enter any active promotional discount voucher code at checkout.
                      </p>
                    </form>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="p-4 bg-sand/20 border border-sand/40 rounded-sm text-xs font-sans text-charcoal-muted space-y-2">
                  <div className="flex items-center gap-2 text-charcoal font-medium">
                    <ShieldCheck className="w-4 h-4 text-mustard" />
                    <span>Handmade Quality Assurance</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Each UPONTIK bag undergoes artisan inspection before dispatch.
                    Cash on Delivery is supported nationwide across Bangladesh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
