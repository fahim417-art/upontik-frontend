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
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Loader2,
  Tag,
  Lock,
} from "lucide-react";

const BANGLADESH_DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Bogra",
  "Cox's Bazar",
  "Jessore",
  "Dinajpur",
  "Tangail",
  "Kushtia",
  "Faridpur",
  "Pabna",
  "Noakhali",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart, showToast, user } = useStore();

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad" | "sslcommerz">("cod");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses[0];
        if (defaultAddr.address) setAddress(defaultAddr.address);
        if (defaultAddr.city) setCity(defaultAddr.city);
        if (defaultAddr.district) setDistrict(defaultAddr.district);
        if (defaultAddr.postalCode) setPostalCode(defaultAddr.postalCode);
      }
    }
  }, [user]);

  // Delivery calculation based on district
  const isInsideDhaka =
    district.toLowerCase().includes("dhaka") || city.toLowerCase().includes("dhaka");
  const deliveryCharge =
    cartSubtotal >= 5000 ? 0 : isInsideDhaka ? 80 : 130;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, cartSubtotal - discount + deliveryCharge);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAppliedCoupon({
          code: data.data.code,
          discountAmount: data.data.discountAmount,
        });
        showToast(`Coupon applied: -৳${data.data.discountAmount.toLocaleString()}`, "success");
      } else {
        showToast(data.error || "Invalid coupon code", "error");
      }
    } catch {
      showToast("Failed to validate coupon", "error");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (cart.length === 0) {
      setFormError("Your shopping bag is empty.");
      return;
    }

    if (!fullName || !email || !phone || !address || !city) {
      setFormError("Please fill in all mandatory customer and delivery fields.");
      return;
    }

    if (phone.length < 10) {
      setFormError("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerInformation: {
          fullName,
          email,
          phone,
        },
        shippingAddress: {
          address,
          city,
          district,
          postalCode,
        },
        paymentMethod,
        couponCode: appliedCoupon?.code,
        orderNotes,
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedVariant: i.selectedVariant,
        })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        showToast("Order placed successfully!", "success");
        router.push(`/order-confirmation/${data.data.orderNumber}`);
      } else {
        setFormError(data.error || "Failed to process order. Please check item availability.");
        showToast(data.error || "Order failed", "error");
      }
    } catch {
      setFormError("Network error. Please try placing your order again.");
      showToast("Order placement failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-[11px] font-sans text-charcoal-muted uppercase tracking-wideDisplay mb-6">
          <Link href="/" className="hover:text-mustard transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sand" />
          <Link href="/cart" className="hover:text-mustard transition-colors">
            Shopping Bag
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sand" />
          <span className="text-charcoal font-semibold">Studio Checkout</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-sand/60">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal">
            Studio Checkout
          </h1>
          <span className="text-xs font-mono text-earth flex items-center gap-1.5 mt-2 sm:mt-0">
            <Lock className="w-3.5 h-3.5 text-mustard" />
            256-Bit SSL Encrypted Ledger Checkout
          </span>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xs text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Form: Patron & Delivery Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-7">

            {/* Step 1: Patron Information */}
            <div className="bg-ivory-light border border-sand/70 rounded-xs p-6 sm:p-7 shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60">
                <span className="w-6 h-6 rounded-full bg-charcoal text-ivory text-xs font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-normal">
                  Patron Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samira Rahman"
                    required
                    className="w-full p-3 bg-ivory border border-sand/80 rounded-xs text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal shadow-subtle"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. samira@example.com"
                    required
                    className="w-full p-3 bg-ivory border border-sand/80 rounded-xs text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal shadow-subtle"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01711223344"
                    required
                    className="w-full p-3 bg-ivory border border-sand/80 rounded-xs text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal shadow-subtle"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Studio Dispatch Address */}
            <div className="bg-ivory-light border border-sand/70 rounded-xs p-6 sm:p-7 shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60">
                <span className="w-6 h-6 rounded-full bg-charcoal text-ivory text-xs font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-normal">
                  Studio Dispatch Destination
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 bg-ivory border border-sand/80 rounded-xs text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal shadow-subtle font-medium"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    City / Area / Thana *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Banani, Gulshan, Dhanmondi"
                    required
                    className="w-full p-3 bg-ivory border border-sand/80 rounded-xs text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal shadow-subtle"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Full Delivery Address (Street / House / Floor / Flat) *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House 12, Road 4, Sector 7..."
                    rows={2}
                    required
                    className="w-full p-3 bg-ivory border border-sand/80 rounded-xs text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal shadow-subtle"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 1213"
                    className="w-full p-3 bg-ivory border border-sand/80 rounded-xs text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal shadow-subtle"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Call upon arrival"
                    className="w-full p-3 bg-ivory border border-sand/80 rounded-xs text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal shadow-subtle"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-ivory-light border border-sand/70 rounded-xs p-6 sm:p-7 shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60">
                <span className="w-6 h-6 rounded-full bg-charcoal text-ivory text-xs font-mono font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-normal">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3 pt-2">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-xs border cursor-pointer transition-all ${paymentMethod === "cod"
                    ? "border-charcoal bg-ivory shadow-subtle"
                    : "border-sand/70 bg-ivory-light hover:border-charcoal"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 accent-charcoal w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-mustard" />
                      <span className="text-xs font-bold text-charcoal uppercase tracking-wideDisplay">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      Inspect your handcrafted bag upon doorstep arrival and pay the delivery courier in cash.
                    </p>
                  </div>
                </label>

                {/* Mobile Banking / Online Gateway */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-xs border cursor-pointer transition-all ${paymentMethod === "bkash" || paymentMethod === "nagad"
                    ? "border-charcoal bg-ivory shadow-subtle"
                    : "border-sand/70 bg-ivory-light hover:border-charcoal"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bkash"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="mt-1 accent-charcoal w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-mustard" />
                      <span className="text-xs font-bold text-charcoal uppercase tracking-wideDisplay">
                        bKash / Nagad / SSLCommerz Online Payment
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      Instant mobile financial service payment. Your atelier order is prioritized for immediate packaging.
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary Panel: Sticky Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-ivory-light border border-sand/80 rounded-xs p-6 sm:p-7 shadow-luxury space-y-5">
              <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-normal pb-3 border-b border-sand/60">
                Order Summary ({cart.reduce((tot, i) => tot + i.quantity, 0)})
              </h3>

              {/* Items List Snapshot */}
              <div className="divide-y divide-sand/50 max-h-64 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedVariant || "std"}`}
                    className="flex items-center justify-between pt-3 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-xs bg-sand/30 overflow-hidden shrink-0 border border-sand/50">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif text-xs sm:text-sm text-charcoal font-medium line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-charcoal-muted">
                          Qty: {item.quantity}{" "}
                          {item.selectedVariant && `• ${item.selectedVariant}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-xs sm:text-sm font-semibold text-charcoal shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promotional Coupon Input */}
              <div className="pt-4 border-t border-sand/60">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code (e.g. HERITAGE10)"
                    className="flex-1 p-2.5 bg-ivory border border-sand/80 rounded-xs text-xs text-charcoal uppercase tracking-wider focus:outline-none focus:border-charcoal"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="px-4 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-wideDisplay font-semibold rounded-xs hover:bg-mustard transition-colors disabled:opacity-50"
                  >
                    {isValidatingCoupon ? "Checking..." : "Apply"}
                  </button>
                </div>
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-sand/60 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-charcoal">
                  <span>Subtotal</span>
                  <span className="font-serif text-sm font-semibold">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-charcoal">
                  <span>Courier Delivery ({district})</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-800 font-bold">COMPLIMENTARY</span>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-sand/60 flex items-center justify-between text-charcoal">
                <span className="text-xs uppercase tracking-wideDisplay font-bold">
                  Total Payable
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-mustard">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-charcoal text-ivory text-xs uppercase tracking-wideDisplay font-bold rounded-xs flex items-center justify-center gap-2 hover:bg-mustard hover:text-charcoal shadow-elevated transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-mustard" />
                    <span>Inscribing Order in Ledger...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-mustard" />
                    <span>Confirm & Inscribe Order</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[10px] text-charcoal-muted leading-relaxed">
                <p>✦ Complimentary signature archival dust bag included with every piece.</p>
              </div>
            </div>
          </div>

        </form>
      </div>

      <Footer />
    </main>
  );
}
