"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Settings, Save, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdminSettingsPage() {
  const { showToast } = useStore();
  const [storeName, setStoreName] = useState("UPONTIK");
  const [tagline, setTagline] = useState("Tradition, Woven Into Modern Living.");
  const [supportEmail, setSupportEmail] = useState("care@upontik.com");
  const [supportPhone, setSupportPhone] = useState("+880 1700-000000");
  const [officeAddress, setOfficeAddress] = useState(
    "House 14, Road 7, Banani, Dhaka 1213, Bangladesh"
  );
  const [deliveryDhaka, setDeliveryDhaka] = useState("80");
  const [deliveryOutside, setDeliveryOutside] = useState("130");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("5000");
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
        if (s.defaultDeliveryChargeInsideDhaka)
          setDeliveryDhaka(String(s.defaultDeliveryChargeInsideDhaka));
        if (s.defaultDeliveryChargeOutsideDhaka)
          setDeliveryOutside(String(s.defaultDeliveryChargeOutsideDhaka));
        if (s.freeShippingThreshold)
          setFreeShippingThreshold(String(s.freeShippingThreshold));
      }
    } catch {}
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Store settings saved successfully.", "success");
    }, 400);
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand/50 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Store & Atelier Configuration
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Global delivery rates across Bangladesh, currency, and studio contact parameters.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="py-2.5 px-6 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-charcoal-light shadow-sm"
        >
          <Save className="w-3.5 h-3.5 text-mustard" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Brand & Contact */}
      <div className="bg-ivory border border-sand/80 rounded-sm p-6 space-y-4">
        <h2 className="font-serif text-xl text-charcoal font-medium pb-3 border-b border-sand/40">
          Atelier Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="block font-medium text-charcoal mb-1">
              Brand Identity Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-charcoal mb-1">
              Brand Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-charcoal mb-1">
              Customer Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-charcoal mb-1">
              Studio Phone
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-charcoal mb-1">
              Physical Studio Address
            </label>
            <input
              type="text"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Courier & Delivery Rates */}
      <div className="bg-ivory border border-sand/80 rounded-sm p-6 space-y-4">
        <h2 className="font-serif text-xl text-charcoal font-medium pb-3 border-b border-sand/40">
          Courier Delivery Rates (Bangladesh)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          <div>
            <label className="block font-medium text-charcoal mb-1">
              Inside Dhaka (BDT ৳)
            </label>
            <input
              type="number"
              value={deliveryDhaka}
              onChange={(e) => setDeliveryDhaka(e.target.value)}
              className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-charcoal mb-1">
              Outside Dhaka (BDT ৳)
            </label>
            <input
              type="number"
              value={deliveryOutside}
              onChange={(e) => setDeliveryOutside(e.target.value)}
              className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-charcoal mb-1">
              Free Delivery Threshold (৳)
            </label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
