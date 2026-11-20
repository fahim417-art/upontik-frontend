"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrderTracker } from "@/components/orders/OrderTracker";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Save,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { FloralCorner, FloralHeaderOrnament } from "@/components/ui/FloralMotif";

export default function AccountOverviewPage() {
  const router = useRouter();
  const { user, isLoadingUser, logout, showToast, refreshUser } = useStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [isSaving, setIsSaving] = useState(false);
  const [recentOrder, setRecentOrder] = useState<any | null>(null);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/auth/login");
    } else if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      if (user.addresses && user.addresses.length > 0) {
        setAddress(user.addresses[0]?.address || "");
        setCity(user.addresses[0]?.city || "");
        setDistrict(user.addresses[0]?.district || "Dhaka");
      }
      fetchLatestOrder();
    }
  }, [user, isLoadingUser, router]);

  const fetchLatestOrder = async () => {
    try {
      const res = await fetch("/api/account/orders", { credentials: "include" });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setRecentOrder(data.data[0]);
      }
    } catch { }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone,
          addresses: [
            {
              address,
              city,
              district,
              isDefault: true,
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Profile and delivery addresses saved.", "success");
        await refreshUser();
      } else {
        showToast(data.error || "Failed to update profile", "error");
      }
    } catch {
      showToast("Network error updating profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingUser || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ivory dark:bg-[#0E0C0A] text-[#211D1A] dark:text-[#F5EFE8]">
        <p className="font-serif text-lg">Loading your profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-ivory dark:bg-[#0E0C0A] text-[#211D1A] dark:text-[#F5EFE8] transition-colors duration-300">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Account Header with Floral Touch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#E8DFC8]/70 dark:border-[#2C2620] gap-4">
          <div>
            <FloralHeaderOrnament className="text-[#D49542] mb-1" />
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold">
                Patron Dashboard
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EAE0D0] dark:bg-[#1E1A16] text-[#D49542] text-[10px] font-mono font-bold border border-[#D49542]/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> VIP Patron
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
              Greetings, {user.name}
            </h1>
            <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="py-2.5 px-5 bg-[#D49542] text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded-full flex items-center gap-1.5 shadow-md hover:bg-[#E8B878] transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="py-2.5 px-4 border border-[#E8DFC8] dark:border-[#2C2620] bg-ivory-light dark:bg-[#171411] text-[#211D1A] dark:text-[#F5EFE8] text-xs uppercase tracking-editorial rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (scrollable on mobile) */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-[#E8DFC8]/70 dark:border-[#2C2620] mb-8 gap-4 sm:gap-6 text-xs uppercase tracking-editorial font-bold whitespace-nowrap">
          <Link
            href="/account"
            className="pb-3 border-b-2 border-[#211D1A] dark:border-[#D49542] text-[#211D1A] dark:text-[#D49542] flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Profile & Addresses</span>
          </Link>
          <Link
            href="/account/orders"
            className="pb-3 border-b-2 border-transparent text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#F5EFE8] flex items-center gap-2 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </Link>
          <Link
            href="/account/wishlist"
            className="pb-3 border-b-2 border-transparent text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#F5EFE8] flex items-center gap-2 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist</span>
          </Link>
        </div>

        {/* Latest Active Order Live Tracker */}
        {recentOrder && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold">
                Most Recent Order Status
              </span>
              <Link
                href="/account/orders"
                className="text-xs text-[#B87932] dark:text-[#D49542] hover:underline flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <OrderTracker order={recentOrder} />
          </div>
        )}

        {/* Profile Settings Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm p-6 sm:p-8 shadow-sm relative">
            <FloralCorner position="top-right" className="text-[#D49542]/40 w-10 h-10 top-2 right-2" />
            
            <h2 className="font-serif text-xl sm:text-2xl text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Personal Information & Shipping Address
            </h2>
            <p className="text-xs text-[#80644B] dark:text-[#A39789] mb-6">
              Saved details will automatically prefill your checkout for seamless artisan shopping.
            </p>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, road, landmark..."
                  className="w-full px-4 py-2.5 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                    City / Thana
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Uttara / Dhanmondi"
                    className="w-full px-4 py-2.5 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#80644B] dark:text-[#D49542] uppercase tracking-wider block mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 bg-ivory dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm text-xs text-[#211D1A] dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-3 px-8 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded-full hover:bg-[#B87932] dark:hover:bg-[#E8B878] transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Profile Details"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Patron Privilege Card */}
          <div className="lg:col-span-4 bg-[#FAF7F2] dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D49542]" />
              <span className="font-serif text-lg text-[#211D1A] dark:text-[#F5EFE8]">
                Patron Studio Privileges
              </span>
            </div>
            <p className="text-xs text-[#80644B] dark:text-[#A39789] leading-relaxed">
              As an authenticated UPONTIK patron, your orders receive priority hand-finishing at our Gazipur atelier and direct courier dispatch with live tracking.
            </p>
            <div className="pt-2 border-t border-[#E8DFC8]/60 dark:border-[#2C2620] space-y-2 text-xs text-[#80644B] dark:text-[#A39789]">
              <div className="flex items-center justify-between">
                <span>Account Role:</span>
                <span className="font-mono font-bold text-[#211D1A] dark:text-[#FAF6F0] capitalize">{user.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct Studio Concierge:</span>
                <span className="font-mono text-[#D49542]">01917-720875</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
