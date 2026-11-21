"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Settings, Save, CheckCircle2, ShieldAlert, Truck, Sparkles, MapPin } from "lucide-react";

export default function AdminSettingsPage() {
  const { showToast } = useStore();
  const [storeName, setStoreName] = useState("উপন্তিক - Upontik Handicraft");
  const [tagline, setTagline] = useState("Tradition, Woven Into Modern Living.");
  const [supportEmail, setSupportEmail] = useState("care@upontik.com");
  const [supportPhone, setSupportPhone] = useState("+880 1917-720875");
  const [officeAddress, setOfficeAddress] = useState(
    "Konabari, Gazipur, Gazipur, Bangladesh, 1702"
  );
  const [deliveryDhaka, setDeliveryDhaka] = useState("80");
  const [deliveryOutside, setDeliveryOutside] = useState("120");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("5000");
  const [isDeliveryFreeStorewide, setIsDeliveryFreeStorewide] = useState(false);
  const [freeDeliveryDistricts, setFreeDeliveryDistricts] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/store-settings");
      const data = await res.json();
      if (data.success && data.data) {
        const s = data.data;
        if (s.storeName) setStoreName(s.storeName);
        if (s.tagline) setTagline(s.tagline);
        if (s.supportEmail) setSupportEmail(s.supportEmail);
        if (s.supportPhone) setSupportPhone(s.supportPhone);
        if (s.officeAddress) setOfficeAddress(s.officeAddress);
        if (s.defaultDeliveryChargeInsideDhaka !== undefined)
          setDeliveryDhaka(String(s.defaultDeliveryChargeInsideDhaka));
        if (s.defaultDeliveryChargeOutsideDhaka !== undefined)
          setDeliveryOutside(String(s.defaultDeliveryChargeOutsideDhaka));
        if (s.freeShippingThreshold !== undefined)
          setFreeShippingThreshold(String(s.freeShippingThreshold));
        if (s.isDeliveryFreeStorewide !== undefined)
          setIsDeliveryFreeStorewide(!!s.isDeliveryFreeStorewide);
        if (Array.isArray(s.freeDeliveryDistricts))
          setFreeDeliveryDistricts(s.freeDeliveryDistricts.join(", "));
      }
    } catch {}
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const districtsArr = freeDeliveryDistricts
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      const payload = {
        storeName,
        tagline,
        supportEmail,
        supportPhone,
        officeAddress,
        defaultDeliveryChargeInsideDhaka: parseFloat(deliveryDhaka) || 80,
        defaultDeliveryChargeOutsideDhaka: parseFloat(deliveryOutside) || 120,
        freeShippingThreshold: parseFloat(freeShippingThreshold) || 5000,
        isDeliveryFreeStorewide,
        freeDeliveryDistricts: districtsArr,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast("ডেলিভারি ও স্টোর সেটিংস সফলভাবে সংরক্ষিত হয়েছে!", "success");
      } else {
        showToast(data.error || "Failed to update settings", "error");
      }
    } catch {
      showToast("সেটিংস সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC8]/70 dark:border-[#2C2620] gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#FAF6F0] font-normal">
            Store & Delivery Configuration
          </h1>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
            Global delivery rates across Bangladesh, free shipping rules, and atelier contact info.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="py-2.5 px-6 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-[#80644B] transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5 text-[#D49542] dark:text-[#0E0C0A]" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Courier & Delivery Rules (Requirement 6) */}
      <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]/60 dark:border-[#2C2620]">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#D49542]" />
            <h2 className="font-serif text-xl text-[#211D1A] dark:text-[#FAF6F0] font-medium">
              Courier Delivery Rates & Free Shipping Overrides
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#D49542]/15 text-[#B87932] dark:text-[#D49542] px-2 py-0.5 rounded font-bold">
            Live Pricing
          </span>
        </div>

        {/* Global Free Shipping Campaign Toggle */}
        <div className="p-4 bg-[#FAF7F2] dark:bg-[#1E1A16] rounded-sm border border-[#E8DFC8]/60 dark:border-[#2C2620] flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#211D1A] dark:text-[#F5EFE8]">
              Turn OFF Delivery Charge Storewide (সারা দেশে ফ্রি ডেলিভারি)
            </p>
            <p className="text-[11px] text-[#80644B] dark:text-[#A39789] mt-0.5">
              চালু করলে চেকআউটে যেকোনো অর্ডারের ডেলিভারি চার্জ সম্পূর্ণ ফ্রি (৳০) হয়ে যাবে।
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isDeliveryFreeStorewide}
              onChange={(e) => setIsDeliveryFreeStorewide(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          <div>
            <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Inside Dhaka Delivery (৳) *
            </label>
            <input
              type="number"
              value={deliveryDhaka}
              onChange={(e) => setDeliveryDhaka(e.target.value)}
              required
              className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
            />
            <p className="text-[10px] text-[#80644B] dark:text-[#A39789] mt-0.5">ঢাকা সিটি কর্পোরেশন এলাকা (ডিফল্ট: ৮০)</p>
          </div>

          <div>
            <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Outside Dhaka Delivery (৳) *
            </label>
            <input
              type="number"
              value={deliveryOutside}
              onChange={(e) => setDeliveryOutside(e.target.value)}
              required
              className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
            />
            <p className="text-[10px] text-[#80644B] dark:text-[#A39789] mt-0.5">ঢাকার বাইরে দেশের সকল জেলা (ডিফল্ট: ১২০)</p>
          </div>

          <div>
            <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Free Delivery Order Threshold (৳)
            </label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
            />
            <p className="text-[10px] text-[#80644B] dark:text-[#A39789] mt-0.5">অর্ডার এই পরিমাণের বেশি হলে ফ্রি ডেলিভারি</p>
          </div>
        </div>

        {/* Location Specific Free Shipping */}
        <div className="pt-2">
          <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D49542]" />
            <span>Free Delivery Districts (নির্দিষ্ট এলাকার জন্য ফ্রি ডেলিভারি)</span>
          </label>
          <input
            type="text"
            value={freeDeliveryDistricts}
            onChange={(e) => setFreeDeliveryDistricts(e.target.value)}
            placeholder="e.g. Gazipur, Narayanganj (কমা দিয়ে একাধিক জেলা লিখুন)"
            className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none text-xs"
          />
          <p className="text-[10px] text-[#80644B] dark:text-[#A39789] mt-1">
            এখানে যে জেলাগুলোর নাম লিখবেন, কাস্টমার সেই জেলা নির্বাচন করলে তার অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি থাকবে।
          </p>
        </div>
      </div>

      {/* Brand & Contact */}
      <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm p-6 space-y-4 shadow-sm">
        <h2 className="font-serif text-xl text-[#211D1A] dark:text-[#FAF6F0] font-medium pb-3 border-b border-[#E8DFC8]/60 dark:border-[#2C2620]">
          Atelier Information & Support Channels
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Store / Atelier Brand Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Customer Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Studio Hotline / WhatsApp
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Physical Studio Address
            </label>
            <input
              type="text"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
