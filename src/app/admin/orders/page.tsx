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
} from "lucide-react";
import { FloralHeaderOrnament } from "@/components/ui/FloralMotif";

export default function AdminOrdersPage() {
  const { showToast } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC8]/60 dark:border-[#2C2620] gap-4">
        <div>
          <FloralHeaderOrnament className="text-[#D49542] mb-1" />
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
            Orders & Tracking Ledger
          </h1>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
            Track courier progress, inspect shipping addresses, and update customer tracking statuses.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] p-1 rounded-full">
          {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-editorial font-bold capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] shadow-sm"
                    : "text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#FAF6F0]"
                  }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#80644B] dark:text-[#D49542] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order #, patron name, phone, district..."
          className="w-full pl-10 pr-4 py-2.5 bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-full text-xs text-[#211D1A] dark:text-[#F5EFE8] placeholder:text-[#80644B]/60 dark:placeholder:text-[#A39789]/60 focus:outline-none focus:border-[#D49542] transition-colors"
        />
      </div>

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
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Patron</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620]">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id || ord.orderNumber} className="hover:bg-[#EAE0D0]/20 dark:hover:bg-[#1E1A16]/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#211D1A] dark:text-[#F5EFE8]">
                        {ord.customerInformation?.fullName}
                      </p>
                      <p className="text-[11px] text-[#80644B] dark:text-[#A39789]">
                        {ord.customerInformation?.phone} • {ord.shippingAddress?.district}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-[#80644B] dark:text-[#A39789]">
                      {ord.items?.length || 1} piece(s)
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                    <td className="py-3.5 px-4 text-[11px] font-mono text-[#80644B] dark:text-[#A39789]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openInspectModal(ord)}
                        className="py-1 px-3 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] hover:border-[#D49542] text-[#211D1A] dark:text-[#F5EFE8] rounded-full text-xs font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect & Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative">
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
