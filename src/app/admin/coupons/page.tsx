"use client";

import React, { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { Ticket, Plus, Save, X, CheckCircle2 } from "lucide-react";

export default function AdminCouponsPage() {
  const { showToast } = useStore();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderValue, setMinOrderValue] = useState("2000");
  const [maxDiscount, setMaxDiscount] = useState("500");
  const [expiryDays, setExpiryDays] = useState("365");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
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

    setIsSubmitting(true);
    try {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + parseInt(expiryDays, 10));

      const payload = {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
        expiryDate: expDate.toISOString(),
        isActive: true,
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Coupon "${payload.code}" created!`, "success");
        setIsModalOpen(false);
        setCode("");
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand/50 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Promotional Coupons
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Server-side authoritative discount codes with minimum spend and expiry limits.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-5 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-charcoal-light shadow-sm"
        >
          <Plus className="w-4 h-4 text-mustard" />
          <span>New Coupon</span>
        </button>
      </div>

      <div className="bg-ivory border border-sand/80 rounded-sm shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-charcoal-muted font-serif">
            Loading coupon ledger...
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-xs text-charcoal-muted">
            No active promotional coupons found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-ivory-light border-b border-sand text-charcoal-muted uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Minimum Spend</th>
                  <th className="py-3.5 px-4">Cap</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {coupons.map((c) => (
                  <tr key={c.code || c._id} className="hover:bg-sand/10">
                    <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% off`
                        : `${formatPrice(c.discountValue)} flat`}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {c.minOrderValue > 0 ? formatPrice(c.minOrderValue) : "No minimum"}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {c.maxDiscount ? formatPrice(c.maxDiscount) : "Uncapped"}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative max-w-md mx-auto my-12 px-4">
            <div className="bg-ivory border border-sand shadow-elevated rounded-sm p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-sand mb-6">
                <h3 className="font-serif text-2xl text-charcoal font-normal">
                  Issue Promotional Code
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-charcoal hover:text-earth"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-medium text-charcoal mb-1">
                    Coupon Code (Uppercase) *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HERITAGE15"
                    required
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal font-mono uppercase focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Type
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (৳)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Value *
                    </label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      required
                      placeholder="10"
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Min Order (BDT)
                    </label>
                    <input
                      type="number"
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(e.target.value)}
                      placeholder="2000"
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Max Cap (BDT)
                    </label>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      placeholder="500"
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-sand flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 px-5 border border-sand rounded text-charcoal hover:bg-sand/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-6 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-charcoal-light shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-mustard" />
                    <span>{isSubmitting ? "Creating..." : "Save Coupon"}</span>
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
