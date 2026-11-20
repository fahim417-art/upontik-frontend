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
} from "lucide-react";
import { FloralHeaderOrnament } from "@/components/ui/FloralMotif";

export default function AccountOrdersPage() {
  const router = useRouter();
  const { user, isLoadingUser, showToast } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/auth/login");
    } else if (user) {
      fetchOrders();
    }
  }, [user, isLoadingUser, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/account/orders", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch {
      showToast("Failed to fetch order history", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this pending order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
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
          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[11px] font-bold uppercase rounded-full flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>In Transit</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-[11px] font-bold uppercase rounded-full flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case "processing":
      case "confirmed":
        return (
          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold uppercase rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case "pending":
      default:
        return (
          <span className="px-2.5 py-1 bg-[#EAE0D0] dark:bg-[#1E1A16] text-[#211D1A] dark:text-[#F5EFE8] text-[11px] font-bold uppercase rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory dark:bg-[#0E0C0A] text-[#211D1A] dark:text-[#F5EFE8] transition-colors duration-300">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8DFC8]/70 dark:border-[#2C2620] mb-8 gap-6 text-xs uppercase tracking-editorial font-bold">
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
            Real-time status updates and delivery tracking for all your handcrafted UPONTIK pieces.
          </p>
        </div>

        {/* Orders Listing */}
        {isLoading ? (
          <div className="py-20 text-center font-serif text-lg text-[#80644B] dark:text-[#D49542]">
            Loading your orders archive...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm p-8 max-w-lg mx-auto shadow-sm">
            <Package className="w-12 h-12 text-[#D49542] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              No orders placed yet
            </h3>
            <p className="text-xs text-[#80644B] dark:text-[#A39789] mb-6">
              Explore our five artisan collections and find the handcrafted piece that feels like you.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded-full hover:bg-[#B87932] transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id || order.orderNumber}
                className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm overflow-hidden shadow-sm"
              >
                {/* Order Top Bar */}
                <div className="p-5 sm:p-6 bg-[#FAF7F2] dark:bg-[#1E1A16] border-b border-[#E8DFC8]/60 dark:border-[#2C2620] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block">
                      ORDER PLACED: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-serif text-xl font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                      #{order.orderNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-serif text-lg font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Live Tracking Component */}
                <div className="p-5 sm:p-6 border-b border-[#E8DFC8]/60 dark:border-[#2C2620]">
                  <OrderTracker order={order} />
                </div>

                {/* Ordered Items List */}
                <div className="p-5 sm:p-6 divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620]">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 relative bg-[#EAE0D0]/20 dark:bg-[#1E1A16] rounded-sm overflow-hidden border border-[#E8DFC8]/60 dark:border-[#2C2620] shrink-0">
                          <Image
                            src={item.image || "/images/placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif text-sm font-medium text-[#211D1A] dark:text-[#F5EFE8]">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-[#80644B] dark:text-[#A39789] font-mono">
                            Qty: {item.quantity} • {formatPrice(item.price)} each
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-sm text-[#211D1A] dark:text-[#FAF6F0]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer with Cancellation (if pending) */}
                {order.orderStatus === "pending" && (
                  <div className="p-4 bg-[#FAF7F2] dark:bg-[#1E1A16] border-t border-[#E8DFC8]/60 dark:border-[#2C2620] flex justify-end">
                    <button
                      onClick={() => handleCancelOrder(order._id || order.orderNumber)}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
                    >
                      Cancel Pending Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
