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
} from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand/50 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Orders Ledger
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Track courier progress, inspect shipping addresses, and manage order lifecycles.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto bg-ivory border border-sand p-1 rounded">
          {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded text-xs uppercase tracking-editorial font-bold capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-charcoal text-ivory shadow-sm"
                    : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-ivory border border-sand/80 rounded-sm shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-sand flex items-center gap-3">
          <Search className="w-4 h-4 text-charcoal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, patron name, phone, or district..."
            className="w-full bg-transparent text-xs text-charcoal focus:outline-none placeholder-charcoal-muted/60"
          />
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-charcoal-muted font-serif">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-charcoal-muted">
            No orders found under this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-ivory-light border-b border-sand text-charcoal-muted uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id || ord.orderNumber} className="hover:bg-sand/10 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-charcoal">
                        {ord.customerInformation?.fullName}
                      </p>
                      <p className="text-[11px] text-charcoal-muted">
                        {ord.shippingAddress?.district} ({ord.customerInformation?.phone})
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal">
                      {ord.items?.length || 0} {ord.items?.length === 1 ? "bag" : "bags"}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-charcoal">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-semibold text-charcoal-muted text-[10px]">
                      {ord.paymentMethod === "cod" ? "COD" : ord.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.orderStatus === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.orderStatus === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : ord.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openInspectModal(ord)}
                        className="py-1 px-2.5 bg-sand/30 hover:bg-sand/60 text-charcoal rounded text-[11px] font-medium transition-colors"
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative max-w-2xl mx-auto my-8 px-4">
            <div className="bg-ivory border border-sand shadow-elevated rounded-sm p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-sand mb-6">
                <div>
                  <h3 className="font-serif text-2xl text-charcoal font-normal">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <span className="text-xs text-charcoal-muted">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-charcoal hover:text-earth"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-ivory-light border border-sand/60 rounded mb-6 text-xs font-sans">
                <div>
                  <h4 className="font-serif text-sm text-charcoal font-bold mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-earth" />
                    <span>Customer & Delivery</span>
                  </h4>
                  <p className="font-semibold text-charcoal">
                    {selectedOrder.customerInformation?.fullName}
                  </p>
                  <p className="text-charcoal-muted">
                    {selectedOrder.shippingAddress?.address}
                  </p>
                  <p className="text-charcoal-muted">
                    {selectedOrder.shippingAddress?.city},{" "}
                    {selectedOrder.shippingAddress?.district}
                  </p>
                  <p className="mt-1 text-charcoal">
                    Phone: {selectedOrder.customerInformation?.phone}
                  </p>
                  <p className="text-charcoal-muted">
                    Email: {selectedOrder.customerInformation?.email}
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-sm text-charcoal font-bold mb-1">
                    Financial Summary
                  </h4>
                  <p>Subtotal: {formatPrice(selectedOrder.subtotal)}</p>
                  {selectedOrder.discount > 0 && (
                    <p className="text-emerald-700">
                      Discount: -{formatPrice(selectedOrder.discount)}
                    </p>
                  )}
                  <p>Delivery Fee: {formatPrice(selectedOrder.deliveryCharge)}</p>
                  <p className="font-bold font-serif text-sm text-charcoal mt-1">
                    Total: {formatPrice(selectedOrder.total)}
                  </p>
                  <p className="mt-2 text-charcoal-muted">
                    Payment Method:{" "}
                    <strong className="uppercase">
                      {selectedOrder.paymentMethod}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Items in order */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-editorial text-earth font-bold mb-3">
                  Ordered Bags Snapshot
                </h4>
                <div className="divide-y divide-sand/40 max-h-48 overflow-y-auto border border-sand rounded p-3 bg-ivory-light">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="py-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-10 rounded bg-sand/20 overflow-hidden shrink-0">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{item.productName}</p>
                          <p className="text-[10px] text-charcoal-muted">
                            Qty: {item.quantity}{" "}
                            {item.selectedVariant && `• ${item.selectedVariant}`}
                          </p>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-charcoal">
                        {formatPrice(item.itemTotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advance Status Form */}
              <form
                onSubmit={handleUpdateStatus}
                className="p-5 bg-sand/20 border border-sand rounded-sm space-y-4 text-xs font-sans"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm text-charcoal font-bold">
                    Advance Order & Tracking Status
                  </h4>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-mustard/20 text-mustard rounded">
                    Current: {selectedOrder.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal mb-1 font-medium">
                      Status State
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-2 bg-ivory border border-sand rounded text-xs font-medium text-charcoal focus:outline-none"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="confirmed">Confirmed (Phone Verified)</option>
                      <option value="processing">Processing (Studio Handcrafting & Packing)</option>
                      <option value="shipped">Shipped (Dispatched to Courier)</option>
                      <option value="delivered">Delivered (Handed to Patron)</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-charcoal mb-1 font-medium">
                      Courier / Delivery Partner
                    </label>
                    <select
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full p-2 bg-ivory border border-sand rounded text-xs font-medium text-charcoal focus:outline-none"
                    >
                      <option value="Steadfast Courier">Steadfast Courier</option>
                      <option value="Pathao Courier">Pathao Courier</option>
                      <option value="RedX Logistics">RedX Logistics</option>
                      <option value="Paperfly">Paperfly</option>
                      <option value="Sundarban Courier">Sundarban Courier</option>
                      <option value="SA Paribahan">SA Paribahan</option>
                      <option value="Studio Direct Delivery">Studio Direct Delivery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-charcoal mb-1 font-medium">
                      Courier Tracking / Consignment Code
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. STE-982319 or 2402120091"
                      className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal mb-1 font-medium">
                      Courier Live Tracking Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      placeholder="https://steadfast.com.bd/t/..."
                      className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal mb-1 font-medium">
                    Internal Studio / Customer Tracking Note
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Package inspected & dispatched from Gazipur studio hub"
                    className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="py-2.5 px-6 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded hover:bg-charcoal-light shadow-sm transition-colors"
                  >
                    {isUpdating ? "Updating Studio Ledger..." : "Update Order Status"}
                  </button>
                </div>
              </form>

              {/* Status History Audit Trail */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="mt-6 pt-5 border-t border-sand">
                  <h4 className="text-xs uppercase tracking-editorial text-earth font-bold mb-3">
                    Order Status History & Audit Trail
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {selectedOrder.statusHistory.map((h: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-ivory-light border border-sand/40 rounded flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase text-charcoal px-1.5 py-0.5 bg-sand/30 rounded text-[10px]">
                            {h.status}
                          </span>
                          <span className="text-charcoal-muted">{h.note || "No note recorded"}</span>
                        </div>
                        <span className="text-charcoal-muted text-[10px] font-mono">
                          {new Date(h.updatedAt).toLocaleDateString()} {new Date(h.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
