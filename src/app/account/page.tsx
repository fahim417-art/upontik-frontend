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
  CheckCircle2,
  Shield,
  ArrowRight,
  Truck,
} from "lucide-react";

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
    } catch {}
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
      <main className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="font-serif text-lg text-charcoal">Loading your profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-sand/50 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wideDisplay text-earth font-bold block mb-1">
              Patron Dashboard
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Greetings, {user.name}
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="py-2.5 px-5 bg-mustard text-charcoal text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-1.5 shadow-sm"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="py-2.5 px-4 border border-sand bg-ivory-light text-charcoal text-xs uppercase tracking-editorial rounded hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-sand mb-8 gap-6 text-xs uppercase tracking-editorial font-bold">
          <Link
            href="/account"
            className="pb-3 border-b-2 border-charcoal text-charcoal flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Profile & Addresses</span>
          </Link>
          <Link
            href="/account/orders"
            className="pb-3 border-b-2 border-transparent text-charcoal-muted hover:text-charcoal flex items-center gap-2 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </Link>
          <Link
            href="/account/wishlist"
            className="pb-3 border-b-2 border-transparent text-charcoal-muted hover:text-charcoal flex items-center gap-2 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist</span>
          </Link>
        </div>

        {/* Account Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile Settings Content */}
          <div className="lg:col-span-7 bg-ivory-light border border-sand/60 rounded-sm p-6 sm:p-8">
            <h2 className="font-serif text-xl text-charcoal font-medium pb-4 border-b border-sand/40 mb-6">
              Personal Profile & Primary Delivery Address
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Email (Account Identifier)
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full p-2.5 bg-sand/20 border border-sand/40 rounded text-xs text-charcoal-muted cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1711-000000"
                    className="w-full p-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-sand/40">
                <h3 className="font-serif text-base text-charcoal font-medium mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-earth" />
                  <span>Primary Delivery Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Street Address & House Details
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      placeholder="House, Road, Apartment..."
                      className="w-full p-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="py-3 px-8 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-charcoal-light shadow-sm transition-colors mt-6"
              >
                <Save className="w-4 h-4 text-mustard" />
                <span>{isSaving ? "Saving..." : "Save Profile Details"}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Latest Order Live Tracker */}
          <div className="lg:col-span-5 space-y-6">
            {recentOrder ? (
              <div className="bg-ivory-light border border-sand/60 rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-sand/40">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-editorial text-mustard block">
                      Active Order Tracker
                    </span>
                    <h3 className="font-serif text-lg font-normal text-charcoal">
                      Order #{recentOrder.orderNumber}
                    </h3>
                  </div>
                  <Link
                    href="/account/orders"
                    className="text-xs font-bold text-mustard hover:text-earth flex items-center gap-1 uppercase tracking-editorial"
                  >
                    <span>All Orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <OrderTracker order={recentOrder} />
              </div>
            ) : (
              <div className="bg-ivory-light border border-sand/60 rounded-sm p-6 text-center">
                <Package className="w-10 h-10 text-earth mx-auto mb-2 opacity-60" />
                <h4 className="font-serif text-base text-charcoal mb-1">No Orders Recorded Yet</h4>
                <p className="text-xs text-charcoal-muted mb-4 leading-relaxed">
                  When you order handcrafted bags, their live milestones and courier tracking will appear here.
                </p>
                <Link
                  href="/shop"
                  className="inline-block py-2.5 px-6 bg-charcoal text-ivory text-xs uppercase tracking-editorial rounded hover:bg-charcoal-light transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
