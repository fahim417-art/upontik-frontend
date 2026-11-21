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
  Ticket,
  Sliders,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  MessageSquare,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoadingUser, logout, theme, toggleTheme } = useStore();
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
    { label: "Orders & Tracking", href: "/admin/orders", icon: ShoppingBag },
    { label: "Homepage CMS", href: "/admin/homepage", icon: Sliders },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Live Support", href: "/admin/support", icon: MessageSquare },
    { label: "Coupons", href: "/admin/coupons", icon: Ticket },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  if (isLoadingUser || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory dark:bg-[#0E0C0A] text-charcoal dark:text-[#F5EFE8]">
        <p className="font-serif text-lg">Verifying administrative access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F1E9] dark:bg-[#0A0908] text-[#211D1A] dark:text-[#F5EFE8] flex flex-col lg:flex-row transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#14110E] dark:bg-[#070605] text-[#FAF6F0] flex-col justify-between shrink-0 min-h-screen p-6 border-r border-[#2C2620] shadow-2xl">
        <div>
          {/* Brand Header */}
          <div className="pb-6 border-b border-[#2C2620] mb-6">
            <Link href="/" className="flex items-center gap-2 group">
              <svg className="w-6 h-6 text-[#D49542] transition-transform group-hover:scale-110" viewBox="0 0 32 32" fill="none" stroke="currentColor">
                <path d="M16 4C16 11 11 16 11 22C11 25.5 13.5 28 16 28C18.5 28 21 25.5 21 22C21 16 16 4 16 4Z" fill="currentColor" fillOpacity="0.25" strokeWidth="1.6" />
                <path d="M16 12C12 14 6 18 6 22C6 25 8.5 27 12 27C15 27 16 24 16 22" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M16 12C20 14 26 18 26 22C26 25 23.5 27 20 27C17 27 16 24 16 22" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <div>
                <span className="font-serif text-2xl tracking-wideDisplay text-[#FAF6F0] block">
                  UPONTIK
                </span>
                <span className="block text-[8px] uppercase tracking-[0.25em] text-[#D49542] font-sans font-bold">
                  Master Administration
                </span>
              </div>
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-sans font-medium transition-all ${
                    isActive
                      ? "bg-[#D49542] text-[#0E0C0A] font-bold shadow-md"
                      : "text-[#FAF6F0]/70 hover:text-white hover:bg-[#1E1A16]"
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
        <div className="pt-6 border-t border-[#2C2620] space-y-2">
          {/* Day / Night Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-sm text-xs text-[#FAF6F0]/70 hover:text-white hover:bg-[#1E1A16] transition-colors"
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? <Sun className="w-4 h-4 text-[#D49542]" /> : <Moon className="w-4 h-4 text-[#D49542]" />}
              <span>{theme === "dark" ? "Day Light Mode" : "Night Dark Mode"}</span>
            </span>
            <span className="text-[10px] font-mono text-[#D49542] capitalize">{theme}</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-sm text-xs text-[#FAF6F0]/70 hover:text-white hover:bg-[#1E1A16] transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#D49542]" />
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-sm text-xs text-red-400 hover:text-red-200 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden bg-[#14110E] dark:bg-[#070605] text-[#FAF6F0] p-4 flex items-center justify-between sticky top-0 z-40 border-b border-[#2C2620]">
        <div>
          <span className="font-serif text-xl tracking-wideDisplay text-[#FAF6F0]">
            UPONTIK
          </span>
          <span className="block text-[8px] uppercase tracking-wider text-[#D49542]">
            Admin Console
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 text-[#D49542]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 text-[#FAF6F0]"
            aria-label="Toggle admin menu"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#2C2620] mb-6">
              <span className="font-serif text-2xl text-[#FAF6F0]">UPONTIK Admin</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 text-[#FAF6F0]"
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
                  className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-[#FAF6F0] hover:bg-[#1E1A16]"
                >
                  <item.icon className="w-5 h-5 text-[#D49542]" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={logout}
            className="w-full py-3 bg-red-900/60 text-white text-xs uppercase rounded font-bold"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-ivory dark:bg-[#120F0C] border-b border-[#E8DFC8]/70 dark:border-[#2C2620] px-4 sm:px-10 py-3 sm:py-4 flex items-center justify-between shrink-0 transition-colors">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#80644B] dark:text-[#D49542] uppercase tracking-editorial font-bold">
              UPONTIK Atelier Portal
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-sans">
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full bg-[#EAE0D0]/50 dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] text-[#D49542] hover:scale-105 transition-all shadow-sm"
              title="Toggle Day/Night Mode"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <span className="hidden md:inline text-charcoal dark:text-[#F5EFE8] font-medium">
              Administrator: <strong className="font-serif text-[#B87932] dark:text-[#D49542]">{user.name}</strong>
            </span>
            <Link
              href="/"
              target="_blank"
              className="py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full bg-[#EAE0D0]/40 dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] text-[#211D1A] dark:text-[#F5EFE8] hover:border-[#D49542] transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-[#D49542]" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-10 min-w-0">{children}</main>
      </div>
    </div>
  );
}
