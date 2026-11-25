"use client";

import React, { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { Ticket, Plus, Save, X, Trash2, Calendar, Percent, Sparkles, Power } from "lucide-react";

export default function AdminCouponsPage() {
  const { showToast } = useStore();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderValue, setMinOrderValue] = useState("0");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [appliesTo, setAppliesTo] = useState<"all" | "selective">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("upontik_token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/coupons", {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data || []);
      }
    } catch {
      showToast("Failed to fetch coupons", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) {
      showToast("Please provide coupon code and discount value", "error");
      return;
    }

    if (new Date(expiryDate) <= new Date(startDate)) {
      showToast("Expiry date must be after the start date", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
        startDate: new Date(startDate).toISOString(),
        expiryDate: new Date(`${expiryDate}T23:59:59.999Z`).toISOString(),
        appliesTo,
        isActive: true,
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Coupon "${payload.code}" created successfully!`, "success");
        setIsModalOpen(false);
        setCode("");
        setDiscountValue("10");
        fetchCoupons();
      } else {
        showToast(data.error || "Failed to create coupon", "error");
      }
    } catch {
      showToast("Failed to create coupon", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCouponStatus = async (id: string, couponCode: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      const nextActive = !currentActive;
      const res = await fetch(`/api/admin/coupons/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({ isActive: nextActive }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) =>
          prev.map((c) => ((c._id || c.code) === id || c.code === couponCode ? { ...c, isActive: nextActive } : c))
        );
        showToast(
          `Coupon "${couponCode}" ${nextActive ? "activated" : "deactivated"} successfully.`,
          "success"
        );
      } else {
        showToast(data.error || "Failed to update coupon status", "error");
      }
    } catch {
      showToast("Failed to update coupon status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${couponCode}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      // Try deleting by _id first or by couponCode
      let res = await fetch(`/api/admin/coupons/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      let data = await res.json();

      if (!data.success && couponCode && couponCode !== id) {
        // Fallback: delete by coupon code directly
        res = await fetch(`/api/admin/coupons/${encodeURIComponent(couponCode)}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        });
        data = await res.json();
      }

      if (data.success) {
        showToast(`Coupon "${couponCode}" deleted immediately.`, "success");
        setCoupons((prev) => prev.filter((c) => (c._id || c.code) !== id && c.code !== couponCode));
      } else {
        showToast(data.error || "Failed to delete coupon", "error");
      }
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC8]/70 dark:border-[#2C2620] gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#FAF6F0] font-normal">
            Promotional Coupons & Percentage Offers
          </h1>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
            Create storewide or product-selective discount coupons with start/expiry date controls.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-5 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-[#80644B] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#D49542] dark:text-[#0E0C0A]" />
          <span>New Coupon</span>
        </button>
      </div>

      <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#80644B] dark:text-[#D49542] font-serif">
            Loading coupon ledger...
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#80644B] dark:text-[#A39789]">
            No active promotional coupons found. Click "New Coupon" to issue one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF7F2] dark:bg-[#1E1A16] border-b border-[#E8DFC8] dark:border-[#2C2620] text-[#80644B] dark:text-[#D49542] uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Scope</th>
                  <th className="py-3.5 px-4">Date Range (Start → Expiry)</th>
                  <th className="py-3.5 px-4">Min Spend</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620]">
                {coupons.map((c) => {
                  const id = c._id || c.code;
                  const isExpired = new Date(c.expiryDate) < new Date();
                  const isPending = c.startDate && new Date(c.startDate) > new Date();

                  return (
                    <tr key={id} className="hover:bg-[#EAE0D0]/20 dark:hover:bg-[#1E1A16]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                        <span className="px-2 py-1 bg-[#D49542]/15 text-[#B87932] dark:text-[#D49542] rounded border border-[#D49542]/30">
                          {c.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#211D1A] dark:text-[#F5EFE8]">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}% OFF`
                          : `${formatPrice(c.discountValue)} FLAT`}
                      </td>
                      <td className="py-3.5 px-4 text-[#80644B] dark:text-[#A39789]">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded">
                          {c.appliesTo === "selective" ? "Selective Pieces" : "Storewide (All)"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] font-mono text-[#80644B] dark:text-[#A39789]">
                        {c.startDate ? new Date(c.startDate).toLocaleDateString() : "Immediate"} →{" "}
                        <strong className="text-[#211D1A] dark:text-[#F5EFE8]">
                          {new Date(c.expiryDate).toLocaleDateString()}
                        </strong>
                      </td>
                      <td className="py-3.5 px-4 text-[#80644B] dark:text-[#A39789]">
                        {c.minOrderValue > 0 ? formatPrice(c.minOrderValue) : "No minimum"}
                      </td>
                      <td className="py-3.5 px-4">
                        {!c.isActive ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400">
                            Inactive
                          </span>
                        ) : isExpired ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300">
                            Expired
                          </span>
                        ) : isPending ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            Scheduled
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleCouponStatus(id, c.code, c.isActive !== false)}
                            disabled={togglingId === id}
                            title={c.isActive !== false ? "Deactivate Coupon" : "Activate Coupon"}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border transition-colors ${
                              c.isActive !== false
                                ? "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/40"
                                : "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                            }`}
                          >
                            <Power className="w-3 h-3" />
                            <span>{c.isActive !== false ? "Deactivate" : "Activate"}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(id, c.code)}
                            disabled={deletingId === id}
                            title="Delete Coupon"
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative max-w-lg mx-auto my-12 px-4">
            <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] shadow-2xl rounded-sm p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8] dark:border-[#2C2620] mb-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#211D1A] dark:text-[#FAF6F0] font-normal">
                    Issue Promotional Coupon
                  </h3>
                  <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-0.5">
                    Define discount percentage, schedule dates, and target products.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#80644B] hover:text-[#211D1A] dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                    Coupon Code (e.g. FESTIVE20) *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SPECIAL15"
                    required
                    className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] font-mono uppercase focus:border-[#D49542] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Discount Type
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    >
                      <option value="percentage">Percentage (%) Off</option>
                      <option value="fixed">Fixed Amount (৳) Off</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      {discountType === "percentage" ? "Discount Percentage (%) *" : "Discount Amount (৳) *"}
                    </label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      required
                      min="1"
                      placeholder="15"
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Date Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Start Date (চালু হওয়ার তারিখ) *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Expiry Date (মেয়াদ শেষের তারিখ) *
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Target Scope */}
                <div>
                  <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                    Applies To (কুপনের আওতা)
                  </label>
                  <select
                    value={appliesTo}
                    onChange={(e) => setAppliesTo(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                  >
                    <option value="all">All Products (সমস্ত পণ্যের উপর প্রযোজ্য)</option>
                    <option value="selective">Selective Products (নির্দিষ্ট পণ্যের উপর প্রযোজ্য)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Min Order Value (৳)
                    </label>
                    <input
                      type="number"
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(e.target.value)}
                      placeholder="0"
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Max Discount Cap (৳)
                    </label>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      placeholder="Optional"
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E8DFC8] dark:border-[#2C2620] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 px-5 border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#80644B] dark:text-[#A39789] hover:bg-[#EAE0D0]/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-6 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-[#80644B] transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-[#D49542] dark:text-[#0E0C0A]" />
                    <span>{isSubmitting ? "Creating..." : "Issue Coupon"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
