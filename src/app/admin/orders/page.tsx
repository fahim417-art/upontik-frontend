"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  MapPin,
  Phone,
  Mail,
  X,
  Sparkles,
  Download,
  Bell,
  BellOff,
  CheckSquare,
  Square,
  Layers,
} from "lucide-react";
import { FloralHeaderOrnament } from "@/components/ui/FloralMotif";

export default function AdminOrdersPage() {
  const { showToast } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isChimeEnabled, setIsChimeEnabled] = useState(true);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Inspect Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const playOrderChime = () => {
    if (!isChimeEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.15);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.6);
    } catch { }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const url =
        statusFilter === "all"
          ? "/api/admin/orders"
          : `/api/admin/orders?status=${statusFilter}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch {
      showToast("Failed to fetch orders", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openInspectModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusNote("");
    setCourierName(order.courierName || "Steadfast Courier");
    setTrackingNumber(order.trackingNumber || "");
    setTrackingUrl(order.trackingUrl || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      const orderIdentifier = selectedOrder._id || selectedOrder.orderNumber;
      const res = await fetch(`/api/admin/orders/${orderIdentifier}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: newStatus,
          note: statusNote || undefined,
          courierName: courierName || undefined,
          trackingNumber: trackingNumber || undefined,
          trackingUrl: trackingUrl || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order #${selectedOrder.orderNumber} status updated to ${newStatus}`, "success");
        setSelectedOrder(data.data);
        fetchOrders();
      } else {
        showToast(data.error || "Failed to update status", "error");
      }
    } catch {
      showToast("Status update failed", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkStatusChange = async (targetStatus: string) => {
    if (selectedOrderIds.length === 0) return;
    setIsBulkUpdating(true);
    try {
      let updatedCount = 0;
      for (const id of selectedOrderIds) {
        const res = await fetch(`/api/admin/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: targetStatus }),
        });
        if (res.ok) updatedCount++;
      }
      showToast(`Updated ${updatedCount} orders to ${targetStatus}`, "success");
      setSelectedOrderIds([]);
      fetchOrders();
    } catch {
      showToast("Bulk status update failed", "error");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const exportOrdersToCsv = () => {
    if (filteredOrders.length === 0) {
      showToast("No orders available to export", "info");
      return;
    }
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "District",
      "Address",
      "Items Count",
      "Total Amount",
      "Status",
      "Courier Partner",
      "Tracking Consignment ID",
    ];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerInformation?.fullName || ""}"`,
      `"${o.customerInformation?.phone || ""}"`,
      `"${o.customerInformation?.email || ""}"`,
      `"${o.shippingAddress?.district || ""}"`,
      `"${(o.shippingAddress?.address || "").replace(/"/g, '""')}"`,
      o.items?.length || 1,
      o.total,
      o.orderStatus,
      `"${o.courierName || ""}"`,
      `"${o.trackingNumber || ""}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `upontik_orders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Orders ledger exported to CSV successfully", "success");
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o._id || o.orderNumber));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerInformation?.fullName?.toLowerCase().includes(q) ||
      o.customerInformation?.phone?.toLowerCase().includes(q) ||
      o.shippingAddress?.district?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with Chime & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC8]/60 dark:border-[#2C2620] gap-4">
        <div>
          <FloralHeaderOrnament className="text-[#D49542] mb-1" />
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
            Orders & Tracking Ledger
          </h1>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
            Track courier progress, inspect shipping addresses, and manage order lifecycles.
          </p>
        </div>

        {/* Action Buttons: Chime Alert & CSV Export */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setIsChimeEnabled(!isChimeEnabled);
              playOrderChime();
            }}
            className={`p-2 rounded-full border text-xs flex items-center gap-1.5 transition-colors ${isChimeEnabled
              ? "bg-[#FAF7F2] dark:bg-[#1E1A16] border-[#D49542] text-[#D49542]"
              : "border-sand dark:border-[#2C2620] text-charcoal-muted"
              }`}
            title={isChimeEnabled ? "Chime Audio Enabled (Click to Mute)" : "Chime Muted (Click to Enable)"}
          >
            {isChimeEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px] font-mono">Sound Alert</span>
          </button>

          <button
            onClick={exportOrdersToCsv}
            className="py-2 px-4 rounded-full bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-bold uppercase tracking-editorial flex items-center gap-2 hover:bg-[#B87932] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] p-1 rounded-full scrollbar-none">
          {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-editorial font-bold capitalize transition-colors whitespace-nowrap ${statusFilter === st
                  ? "bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] shadow-sm"
                  : "text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#FAF6F0]"
                  }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#80644B] dark:text-[#D49542] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, patron, phone..."
            className="w-full pl-10 pr-4 py-2 bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-full text-xs text-[#211D1A] dark:text-[#F5EFE8] placeholder:text-charcoal-muted/60 focus:outline-none focus:border-[#D49542]"
          />
        </div>
      </div>

      {/* Bulk Action Bar (Visible when orders selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="p-3 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#D49542]/50 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
          <span className="font-semibold text-[#D49542]">
            {selectedOrderIds.length} order(s) selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-charcoal-muted dark:text-[#A39789]">Change status to:</span>
            <button
              onClick={() => handleBulkStatusChange("confirmed")}
              disabled={isBulkUpdating}
              className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded font-bold hover:opacity-80"
            >
              Confirmed
            </button>
            <button
              onClick={() => handleBulkStatusChange("processing")}
              disabled={isBulkUpdating}
              className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded font-bold hover:opacity-80"
            >
              Packed
            </button>
            <button
              onClick={() => handleBulkStatusChange("shipped")}
              disabled={isBulkUpdating}
              className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded font-bold hover:opacity-80"
            >
              Shipped
            </button>
            <button
              onClick={() => handleBulkStatusChange("delivered")}
              disabled={isBulkUpdating}
              className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-bold hover:opacity-80"
            >
              Delivered
            </button>
            <button
              onClick={() => setSelectedOrderIds([])}
              className="text-xs text-charcoal-muted underline ml-2"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-[#80644B] dark:text-[#D49542] font-serif">
            Loading orders ledger...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#80644B] dark:text-[#A39789]">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF7F2] dark:bg-[#1E1A16] border-b border-[#E8DFC8] dark:border-[#2C2620] text-[#80644B] dark:text-[#D49542] uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="py-3 px-3 w-8">
                    <button onClick={toggleSelectAll} className="p-0.5">
                      {selectedOrderIds.length === filteredOrders.length ? (
                        <CheckSquare className="w-4 h-4 text-[#D49542]" />
                      ) : (
                        <Square className="w-4 h-4 text-charcoal-muted" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Patron</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620]">
                {filteredOrders.map((ord) => {
                  const ordId = ord._id || ord.orderNumber;
                  const isSelected = selectedOrderIds.includes(ordId);

                  return (
                    <tr
                      key={ordId}
                      className={`hover:bg-[#EAE0D0]/20 dark:hover:bg-[#1E1A16]/50 transition-colors ${isSelected ? "bg-[#FAF7F2] dark:bg-[#1E1A16]" : ""
                        }`}
                    >
                      <td className="py-3.5 px-3">
                        <button onClick={() => toggleSelectOrder(ordId)} className="p-0.5">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#D49542]" />
                          ) : (
                            <Square className="w-4 h-4 text-charcoal-muted" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-medium text-[#211D1A] dark:text-[#F5EFE8] flex items-center gap-1.5 flex-wrap">
                          <span>{ord.customerInformation?.fullName}</span>
                          {ord.userId && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-[#D49542]/15 text-[#B87932] dark:text-[#D49542] rounded">
                              #CUST-{String(ord.userId).slice(-5).toUpperCase()}
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-[#80644B] dark:text-[#A39789]">
                          {ord.customerInformation?.phone} • {ord.shippingAddress?.district}
                        </p>
                      </td>
                      <td className="py-3.5 px-3 text-[#80644B] dark:text-[#A39789]">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden shrink-0">
                            {ord.items?.slice(0, 3).map((it: any, i: number) => (
                              <img
                                key={i}
                                src={it.productImage || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=100"}
                                alt={it.productName || ""}
                                title={it.productName}
                                className="inline-block w-7 h-8 rounded-xs object-cover border border-[#E8DFC8] dark:border-[#2C2620] bg-sand/20 shadow-xs"
                              />
                            ))}
                          </div>
                          <span className="text-[11px] whitespace-nowrap">
                            {ord.items?.length || 1} piece(s)
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-serif font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ord.orderStatus === "delivered"
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
                      <td className="py-3.5 px-3 text-[11px] font-mono text-[#80644B] dark:text-[#A39789]">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => openInspectModal(ord)}
                          className="py-1 px-3 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] hover:border-[#D49542] text-[#211D1A] dark:text-[#F5EFE8] rounded-full text-xs font-medium transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect & Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm max-w-2xl w-full p-4 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-[#D49542] rounded-full" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D49542] font-semibold">
                ORDER INSPECTION
              </span>
            </div>

            <h3 className="font-serif text-2xl text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Order #{selectedOrder.orderNumber}
            </h3>
            <p className="text-xs text-[#80644B] dark:text-[#A39789] mb-6">
              Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF7F2] dark:bg-[#1E1A16] rounded-sm border border-[#E8DFC8]/60 dark:border-[#2C2620] mb-6 text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-[#80644B] dark:text-[#D49542] text-[10px] block mb-1">
                  Customer Information
                </span>
                <p className="font-medium text-[#211D1A] dark:text-[#F5EFE8]">{selectedOrder.customerInformation?.fullName}</p>
                <p className="text-[#80644B] dark:text-[#A39789]">{selectedOrder.customerInformation?.phone}</p>
                <p className="text-[#80644B] dark:text-[#A39789]">{selectedOrder.customerInformation?.email}</p>
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-[#80644B] dark:text-[#D49542] text-[10px] block mb-1">
                  Delivery Destination
                </span>
                <p className="font-medium text-[#211D1A] dark:text-[#F5EFE8]">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-[#80644B] dark:text-[#A39789]">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.district}</p>
                <p className="font-serif font-bold text-[#D49542] mt-1">Total: {formatPrice(selectedOrder.total)} ({selectedOrder.paymentMethod || "COD"})</p>
              </div>
            </div>

            {/* Ordered Products Ledger with Photos */}
            <div className="mb-6">
              <span className="font-bold uppercase tracking-wider text-[#80644B] dark:text-[#D49542] text-[10px] block mb-2">
                Ordered Pieces & Specifications ({selectedOrder.items?.length || 0})
              </span>
              <div className="border border-[#E8DFC8]/60 dark:border-[#2C2620] rounded-sm divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620] overflow-hidden bg-[#FAF7F2] dark:bg-[#1E1A16]">
                {selectedOrder.items?.map((item: any, idx: number) => {
                  const fallbackImg = "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=200";
                  const itemImg = item.productImage || fallbackImg;
                  return (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-14 rounded overflow-hidden bg-[#EAE0D0]/30 shrink-0 border border-[#E8DFC8]/60 dark:border-[#2C2620]">
                          <img
                            src={itemImg}
                            alt={item.productName || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif font-bold text-[#211D1A] dark:text-[#F5EFE8] truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-[#80644B] dark:text-[#A39789]">
                            {item.sku ? `SKU: ${item.sku}` : ""} {item.selectedVariant && `• ${item.selectedVariant}`}
                          </p>
                          <p className="text-[11px] text-[#80644B] dark:text-[#A39789]">
                            {formatPrice(item.price)} × {item.quantity} piece(s)
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                          {formatPrice(item.itemTotal || item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Financial Breakdown */}
              <div className="mt-3 p-3 bg-[#FAF7F2]/60 dark:bg-[#1E1A16]/60 rounded-sm border border-[#E8DFC8]/40 dark:border-[#2C2620] text-xs space-y-1">
                <div className="flex justify-between text-[#80644B] dark:text-[#A39789]">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal || selectedOrder.total)}</span>
                </div>
                {selectedOrder.couponCode && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Coupon Applied ({selectedOrder.couponCode})</span>
                    <span>- {formatPrice(selectedOrder.discount || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#80644B] dark:text-[#A39789]">
                  <span>Delivery Charge</span>
                  <span>{selectedOrder.deliveryCharge ? formatPrice(selectedOrder.deliveryCharge) : "FREE"}</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-[#211D1A] dark:text-[#FAF6F0] pt-1.5 border-t border-[#E8DFC8]/40 dark:border-[#2C2620] text-sm">
                  <span>Total Amount</span>
                  <span className="text-[#D49542]">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-[#E8DFC8]/60 dark:border-[#2C2620]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                    Update Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="confirmed">Studio Confirmed</option>
                    <option value="processing">Handcrafted & Packed</option>
                    <option value="shipped">Dispatched / In Transit</option>
                    <option value="delivered">Delivered to Patron</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. Steadfast, Pathao, RedX"
                    className="w-full px-3 py-2 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                    Tracking Number / Consignment ID
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. STF-8923140"
                    className="w-full px-3 py-2 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                    Tracking URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://steadfast.com.bd/t/..."
                    className="w-full px-3 py-2 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                  Status Note (Visible to Patron in Timeline)
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Handed over to courier hub at Gazipur"
                  className="w-full px-3 py-2 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="py-2.5 px-5 rounded-full border border-[#E8DFC8] dark:border-[#2C2620] text-xs text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="py-2.5 px-6 rounded-full bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-bold uppercase tracking-editorial hover:bg-[#B87932] dark:hover:bg-[#E8B878] transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
