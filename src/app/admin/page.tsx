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
} from "lucide-react";

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
      <div className="py-12 text-center text-charcoal-muted font-serif">
        Aggregating store telemetry and sales records...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
          Executive Overview
        </h1>
        <p className="text-xs text-charcoal-muted font-sans mt-1">
          Live statistics computed directly from store orders and inventory records.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-ivory border border-sand/80 p-6 rounded-sm shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-editorial text-charcoal-muted font-bold block mb-1">
              Total Revenue
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
              {formatPrice(stats.totalRevenue)}
            </span>
            <span className="text-[11px] text-emerald-700 font-sans block mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Excludes cancelled
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-sand/30 flex items-center justify-center text-mustard">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-ivory border border-sand/80 p-6 rounded-sm shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-editorial text-charcoal-muted font-bold block mb-1">
              Total Orders
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
              {stats.totalOrders}
            </span>
            <span className="text-[11px] text-charcoal-muted font-sans block mt-1">
              Across all 64 districts
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-sand/30 flex items-center justify-center text-earth">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-ivory border border-sand/80 p-6 rounded-sm shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-editorial text-charcoal-muted font-bold block mb-1">
              Pending Orders
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700">
              {stats.pendingOrders}
            </span>
            <span className="text-[11px] text-charcoal-muted font-sans block mt-1">
              Awaiting studio review
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-ivory border border-sand/80 p-6 rounded-sm shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-editorial text-charcoal-muted font-bold block mb-1">
              Low Stock Warnings
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-red-600">
              {stats.lowStockCount}
            </span>
            <span className="text-[11px] text-charcoal-muted font-sans block mt-1">
              Pieces requiring weaving
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders (8 Cols) & Quick Catalog Telemetry (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-ivory border border-sand/80 rounded-sm p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-sand/40 mb-4">
            <h2 className="font-serif text-xl text-charcoal font-medium">
              Recent Studio Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-editorial font-bold text-mustard hover:text-earth flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders?.length === 0 ? (
            <div className="py-12 text-center text-xs text-charcoal-muted">
              No orders received yet. Test by placing a Cash on Delivery order from the
              storefront.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="border-b border-sand text-charcoal-muted uppercase tracking-editorial text-[10px]">
                  <tr>
                    <th className="py-3 px-2">Order #</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/40">
                  {stats.recentOrders.map((ord: any) => (
                    <tr key={ord._id || ord.orderNumber} className="hover:bg-sand/10">
                      <td className="py-3 px-2 font-mono font-bold text-charcoal">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-medium text-charcoal">
                          {ord.customerInformation?.fullName}
                        </p>
                        <p className="text-[10px] text-charcoal-muted">
                          {ord.shippingAddress?.district}
                        </p>
                      </td>
                      <td className="py-3 px-2 font-serif font-bold text-charcoal">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.orderStatus === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : ord.orderStatus === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : ord.orderStatus === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-sand/50 text-charcoal"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link
                          href={`/admin/orders`}
                          className="text-xs text-mustard hover:underline font-medium"
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
        <div className="lg:col-span-4 bg-ivory border border-sand/80 rounded-sm p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand/40">
            <h2 className="font-serif text-lg text-charcoal font-medium">
              Inventory Watchlist
            </h2>
            <Link
              href="/admin/inventory"
              className="text-xs uppercase tracking-editorial text-mustard font-bold"
            >
              Adjust
            </Link>
          </div>

          {stats.lowStockProducts?.length === 0 ? (
            <p className="text-xs text-charcoal-muted py-4">
              All bag pieces are currently adequately stocked above threshold.
            </p>
          ) : (
            <div className="divide-y divide-sand/40">
              {stats.lowStockProducts.map((p: any) => (
                <div
                  key={p.slug || p._id}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-charcoal truncate">{p.name}</p>
                    <span className="text-[10px] text-earth uppercase font-mono">
                      {p.sku}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded shrink-0">
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
