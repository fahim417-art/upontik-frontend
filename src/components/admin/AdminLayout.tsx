"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Boxes,
  Users,
  MessageSquare,
  Ticket,
  Sliders,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Compass,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoadingUser, logout } = useStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoadingUser) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "admin") {
        router.push("/account");
      }
    }
  }, [user, isLoadingUser, router]);

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Homepage CMS", href: "/admin/homepage", icon: Sliders },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Coupons", href: "/admin/coupons", icon: Ticket },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  if (isLoadingUser || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory text-charcoal">
        <p className="font-serif text-lg">Verifying administrative access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F1E9] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-charcoal text-ivory flex-col justify-between shrink-0 min-h-screen p-6 border-r border-charcoal-light shadow-elevated">
        <div>
          {/* Brand Header */}
          <div className="pb-6 border-b border-charcoal-light mb-6">
            <Link href="/" className="block">
              <span className="font-serif text-2xl tracking-wideDisplay text-ivory">
                UPONTIK
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-sand font-sans font-bold">
                Master Administration
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-sans font-medium transition-all ${
                    isActive
                      ? "bg-mustard text-charcoal font-bold shadow-sm"
                      : "text-ivory/70 hover:text-ivory hover:bg-charcoal-light/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-charcoal-light space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded text-xs text-ivory/60 hover:text-ivory hover:bg-charcoal-light transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-sand" />
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded text-xs text-red-300 hover:text-red-100 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden bg-charcoal text-ivory p-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <span className="font-serif text-xl tracking-wideDisplay text-ivory">
            UPONTIK
          </span>
          <span className="block text-[8px] uppercase tracking-wider text-sand">
            Admin Console
          </span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 text-ivory"
          aria-label="Toggle admin menu"
        >
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-charcoal-light mb-6">
              <span className="font-serif text-2xl text-ivory">UPONTIK Admin</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 text-ivory"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded text-sm text-ivory hover:bg-charcoal-light"
                >
                  <item.icon className="w-5 h-5 text-mustard" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={logout}
            className="w-full py-3 bg-red-900/60 text-ivory text-xs uppercase rounded font-bold"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-ivory border-b border-sand/60 px-6 sm:px-10 py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-sans text-charcoal-muted uppercase tracking-editorial font-bold">
              UPONTIK Atelier Management
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="hidden sm:inline text-charcoal font-medium">
              Administrator: <strong className="font-serif">{user.name}</strong>
            </span>
            <Link
              href="/"
              target="_blank"
              className="py-1.5 px-3 rounded bg-sand/30 border border-sand/60 text-charcoal hover:bg-sand/60 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
