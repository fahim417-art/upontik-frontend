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
  Lock,
  MapPin,
  Sparkles,
} from "lucide-react";

const BD_DISTRICT_THANA_MAP: Record<string, string[]> = {
  Dhaka: [
    "Dhanmondi",
    "Gulshan",
    "Banani",
    "Uttara",
    "Mirpur",
    "Mohammadpur",
    "Motijheel",
    "Badda",
    "Khilkhet",
    "Old Dhaka",
    "Tejgaon",
    "Rampura",
    "Savar",
    "Keraniganj",
    "Dhamrai",
  ],
  Gazipur: [
    "Konabari (UPONTIK Atelier)",
    "Gazipur Sadar",
    "Tongi",
    "Kaliakair",
    "Sreepur",
    "Kapasia",
    "Kaliganj",
  ],
  Chattogram: [
    "Agrabad",
    "Panchlaish",
    "Nasirabad",
    "Halishahar",
    "Khulshi",
    "Kotwali",
    "Patenga",
    "Hathazari",
    "Sitakunda",
  ],
  Narayanganj: ["Narayanganj Sadar", "Fatullah", "Siddhirganj", "Bandar", "Rupganj", "Araihazar"],
  Sylhet: ["Sylhet Sadar", "Beanibazar", "Golapganj", "Zakiganj", "South Surma", "Sreemangal"],
  Cumilla: ["Cumilla Adarsha Sadar", "Laksam", "Daudkandi", "Chandina", "Debidwar", "Burichang"],
  Rajshahi: ["Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Paba", "Bagha", "Durgapur"],
  Khulna: ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali", "Rupsha"],
  Barishal: ["Kotwali", "Airport", "Babuganj", "Bakerganj", "Banaripara", "Gournadi"],
  Rangpur: ["Kotwali", "Mithapukur", "Pirganj", "Badarganj", "Gangachara", "Kaunia"],
  Mymensingh: ["Kotwali", "Muktagachha", "Trishal", "Bhaluka", "Gafargaon", "Phulpur"],
  Bogura: ["Bogura Sadar", "Sherpur", "Shibganj", "Gabtali", "Kahaloo", "Dhunat"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Ramu", "Chakaria", "Teknaf", "Ukhia", "Maheshkhali"],
};

const ALL_BD_DISTRICTS = [
  "Dhaka",
  "Gazipur",
  "Chattogram",
  "Narayanganj",
  "Sylhet",
  "Cumilla",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Bogura",
  "Cox's Bazar",
  "Jessore",
  "Dinajpur",
  "Tangail",
  "Kushtia",
  "Faridpur",
  "Pabna",
  "Noakhali",
  "Feni",
  "Brahmanbaria",
  "Jamalpur",
  "Sirajganj",
  "Narsingdi",
  "Manikganj",
  "Munshiganj",
  "Habiganj",
  "Moulvibazar",
  "Sunamganj",
  "Kishoreganj",
  "Netrokona",
  "Sherpur",
  "Natore",
  "Naogaon",
  "Chapainawabganj",
  "Joypurhat",
  "Gaibandha",
  "Kurigram",
  "Lalmonirhat",
  "Nilphamari",
  "Panchagarh",
  "Thakurgaon",
  "Bagerhat",
  "Chuadanga",
  "Jhenaidah",
  "Magura",
  "Meherpur",
  "Narail",
  "Satkhira",
  "Barguna",
  "Bhola",
  "Jhalokati",
  "Patuakhali",
  "Pirojpur",
  "Bandarban",
  "Chandpur",
  "Khagrachhari",
  "Lakshmipur",
  "Rangamati",
  "Gopalganj",
  "Madaripur",
  "Rajbari",
  "Shariatpur",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart, showToast, user } = useStore();

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [city, setCity] = useState("Dhanmondi");
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
  const [phoneError, setPhoneError] = useState("");

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
    district.toLowerCase().includes("dhaka") ||
    district.toLowerCase().includes("gazipur") ||
    city.toLowerCase().includes("dhaka");
  const deliveryCharge =
    cartSubtotal >= 3000 ? 0 : isInsideDhaka ? 80 : 130;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, cartSubtotal - discount + deliveryCharge);

  // Available thanas for the currently selected district
  const availableThanas = BD_DISTRICT_THANA_MAP[district] || [];

  const validatePhone = (val: string) => {
    const clean = val.replace(/[\s-]/g, "");
    if (!clean) {
      setPhoneError("");
      return false;
    }
    const isValid = /^(\+?880|0)?1[3-9]\d{8}$/.test(clean);
    if (!isValid) {
      setPhoneError("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (e.g. 01711223344)");
      return false;
    }
    setPhoneError("");
    return true;
  };

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
    if (isSubmitting) return; // Prevent double-submission
    setFormError("");

    if (cart.length === 0) {
      setFormError("Your shopping bag is empty.");
      return;
    }

    if (!fullName || !email || !phone || !address || !city) {
      setFormError("Please fill in all mandatory customer and delivery fields.");
      return;
    }

    const isPhoneValid = validatePhone(phone);
    if (!isPhoneValid) {
      setFormError("Please provide a valid 11-digit Bangladeshi mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerInformation: {
          fullName,
          email,
          phone: phone.replace(/[\s-]/g, ""),
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
        showToast("Order placed successfully! Thank you for supporting artisan hands.", "success");
        router.push(`/order-confirmation/${data.data.orderNumber}`);
      } else {
        setFormError(data.error || "Failed to process order. Please check item availability.");
        showToast(data.error || "Order failed", "error");
        setIsSubmitting(false);
      }
    } catch {
      setFormError("Network error. Please try placing your order again.");
      showToast("Order placement failed", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory dark:bg-[#0E0C0A] text-[#211D1A] dark:text-[#F5EFE8] transition-colors duration-300">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">

        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-sans text-charcoal-muted dark:text-[#A39789] uppercase tracking-wideDisplay mb-4 sm:mb-6">
          <Link href="/" className="hover:text-[#D49542] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sand dark:text-[#383028]" />
          <Link href="/cart" className="hover:text-[#D49542] transition-colors">
            Shopping Bag
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sand dark:text-[#383028]" />
          <span className="text-charcoal dark:text-[#F5EFE8] font-semibold">Studio Checkout</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 sm:mb-8 pb-4 border-b border-sand/60 dark:border-[#2C2620]">
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal">
              Studio Checkout
            </h1>
            <p className="text-[11px] sm:text-xs text-[#80644B] dark:text-[#D49542] mt-1 font-mono">
              Direct Gazipur Atelier Handcraft & Express Dispatch
            </p>
          </div>
          <span className="text-[11px] sm:text-xs font-mono text-[#80644B] dark:text-[#D49542] flex items-center gap-1.5 mt-2 sm:mt-0 bg-[#EAE0D0]/40 dark:bg-[#1E1A16] px-3 py-1 rounded-full border border-[#D49542]/20 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-[#D49542]" />
            256-Bit SSL Encrypted Ledger Checkout
          </span>
        </div>

        {formError && (
          <div className="mb-6 p-3.5 sm:p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-sm text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">

          {/* Left Form: Patron & Delivery Information (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">

            {/* Step 1: Patron Information */}
            <div className="bg-ivory dark:bg-[#171411] border border-sand/70 dark:border-[#2C2620] rounded-sm p-4 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60 dark:border-[#2C2620]">
                <span className="w-6 h-6 rounded-full bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal">
                  Patron Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samira Rahman"
                    required
                    className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#D49542]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. samira@example.com"
                    required
                    className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#D49542]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Phone Number (১১ ডিজিট) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      validatePhone(e.target.value);
                    }}
                    placeholder="e.g. 01711223344"
                    required
                    className={`w-full p-3 bg-ivory dark:bg-[#1E1A16] border rounded-sm text-xs sm:text-sm focus:outline-none font-mono ${
                      phoneError ? "border-red-500" : "border-sand/80 dark:border-[#2C2620] focus:border-[#D49542]"
                    }`}
                  />
                  {phoneError && (
                    <span className="text-[11px] text-red-600 dark:text-red-400 block mt-1">
                      {phoneError}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Studio Dispatch Address */}
            <div className="bg-ivory dark:bg-[#171411] border border-sand/70 dark:border-[#2C2620] rounded-sm p-4 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60 dark:border-[#2C2620]">
                <span className="w-6 h-6 rounded-full bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal">
                  Studio Dispatch Destination
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* 64 Districts Dropdown */}
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    District (জেলা) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      const newD = e.target.value;
                      setDistrict(newD);
                      const thanas = BD_DISTRICT_THANA_MAP[newD];
                      if (thanas && thanas.length > 0) {
                        setCity(thanas[0]);
                      }
                    }}
                    className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#D49542] font-medium"
                  >
                    {ALL_BD_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cascading Thana Dropdown or Input */}
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    City / Thana (থানা বা এলাকা) *
                  </label>
                  {availableThanas.length > 0 ? (
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#D49542] font-medium"
                    >
                      {availableThanas.map((th) => (
                        <option key={th} value={th}>
                          {th}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Sadar / Thana name"
                      required
                      className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#D49542]"
                    />
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">
                    Full Delivery Address (Street / House / Floor / Flat) *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House 12, Road 4, Sector 7..."
                    rows={2}
                    required
                    className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#D49542]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 1213"
                    className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#D49542]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Call upon arrival / Gift wrap note"
                    className="w-full p-3 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#D49542]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-ivory dark:bg-[#171411] border border-sand/70 dark:border-[#2C2620] rounded-sm p-4 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60 dark:border-[#2C2620]">
                <span className="w-6 h-6 rounded-full bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-mono font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3 pt-2">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-sm border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#D49542] bg-[#FAF7F2] dark:bg-[#1E1A16] shadow-sm"
                      : "border-sand/70 dark:border-[#2C2620] bg-ivory dark:bg-[#171411] hover:border-[#D49542]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 accent-[#D49542] w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#D49542]" />
                      <span className="text-xs font-bold uppercase tracking-wideDisplay">
                        Cash on Delivery (ক্যাশ অন ডেলিভারি)
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted dark:text-[#A39789] mt-1 leading-relaxed">
                      ডেলিভারি পার্সেল হাতে পেয়ে দেখে নেওয়ার পর কুরিয়ার রাইডারকে মূল্য পরিশোধ করুন।
                    </p>
                  </div>
                </label>

                {/* Mobile Banking / Online Gateway */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-sm border cursor-pointer transition-all ${
                    paymentMethod === "bkash" || paymentMethod === "nagad"
                      ? "border-[#D49542] bg-[#FAF7F2] dark:bg-[#1E1A16] shadow-sm"
                      : "border-sand/70 dark:border-[#2C2620] bg-ivory dark:bg-[#171411] hover:border-[#D49542]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bkash"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="mt-1 accent-[#D49542] w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#D49542]" />
                      <span className="text-xs font-bold uppercase tracking-wideDisplay">
                        bKash / Nagad / Online Payment
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted dark:text-[#A39789] mt-1 leading-relaxed">
                      অগ্রিম মোবাইল ব্যাংকিং পেমেন্ট। আপনার অর্ডারটি ইনস্ট্যান্ট স্টুডিওতে প্যাকেজিং শুরু হবে।
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary Panel: Sticky Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-ivory dark:bg-[#171411] border border-sand/80 dark:border-[#2C2620] rounded-sm p-4 sm:p-7 shadow-xl space-y-5">
              <h3 className="font-serif text-xl sm:text-2xl font-normal pb-3 border-b border-sand/60 dark:border-[#2C2620]">
                Order Summary ({cart.reduce((tot, i) => tot + i.quantity, 0)})
              </h3>

              {/* Items List Snapshot */}
              <div className="divide-y divide-sand/50 dark:divide-[#2C2620] max-h-64 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedVariant || "std"}`}
                    className="flex items-center justify-between pt-3 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded bg-sand/30 dark:bg-[#1E1A16] overflow-hidden shrink-0 border border-sand/50 dark:border-[#2C2620]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif text-xs sm:text-sm font-medium line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-charcoal-muted dark:text-[#A39789]">
                          Qty: {item.quantity}{" "}
                          {item.selectedVariant && `• ${item.selectedVariant}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-xs sm:text-sm font-semibold shrink-0 text-[#D49542]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promotional Coupon Input */}
              <div className="pt-4 border-t border-sand/60 dark:border-[#2C2620]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="COUPON (e.g. HERITAGE10)"
                    className="flex-1 p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs uppercase tracking-wider focus:outline-none focus:border-[#D49542] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="px-4 py-2.5 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-wideDisplay font-bold rounded-sm hover:bg-[#B87932] transition-colors disabled:opacity-50"
                  >
                    {isValidatingCoupon ? "Checking..." : "Apply"}
                  </button>
                </div>
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-sand/60 dark:border-[#2C2620] space-y-2 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted dark:text-[#A39789]">Subtotal</span>
                  <span className="font-serif text-sm font-semibold">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-charcoal-muted dark:text-[#A39789]">
                    Courier Delivery ({district})
                  </span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">COMPLIMENTARY FREE</span>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-sand/60 dark:border-[#2C2620] flex items-center justify-between">
                <span className="text-xs uppercase tracking-wideDisplay font-bold">
                  Total Payable
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#D49542]">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              {/* Submit Button with Anti-Duplicate Debounce */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-[#B87932] hover:bg-[#A36827] text-white text-xs uppercase tracking-wideDisplay font-bold rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>অর্ডার রেজিস্টার হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>অর্ডার নিশ্চিত করুন (Confirm Order)</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[10px] text-charcoal-muted dark:text-[#A39789] leading-relaxed space-y-1">
                <p>✦ Complimentary signature archival dust bag included with every piece.</p>
                <p>✦ কুরিয়ার ডেলিভারিম্যানের সামনে পার্সেল দেখে নেওয়ার শতভাগ সুযোগ রয়েছে।</p>
              </div>
            </div>
          </div>

        </form>
      </div>

      <Footer />
    </main>
  );
}
