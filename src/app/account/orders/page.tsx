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
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase rounded-sm flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[11px] font-bold uppercase rounded-sm flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>In Transit</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[11px] font-bold uppercase rounded-sm flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case "processing":
      case "confirmed":
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold uppercase rounded-sm flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case "pending":
      default:
        return (
          <span className="px-2.5 py-1 bg-sand/40 text-charcoal text-[11px] font-bold uppercase rounded-sm flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Navigation Tabs */}
        <div className="flex border-b border-sand mb-8 gap-6 text-xs uppercase tracking-editorial font-bold">
          <Link
            href="/account"
            className="pb-3 border-b-2 border-transparent text-charcoal-muted hover:text-charcoal flex items-center gap-2 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Profile & Addresses</span>
          </Link>
          <Link
            href="/account/orders"
            className="pb-3 border-b-2 border-charcoal text-charcoal flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </Link>
          <Link
            href="/account/wishlist"
            className="pb-3 border-b-2 border-transparent text-charcoal-muted hover:text-charcoal flex items-center gap-2 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist</span>
          </Link>
        </div>

        <h1 className="font-serif text-3xl text-charcoal font-normal mb-6">
          Order Archives
        </h1>

        {isLoading ? (
          <div className="py-16 text-center text-charcoal-muted font-serif text-base">
            Retrieving your order ledger...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center bg-ivory-light border border-sand rounded-sm p-8 max-w-md mx-auto">
            <Package className="w-12 h-12 text-earth mx-auto mb-3" />
            <h3 className="font-serif text-xl text-charcoal mb-1">No Orders Yet</h3>
            <p className="text-xs text-charcoal-muted mb-6">
              When you order handcrafted bags, their status and courier tracking will
              appear here.
            </p>
            <Link
              href="/shop"
              className="py-2.5 px-6 bg-charcoal text-ivory text-xs uppercase tracking-editorial rounded hover:bg-charcoal-light transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id || order.orderNumber}
                className="bg-ivory-light border border-sand/60 rounded-sm p-6 space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand/40 gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-charcoal">
                      Order #{order.orderNumber}
                    </span>
                    <p className="text-[11px] text-charcoal-muted mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-serif text-lg font-bold text-charcoal">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-sand/30">
                  {order.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded bg-sand/20 overflow-hidden shrink-0">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm text-charcoal font-medium">
                            {item.productName}
                          </h4>
                          <p className="text-[11px] text-charcoal-muted">
                            Qty: {item.quantity}{" "}
                            {item.selectedVariant && `• ${item.selectedVariant}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-serif font-semibold text-charcoal">
                        {formatPrice(item.itemTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Live Order Tracker & Courier Details */}
                <div className="pt-2">
                  <OrderTracker order={order} />
                </div>

                {/* Footer and cancel action if pending */}
                <div className="pt-4 border-t border-sand/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="text-charcoal-muted">
                    Payment:{" "}
                    <span className="font-bold text-charcoal uppercase">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                    </span>{" "}
                    • Delivery:{" "}
                    <span className="font-medium text-charcoal">
                      {order.shippingAddress.city}, {order.shippingAddress.district}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.orderStatus === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order._id || order.orderNumber)}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                    <Link
                      href={`/order-confirmation/${order.orderNumber}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-mustard hover:text-earth uppercase tracking-editorial"
                    >
                      <span>View Receipt</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
