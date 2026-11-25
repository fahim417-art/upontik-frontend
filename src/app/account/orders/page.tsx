"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrderTracker } from "@/components/orders/OrderTracker";
import { PendingReviewPopup } from "@/components/reviews/PendingReviewPopup";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  User,
  Heart,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Calendar,
  Receipt,
  Sparkles,
} from "lucide-react";
import { FloralHeaderOrnament } from "@/components/ui/FloralMotif";

export default function AccountOrdersPage() {
  const router = useRouter();
  const { user, isLoadingUser, showToast } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/auth/login?redirect=/account/orders");
    } else if (user) {
      fetchOrders();
    }
  }, [user, isLoadingUser, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("upontik_token") : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/account/orders", { credentials: "include", headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch {
      showToast("Failed to fetch order history", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOrderNumber = (ordNum: string) => {
    navigator.clipboard.writeText(ordNum);
    setCopiedOrderNumber(ordNum);
    showToast(`Order #${ordNum} copied to clipboard`, "info");
    setTimeout(() => setCopiedOrderNumber(null), 2000);
  };

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to cancel order #${orderNumber}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Order cancelled successfully", "info");
        fetchOrders();
      } else {
        showToast(data.error || "Failed to cancel order", "error");
      }
    } catch {
      showToast("Cancellation failed", "error");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered • ডেলিভার্ড</span>
          </span>
        );
      case "shipped":
        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5 shadow-xs">
            <Truck className="w-3.5 h-3.5" />
            <span>In Transit • কুরিয়ারে আছে</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5 shadow-xs">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled • বাতিল</span>
          </span>
        );
      case "processing":
      case "confirmed":
        return (
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5 shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>Confirmed • কারিগরি তৈরি হচ্ছে</span>
          </span>
        );
      case "pending":
      default:
        return (
          <span className="px-3 py-1 bg-[#EAE0D0] dark:bg-[#1E1A16] text-[#211D1A] dark:text-[#F5EFE8] text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5 border border-[#D49542]/30 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#D49542]" />
            <span>Pending Review • অপেক্ষমাণ</span>
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory dark:bg-[#0E0C0A] text-[#211D1A] dark:text-[#F5EFE8] transition-colors duration-300">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <PendingReviewPopup />
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-[#E8DFC8]/70 dark:border-[#2C2620] mb-8 gap-4 sm:gap-6 text-xs uppercase tracking-editorial font-bold whitespace-nowrap">
          <Link
            href="/account"
            className="pb-3 border-b-2 border-transparent text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#F5EFE8] flex items-center gap-2 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Profile & Addresses</span>
          </Link>
          <Link
            href="/account/orders"
            className="pb-3 border-b-2 border-[#211D1A] dark:border-[#D49542] text-[#211D1A] dark:text-[#D49542] flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </Link>
          <Link
            href="/account/wishlist"
            className="pb-3 border-b-2 border-transparent text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#F5EFE8] flex items-center gap-2 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <FloralHeaderOrnament className="text-[#D49542] mb-1" />
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
            Orders Archive & Live Tracking
          </h1>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
            Visual breakdown of all your handcrafted pieces, courier consignment details, and live atelier dispatch milestones.
          </p>
        </div>

        {/* Orders Listing */}
        {isLoading ? (
          <div className="py-24 text-center font-serif text-lg text-[#80644B] dark:text-[#D49542] animate-pulse">
            Loading your orders archive...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm p-8 max-w-lg mx-auto shadow-sm">
            <Package className="w-12 h-12 text-[#D49542] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              No orders placed yet
            </h3>
            <p className="text-xs text-[#80644B] dark:text-[#A39789] mb-6">
              Explore our five artisan collections and find the handcrafted piece that speaks to you.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded-full hover:bg-[#80644B] transition-colors shadow-sm"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const orderId = order._id || order.orderNumber;
              return (
                <div
                  key={orderId}
                  className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Top Bar */}
                  <div className="p-5 sm:p-6 bg-[#FAF7F2] dark:bg-[#1E1A16] border-b border-[#E8DFC8]/60 dark:border-[#2C2620] flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-xl sm:text-2xl font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                          #{order.orderNumber}
                        </span>
                        <button
                          onClick={() => handleCopyOrderNumber(order.orderNumber)}
                          title="Copy Order Number"
                          className="p-1 text-[#80644B] dark:text-[#A39789] hover:text-[#D49542] transition-colors"
                        >
                          {copiedOrderNumber === order.orderNumber ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#80644B] dark:text-[#A39789] flex-wrap font-sans">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-[#D49542]" />
                          {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span className="uppercase text-[10px] tracking-wider font-bold">
                          {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod?.toUpperCase() || "COD"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      {getStatusBadge(order.orderStatus)}
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-[#80644B] dark:text-[#A39789] block">
                          Total Amount
                        </span>
                        <span className="font-serif text-xl sm:text-2xl font-bold text-[#D49542]">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Live Tracking Progress Milestone */}
                  <div className="p-5 sm:p-6 border-b border-[#E8DFC8]/60 dark:border-[#2C2620]">
                    <OrderTracker order={order} />
                  </div>

                  {/* Ordered Pieces Visual Roster (Guaranteed Images & Details) */}
                  <div className="p-5 sm:p-6">
                    <span className="text-[11px] uppercase tracking-editorial font-bold text-[#80644B] dark:text-[#D49542] block mb-3">
                      Ordered Artisan Pieces ({order.items?.length || 0})
                    </span>

                    <div className="divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620] border border-[#E8DFC8]/60 dark:border-[#2C2620] rounded-sm bg-[#FAF7F2]/50 dark:bg-[#1E1A16]/50">
                      {order.items?.map((item: any, i: number) => {
                        const fallbackImg =
                          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=250";
                        const displayImage = item.productImage || item.image || fallbackImg;
                        const displayName = item.productName || item.name || "Handcrafted Bag";

                        return (
                          <div
                            key={i}
                            className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              {/* High-res Product Avatar */}
                              <div className="w-16 h-20 relative bg-[#EAE0D0]/30 dark:bg-[#1E1A16] rounded-xs overflow-hidden border border-[#E8DFC8] dark:border-[#2C2620] shrink-0 group">
                                <img
                                  src={displayImage}
                                  alt={displayName}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>

                              <div className="min-w-0">
                                {item.productSlug ? (
                                  <Link
                                    href={`/product/${item.productSlug}`}
                                    className="font-serif text-sm sm:text-base font-medium text-[#211D1A] dark:text-[#F5EFE8] hover:text-[#D49542] transition-colors truncate block"
                                  >
                                    {displayName}
                                  </Link>
                                ) : (
                                  <p className="font-serif text-sm sm:text-base font-medium text-[#211D1A] dark:text-[#F5EFE8] truncate">
                                    {displayName}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#80644B] dark:text-[#A39789]">
                                  {item.sku && (
                                    <span className="font-mono text-[11px] bg-[#EAE0D0]/50 dark:bg-[#1E1A16] px-1.5 py-0.5 rounded border border-[#E8DFC8]/60 dark:border-[#2C2620]">
                                      {item.sku}
                                    </span>
                                  )}
                                  {item.selectedVariant && (
                                    <span className="text-[11px] text-[#D49542] font-medium">
                                      • {item.selectedVariant}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1 font-mono">
                                  {formatPrice(item.price)} × {item.quantity} piece(s)
                                </p>
                              </div>
                            </div>

                            <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8DFC8]/40 dark:border-[#2C2620]">
                              <span className="text-[10px] uppercase text-[#80644B] dark:text-[#A39789] block sm:inline mr-2">
                                Item Total:
                              </span>
                              <span className="font-serif font-bold text-base text-[#211D1A] dark:text-[#FAF6F0]">
                                {formatPrice(item.itemTotal || item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivery & Address Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E8DFC8]/60 dark:border-[#2C2620] text-xs">
                      <div className="p-3 bg-[#FAF7F2] dark:bg-[#1E1A16] rounded-xs border border-[#E8DFC8]/60 dark:border-[#2C2620]">
                        <span className="font-bold uppercase tracking-wider text-[#80644B] dark:text-[#D49542] text-[10px] flex items-center gap-1.5 mb-1.5">
                          <MapPin className="w-3.5 h-3.5" /> ডেলিভারি ঠিকানা (Shipping Address)
                        </span>
                        <p className="font-medium text-[#211D1A] dark:text-[#F5EFE8]">
                          {order.customerInformation?.fullName} • {order.customerInformation?.phone}
                        </p>
                        <p className="text-[#80644B] dark:text-[#A39789] mt-0.5">
                          {order.shippingAddress?.address}
                        </p>
                        <p className="text-[#80644B] dark:text-[#A39789]">
                          {order.shippingAddress?.city}, {order.shippingAddress?.district}
                        </p>
                      </div>

                      <div className="p-3 bg-[#FAF7F2] dark:bg-[#1E1A16] rounded-xs border border-[#E8DFC8]/60 dark:border-[#2C2620] flex flex-col justify-between">
                        <span className="font-bold uppercase tracking-wider text-[#80644B] dark:text-[#D49542] text-[10px] flex items-center gap-1.5 mb-1.5">
                          <Receipt className="w-3.5 h-3.5" /> পেমেন্ট ও ডেলিভারি বিবরণ
                        </span>
                        <div className="space-y-1 text-[#80644B] dark:text-[#A39789]">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subtotal || order.total)}</span>
                          </div>
                          {order.couponCode && (
                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                              <span>Coupon ({order.couponCode})</span>
                              <span>- {formatPrice(order.discount || 0)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>{order.deliveryCharge ? formatPrice(order.deliveryCharge) : "COMPLIMENTARY FREE"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer with Quick Actions */}
                  <div className="p-4 sm:p-5 bg-[#FAF7F2] dark:bg-[#1E1A16] border-t border-[#E8DFC8]/60 dark:border-[#2C2620] flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/order-confirmation/${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#D49542] hover:text-[#B87932] transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>অফিসিয়াল অর্ডার চালান দেখুন (View Full Receipt)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {order.orderStatus === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(orderId, order.orderNumber)}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
                      >
                        অর্ডার বাতিল করুন (Cancel Order)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
