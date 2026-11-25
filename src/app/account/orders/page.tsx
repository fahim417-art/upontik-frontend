"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Truck,
  ArrowRight,
  User,
  Heart,
  XCircle,
  Copy,
  Check,
  MapPin,
  Calendar,
  Receipt,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import { FloralHeaderOrnament } from "@/components/ui/FloralMotif";

export default function AccountOrdersPage() {
  const router = useRouter();
  const { user, isLoadingUser, showToast } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "delivered" | "cancelled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/auth/login?redirect=/account/orders");
    } else if (user) {
      fetchOrders();
    }
  }, [user, isLoadingUser, router]);

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("upontik_token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/account/orders", {
        credentials: "include",
        headers: getAuthHeaders(),
      });
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

  const handleCopyOrderNumber = (e: React.MouseEvent, ordNum: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ordNum);
    setCopiedOrderNumber(ordNum);
    showToast(`Order #${ordNum} copied to clipboard`, "info");
    setTimeout(() => setCopiedOrderNumber(null), 2000);
  };

  const handleCancelOrder = async (
    e: React.MouseEvent,
    orderId: string,
    orderNumber: string
  ) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to cancel order #${orderNumber}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
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
          <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold uppercase rounded-full inline-flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>In Transit</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-[10px] font-bold uppercase rounded-full inline-flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      case "processing":
      case "confirmed":
        return (
          <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase rounded-full inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case "pending":
      default:
        return (
          <span className="px-2.5 py-0.5 bg-[#EAE0D0] dark:bg-[#1E1A16] text-[#211D1A] dark:text-[#F5EFE8] text-[10px] font-bold uppercase rounded-full inline-flex items-center gap-1 border border-[#D49542]/40">
            <Clock className="w-3 h-3 text-[#D49542]" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const activeCount = orders.filter((o) =>
    ["pending", "confirmed", "processing", "shipped"].includes(o.orderStatus)
  ).length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "delivered").length;
  const cancelledCount = orders.filter((o) => o.orderStatus === "cancelled").length;
  const totalSpent = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? ["pending", "confirmed", "processing", "shipped"].includes(o.orderStatus)
        : o.orderStatus === statusFilter;

    if (!matchesStatus) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.items?.some((it: any) => (it.productName || it.name || "").toLowerCase().includes(q))
    );
  });

  return (
    <main className="min-h-screen flex flex-col bg-ivory dark:bg-[#0E0C0A] text-[#211D1A] dark:text-[#F5EFE8] transition-colors duration-300">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <PendingReviewPopup />

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-[#E8DFC8]/70 dark:border-[#2C2620] mb-6 gap-4 sm:gap-6 text-xs uppercase tracking-editorial font-bold whitespace-nowrap">
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

        {/* Header + Compact Summary Stats */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <FloralHeaderOrnament className="text-[#D49542] mb-1" />
            <h1 className="font-serif text-2xl sm:text-3xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
              My Orders & Live Tracking
            </h1>
            <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-0.5">
              এক নজরে আপনার সকল অর্ডার দেখুন। যেকোনো অর্ডারে ক্লিক করলে লাইভ ট্র্যাকিং ও বিস্তারিত দেখা যাবে।
            </p>
          </div>

          {orders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="px-3.5 py-2 bg-[#FAF7F2] dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#80644B] dark:text-[#A39789] block">
                  Total Orders
                </span>
                <span className="font-serif text-lg font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                  {orders.length}
                </span>
              </div>
              <div className="px-3.5 py-2 bg-[#FAF7F2] dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#80644B] dark:text-[#A39789] block">
                  In Progress
                </span>
                <span className="font-serif text-lg font-bold text-[#D49542]">
                  {activeCount}
                </span>
              </div>
              <div className="px-3.5 py-2 bg-[#FAF7F2] dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#80644B] dark:text-[#A39789] block">
                  Delivered
                </span>
                <span className="font-serif text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {deliveredCount}
                </span>
              </div>
              <div className="px-3.5 py-2 bg-[#FAF7F2] dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#80644B] dark:text-[#A39789] block">
                  Total Spent
                </span>
                <span className="font-serif text-lg font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                  {formatPrice(totalSpent)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs + Search Bar */}
        {orders.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E8DFC8]/60 dark:border-[#2C2620]">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
              {[
                { key: "all", label: `All (${orders.length})` },
                { key: "active", label: `Active (${activeCount})` },
                { key: "delivered", label: `Delivered (${deliveredCount})` },
                { key: "cancelled", label: `Cancelled (${cancelledCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key as any)}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    statusFilter === tab.key
                      ? "bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A]"
                      : "bg-[#FAF7F2] dark:bg-[#171411] text-[#80644B] dark:text-[#A39789] border border-[#E8DFC8] dark:border-[#2C2620] hover:border-[#D49542]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#171411] px-3 py-1.5 rounded-sm border border-[#E8DFC8] dark:border-[#2C2620] sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#80644B] dark:text-[#A39789]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order # or bag name..."
                className="w-full bg-transparent text-xs focus:outline-none placeholder-[#80644B]/60 dark:placeholder-[#A39789]/60"
              />
            </div>
          </div>
        )}

        {/* Orders Listing */}
        {isLoading ? (
          <div className="py-20 text-center font-serif text-lg text-[#80644B] dark:text-[#D49542] animate-pulse">
            Loading your orders archive...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm p-8 max-w-lg mx-auto shadow-sm">
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
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#80644B] dark:text-[#A39789] bg-[#FAF7F2]/50 dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm">
            No matching orders found for the current filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const orderId = order._id || order.orderNumber;
              const isExpanded = expandedOrderId === orderId;
              const firstItem = order.items?.[0];
              const fallbackImg =
                "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=250";
              const thumbImg = firstItem?.productImage || firstItem?.image || fallbackImg;
              const itemCount = order.items?.length || 0;

              return (
                <div
                  key={orderId}
                  className={`bg-ivory dark:bg-[#171411] border rounded-sm overflow-hidden transition-all ${
                    isExpanded
                      ? "border-[#D49542] shadow-md"
                      : "border-[#E8DFC8] dark:border-[#2C2620] hover:border-[#D49542]/70 shadow-xs"
                  }`}
                >
                  {/* Compact Summary Row (Clickable to Expand) */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : orderId)}
                    className="p-3.5 sm:p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#FAF7F2]/70 dark:hover:bg-[#1E1A16]/60 transition-colors"
                  >
                    {/* Left: Thumbnail + Order # + Product Summary */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="relative w-12 h-14 bg-[#EAE0D0]/30 dark:bg-[#1E1A16] rounded-xs overflow-hidden border border-[#E8DFC8] dark:border-[#2C2620] shrink-0">
                        <img
                          src={thumbImg}
                          alt={firstItem?.productName || "Order item"}
                          className="w-full h-full object-cover"
                        />
                        {itemCount > 1 && (
                          <span className="absolute bottom-0 right-0 bg-[#211D1A]/85 text-[#FAF6F0] text-[9px] font-mono px-1 rounded-tl">
                            +{itemCount - 1}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif text-sm sm:text-base font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                            #{order.orderNumber}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyOrderNumber(e, order.orderNumber)}
                            title="Copy Order Number"
                            className="p-0.5 text-[#80644B] dark:text-[#A39789] hover:text-[#D49542]"
                          >
                            {copiedOrderNumber === order.orderNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {getStatusBadge(order.orderStatus)}
                        </div>

                        <p className="text-xs text-[#211D1A] dark:text-[#E5DDD5] truncate mt-0.5 font-medium">
                          {firstItem?.productName || "Handcrafted Piece"}
                          {itemCount > 1 ? ` (+${itemCount - 1} more)` : ""}
                        </p>

                        <div className="flex items-center gap-2.5 text-[11px] text-[#80644B] dark:text-[#A39789] mt-0.5 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#D49542]" />
                            {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span className="uppercase text-[10px]">
                            {order.paymentMethod === "cod" ? "COD" : order.paymentMethod?.toUpperCase() || "COD"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price + Quick Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#E8DFC8]/40 dark:border-[#2C2620] shrink-0">
                      <div className="md:text-right mr-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#80644B] dark:text-[#A39789] block">
                          Total
                        </span>
                        <span className="font-serif text-base sm:text-lg font-bold text-[#D49542]">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.orderStatus === "delivered" && firstItem?.productId && (
                          <Link
                            href={`/account/reviews?orderId=${encodeURIComponent(orderId)}&productId=${encodeURIComponent(String(firstItem.productId))}&productName=${encodeURIComponent(firstItem.productName || "")}&productSlug=${encodeURIComponent(firstItem.productSlug || "")}&productImage=${encodeURIComponent(thumbImg)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1.5 bg-[#D49542] text-[#0E0C0A] text-[10px] font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-1 hover:bg-[#E8B878] transition-colors"
                          >
                            <Star className="w-3 h-3 fill-[#0E0C0A]" />
                            <span>Review</span>
                          </Link>
                        )}

                        {order.orderStatus === "pending" && (
                          <button
                            type="button"
                            onClick={(e) => handleCancelOrder(e, orderId, order.orderNumber)}
                            className="px-2.5 py-1.5 border border-red-300 dark:border-red-900/70 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedOrderId(isExpanded ? null : orderId);
                          }}
                          className="px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] text-[#211D1A] dark:text-[#FAF6F0] text-[10px] font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-1 hover:border-[#D49542] transition-colors"
                        >
                          <span>{isExpanded ? "Hide" : "Track & Details"}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#D49542]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#D49542]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details Drawer */}
                  {isExpanded && (
                    <div className="border-t border-[#E8DFC8]/70 dark:border-[#2C2620] bg-[#FAF7F2]/30 dark:bg-[#12100E]">
                      {/* Live Tracking Milestone */}
                      <div className="p-4 sm:p-5 border-b border-[#E8DFC8]/60 dark:border-[#2C2620]">
                        <OrderTracker order={order} />
                      </div>

                      {/* Ordered Pieces Visual Roster */}
                      <div className="p-4 sm:p-5 space-y-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-editorial font-bold text-[#80644B] dark:text-[#D49542] block mb-2.5">
                            Ordered Artisan Pieces ({itemCount})
                          </span>
                          <div className="divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620] border border-[#E8DFC8]/60 dark:border-[#2C2620] rounded-sm bg-ivory dark:bg-[#171411]">
                            {order.items?.map((item: any, i: number) => {
                              const displayImage = item.productImage || item.image || fallbackImg;
                              const displayName = item.productName || item.name || "Handcrafted Bag";

                              return (
                                <div
                                  key={i}
                                  className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-12 h-14 relative bg-[#EAE0D0]/30 dark:bg-[#1E1A16] rounded-xs overflow-hidden border border-[#E8DFC8] dark:border-[#2C2620] shrink-0">
                                      <img
                                        src={displayImage}
                                        alt={displayName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      {item.productSlug ? (
                                        <Link
                                          href={`/product/${item.productSlug}`}
                                          className="font-serif text-sm font-medium text-[#211D1A] dark:text-[#F5EFE8] hover:text-[#D49542] transition-colors truncate block"
                                        >
                                          {displayName}
                                        </Link>
                                      ) : (
                                        <p className="font-serif text-sm font-medium text-[#211D1A] dark:text-[#F5EFE8] truncate">
                                          {displayName}
                                        </p>
                                      )}
                                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-[#80644B] dark:text-[#A39789]">
                                        {item.sku && (
                                          <span className="font-mono text-[10px] bg-[#EAE0D0]/50 dark:bg-[#1E1A16] px-1.5 py-0.2 rounded">
                                            {item.sku}
                                          </span>
                                        )}
                                        {item.selectedVariant && (
                                          <span className="text-[#D49542]">• {item.selectedVariant}</span>
                                        )}
                                        <span className="font-mono">
                                          {formatPrice(item.price)} × {item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                    {order.orderStatus === "delivered" && item.productId && (
                                      <Link
                                        href={`/account/reviews?orderId=${encodeURIComponent(orderId)}&productId=${encodeURIComponent(String(item.productId))}&productName=${encodeURIComponent(displayName)}&productSlug=${encodeURIComponent(item.productSlug || "")}&productImage=${encodeURIComponent(displayImage)}`}
                                        className="text-[11px] font-bold text-[#D49542] hover:underline flex items-center gap-1"
                                      >
                                        <Star className="w-3 h-3 fill-[#D49542]" />
                                        <span>Write Review</span>
                                      </Link>
                                    )}
                                    <span className="font-serif font-bold text-sm text-[#211D1A] dark:text-[#FAF6F0]">
                                      {formatPrice(item.itemTotal || item.price * item.quantity)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Address & Payment Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-ivory dark:bg-[#171411] rounded-xs border border-[#E8DFC8]/60 dark:border-[#2C2620]">
                            <span className="font-bold uppercase tracking-wider text-[#80644B] dark:text-[#D49542] text-[10px] flex items-center gap-1.5 mb-1">
                              <MapPin className="w-3.5 h-3.5" /> ডেলিভারি ঠিকানা
                            </span>
                            <p className="font-medium text-[#211D1A] dark:text-[#F5EFE8]">
                              {order.customerInformation?.fullName} • {order.customerInformation?.phone}
                            </p>
                            <p className="text-[#80644B] dark:text-[#A39789] mt-0.5">
                              {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                              {order.shippingAddress?.district}
                            </p>
                          </div>

                          <div className="p-3 bg-ivory dark:bg-[#171411] rounded-xs border border-[#E8DFC8]/60 dark:border-[#2C2620] space-y-1">
                            <span className="font-bold uppercase tracking-wider text-[#80644B] dark:text-[#D49542] text-[10px] flex items-center gap-1.5 mb-1">
                              <Receipt className="w-3.5 h-3.5" /> পেমেন্ট ও ডেলিভারি বিবরণ
                            </span>
                            <div className="flex justify-between text-[#80644B] dark:text-[#A39789]">
                              <span>Subtotal</span>
                              <span>{formatPrice(order.subtotal || order.total)}</span>
                            </div>
                            {order.couponCode && (
                              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                <span>Coupon ({order.couponCode})</span>
                                <span>- {formatPrice(order.discount || 0)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-[#80644B] dark:text-[#A39789]">
                              <span>Delivery Fee</span>
                              <span>
                                {order.deliveryCharge ? formatPrice(order.deliveryCharge) : "FREE"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8DFC8]/50 dark:border-[#2C2620]">
                          <Link
                            href={`/order-confirmation/${order.orderNumber}`}
                            className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#D49542] hover:text-[#B87932] transition-colors"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>অফিসিয়াল অর্ডার চালান দেখুন (Full Receipt)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          {order.orderStatus === "pending" && (
                            <button
                              type="button"
                              onClick={(e) => handleCancelOrder(e, orderId, order.orderNumber)}
                              className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
                            >
                              অর্ডার বাতিল করুন (Cancel Order)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
