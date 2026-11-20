"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Facebook, Heart, ShieldCheck, Truck, RotateCcw, MapPin, Phone, Mail, Sparkles } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { FloralDivider } from "../ui/FloralMotif";

export function Footer() {
  const { showToast } = useStore();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setIsSubscribed(true);
    showToast("Welcome to the UPONTIK Circle.", "success");
    setEmail("");
  };

  return (
    <footer className="bg-[#120F0C] dark:bg-[#070605] text-[#FAF6F0] pt-16 pb-12 border-t border-[#2C2620] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Trust Badges Bar (2 cols on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-10 sm:pb-14 border-b border-[#2C2620]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#1E1A16] flex items-center justify-center text-[#D49542] flex-shrink-0 border border-[#D49542]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wideDisplay text-[#FAF6F0] font-semibold">
                Authentic Craftsmanship
              </h5>
              <p className="text-[11px] text-[#FAF6F0]/60">
                100% hand-loomed textiles & turned wood
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#1E1A16] flex items-center justify-center text-[#D49542] flex-shrink-0 border border-[#D49542]/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wideDisplay text-[#FAF6F0] font-semibold">
                Reliable Courier
              </h5>
              <p className="text-[11px] text-[#FAF6F0]/60">
                Nationwide express dispatch to your door
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#1E1A16] flex items-center justify-center text-[#D49542] flex-shrink-0 border border-[#D49542]/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wideDisplay text-[#FAF6F0] font-semibold">
                Studio Inspection
              </h5>
              <p className="text-[11px] text-[#FAF6F0]/60">
                Every piece quality verified before packaging
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#1E1A16] flex items-center justify-center text-[#D49542] flex-shrink-0 border border-[#D49542]/20">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wideDisplay text-[#FAF6F0] font-semibold">
                Patron Concierge
              </h5>
              <p className="text-[11px] text-[#FAF6F0]/60">
                Personal assistance for orders & inquiries
              </p>
            </div>
          </div>
        </div>

        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-[#2C2620]">

          {/* Brand Atelier Col */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              {/* Blooming lotus mark */}
              <svg className="w-7 h-7 text-[#D49542] transition-transform group-hover:scale-110" viewBox="0 0 32 32" fill="none" stroke="currentColor">
                <path d="M16 4C16 11 11 16 11 22C11 25.5 13.5 28 16 28C18.5 28 21 25.5 21 22C21 16 16 4 16 4Z" fill="currentColor" fillOpacity="0.25" strokeWidth="1.6" />
                <path d="M16 12C12 14 6 18 6 22C6 25 8.5 27 12 27C15 27 16 24 16 22" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M16 12C20 14 26 18 26 22C26 25 23.5 27 20 27C17 27 16 24 16 22" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <div>
                <span className="font-serif text-3xl tracking-widestEditorial text-[#FAF6F0] block">
                  UPONTIK
                </span>
                <span className="block text-[8px] uppercase tracking-[0.3em] text-[#D49542] font-sans font-semibold">
                  Artisan Fashion Studio
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm font-sans text-[#FAF6F0]/70 leading-relaxed max-w-sm mb-6">
              Handcrafted bags and textile accessories bringing cultural heritage, intricate loom textures, and contemporary silhouette design together.
            </p>

            <div className="flex items-center gap-3 text-[#FAF6F0]/80">
              <a
                href="https://www.facebook.com/share/1CYhYuFu83/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1E1A16] hover:bg-[#D49542] hover:text-[#0E0C0A] flex items-center justify-center transition-colors border border-[#2C2620]"
                aria-label="UPONTIK Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801917720875"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1E1A16] hover:bg-[#D49542] hover:text-[#0E0C0A] flex items-center justify-center transition-colors border border-[#2C2620]"
                aria-label="UPONTIK WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/upontik"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1E1A16] hover:bg-[#D49542] hover:text-[#0E0C0A] flex items-center justify-center transition-colors border border-[#2C2620]"
                aria-label="UPONTIK Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 5 Fixed Categories */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wideDisplay font-bold text-[#D49542] mb-4">
              Silhouettes
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#FAF6F0]/75">
              <li>
                <Link href="/category/side-bag" className="hover:text-[#D49542] transition-colors">
                  Side Bag
                </Link>
              </li>
              <li>
                <Link href="/category/pouch-bag" className="hover:text-[#D49542] transition-colors">
                  Pouch Bag
                </Link>
              </li>
              <li>
                <Link href="/category/dhol-bag" className="hover:text-[#D49542] transition-colors flex items-center gap-1.5 font-medium text-white">
                  <span>Dhol Bag</span>
                  <span className="text-[9px] bg-[#D49542]/20 text-[#D49542] px-1.5 py-0.5 rounded-full font-bold">Signature</span>
                </Link>
              </li>
              <li>
                <Link href="/category/phone-bag" className="hover:text-[#D49542] transition-colors">
                  Phone Bag
                </Link>
              </li>
              <li>
                <Link href="/category/tote-bag" className="hover:text-[#D49542] transition-colors">
                  Tote Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Navigation */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wideDisplay font-bold text-[#D49542] mb-4">
              Atelier
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#FAF6F0]/75">
              <li>
                <Link href="/story" className="hover:text-[#D49542] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#D49542] transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-[#D49542] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D49542] transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#D49542] transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Contact Info */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wideDisplay font-bold text-[#D49542] mb-4">
              Studio & Workshop
            </h4>
            <ul className="space-y-3 text-xs font-sans text-[#FAF6F0]/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D49542] shrink-0 mt-0.5" />
                <span>Konabari, Gazipur, Gazipur, Bangladesh, 1702</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D49542] shrink-0" />
                <a href="tel:01917720875" className="hover:text-[#D49542] transition-colors font-mono">
                  01917-720875
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D49542] shrink-0" />
                <a href="mailto:ummetanzila264@gmail.com" className="hover:text-[#D49542] transition-colors">
                  ummetanzila264@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Floral Divider */}
        <div className="py-6">
          <FloralDivider className="text-[#D49542]" />
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF6F0]/50 font-sans gap-4">
          <p>© {new Date().getFullYear()} UPONTIK Handicraft. All rights reserved. Handcrafted in Bangladesh.</p>
          <div className="flex items-center gap-6">
            <Link href="/shipping-returns" className="hover:text-[#D49542] transition-colors">
              Privacy & Studio Terms
            </Link>
            <span className="text-[#2C2620]">•</span>
            <span className="text-[#D49542] font-mono text-[11px]">100% Authentic Handloom</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
