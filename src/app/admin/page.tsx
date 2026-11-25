"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { FloralHeaderOrnament } from "@/components/ui/FloralMotif";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/dashboard", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Dashboard metrics error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="py-16 text-center text-[#80644B] dark:text-[#D49542] font-serif">
        Aggregating store telemetry and sales records...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title with Floral Ornament */}
      <div>
        <FloralHeaderOrnament className="text-[#D49542] mb-1" />
        <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
          Executive Overview
        </h1>
        <p className="text-xs text-[#80644B] dark:text-[#A39789] font-sans mt-1">
          Live statistics computed directly from store orders and artisan inventory records.
        </p>
      </div>

      {/* Metric Cards Row (Glass Frame UI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white/65 dark:bg-[#171411]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] flex items-start justify-between hover:border-[#D49542]/70 transition-all">
          <div>
            <span className="text-[11px] uppercase tracking-editorial text-[#80644B] dark:text-[#D49542] font-bold block mb-1">
              Total Revenue
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#211D1A] dark:text-[#FAF6F0]">
              {formatPrice(stats.totalRevenue)}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans block mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Excludes cancelled
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#EAE0D0]/60 dark:bg-[#1E1A16]/80 backdrop-blur-md flex items-center justify-center text-[#D49542] border border-[#D49542]/30">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white/65 dark:bg-[#171411]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] flex items-start justify-between hover:border-[#D49542]/70 transition-all">
          <div>
            <span className="text-[11px] uppercase tracking-editorial text-[#80644B] dark:text-[#D49542] font-bold block mb-1">
              Total Orders
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#211D1A] dark:text-[#FAF6F0]">
              {stats.totalOrders}
            </span>
            <span className="text-[11px] text-[#80644B] dark:text-[#A39789] font-sans block mt-1">
              Across all 64 districts
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#EAE0D0]/60 dark:bg-[#1E1A16]/80 backdrop-blur-md flex items-center justify-center text-[#B87932] dark:text-[#D49542] border border-[#D49542]/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white/65 dark:bg-[#171411]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] flex items-start justify-between hover:border-[#D49542]/70 transition-all">
          <div>
            <span className="text-[11px] uppercase tracking-editorial text-[#80644B] dark:text-[#D49542] font-bold block mb-1">
              Pending Orders
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.pendingOrders}
            </span>
            <span className="text-[11px] text-[#80644B] dark:text-[#A39789] font-sans block mt-1">
              Awaiting studio review
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50/80 dark:bg-amber-950/40 backdrop-blur-md flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white/65 dark:bg-[#171411]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] flex items-start justify-between hover:border-[#D49542]/70 transition-all">
          <div>
            <span className="text-[11px] uppercase tracking-editorial text-[#80644B] dark:text-[#D49542] font-bold block mb-1">
              Low Stock Warnings
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.lowStockCount}
            </span>
            <span className="text-[11px] text-[#80644B] dark:text-[#A39789] font-sans block mt-1">
              Pieces requiring weaving
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50/80 dark:bg-red-950/40 backdrop-blur-md flex items-center justify-center text-red-500 border border-red-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders (8 Cols) & Inventory Telemetry (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white/65 dark:bg-[#171411]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]/60 dark:border-[#2C2620] mb-4">
            <h2 className="font-serif text-xl text-[#211D1A] dark:text-[#F5EFE8] font-medium">
              Recent Studio Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-editorial font-bold text-[#B87932] dark:text-[#D49542] hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders?.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#80644B] dark:text-[#A39789]">
              No orders received yet. Test by placing a Cash on Delivery order from the storefront.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="border-b border-[#E8DFC8] dark:border-[#2C2620] text-[#80644B] dark:text-[#D49542] uppercase tracking-editorial text-[10px]">
                  <tr>
                    <th className="py-3 px-2">Order #</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620]">
                  {stats.recentOrders.map((ord: any) => (
                    <tr key={ord._id || ord.orderNumber} className="hover:bg-[#EAE0D0]/20 dark:hover:bg-[#1E1A16]/50">
                      <td className="py-3 px-2 font-mono font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-medium text-[#211D1A] dark:text-[#F5EFE8]">
                          {ord.customerInformation?.fullName}
                        </p>
                        <p className="text-[10px] text-[#80644B] dark:text-[#A39789]">
                          {ord.shippingAddress?.district}
                        </p>
                      </td>
                      <td className="py-3 px-2 font-serif font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.orderStatus === "delivered"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                              : ord.orderStatus === "pending"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                              : ord.orderStatus === "cancelled"
                              ? "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300"
                              : "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link
                          href={`/admin/orders`}
                          className="text-xs text-[#B87932] dark:text-[#D49542] hover:underline font-medium"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 bg-white/65 dark:bg-[#171411]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.05)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]/60 dark:border-[#2C2620]">
            <h2 className="font-serif text-lg text-[#211D1A] dark:text-[#F5EFE8] font-medium">
              Inventory Watchlist
            </h2>
            <Link
              href="/admin/inventory"
              className="text-xs uppercase tracking-editorial text-[#B87932] dark:text-[#D49542] font-bold hover:underline"
            >
              Adjust
            </Link>
          </div>

          {stats.lowStockProducts?.length === 0 ? (
            <p className="text-xs text-[#80644B] dark:text-[#A39789] py-4">
              All bag pieces are currently adequately stocked above threshold.
            </p>
          ) : (
            <div className="divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620]">
              {stats.lowStockProducts.map((p: any) => (
                <div
                  key={p.slug || p._id}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-[#211D1A] dark:text-[#F5EFE8] truncate">{p.name}</p>
                    <span className="text-[10px] text-[#80644B] dark:text-[#D49542] uppercase font-mono">
                      {p.sku}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[10px] font-bold rounded-full shrink-0">
                    {p.stock} remaining
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
