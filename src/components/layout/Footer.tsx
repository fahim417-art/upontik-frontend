"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Facebook, Heart, ShieldCheck, Truck, RotateCcw, MapPin, Phone, Mail } from "lucide-react";
import { useStore } from "@/context/StoreContext";

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
    <footer className="bg-charcoal text-ivory/90 pt-16 pb-12 border-t border-charcoal-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-charcoal-light/60">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center text-mustard flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wideDisplay text-ivory font-semibold">
                Authentic Craftsmanship
              </h5>
              <p className="text-[11px] text-ivory/60">
                100% hand-loomed textiles & turned wood
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center text-mustard flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wideDisplay text-ivory font-semibold">
                Reliable Courier
              </h5>
              <p className="text-[11px] text-ivory/60">
                Nationwide express dispatch to your door
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center text-mustard flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wideDisplay text-ivory font-semibold">
                Studio Inspection
              </h5>
              <p className="text-[11px] text-ivory/60">
                Every piece quality verified before packaging
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center text-mustard flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wideDisplay text-ivory font-semibold">
                Patron Concierge
              </h5>
              <p className="text-[11px] text-ivory/60">
                Personal assistance for orders & inquiries
              </p>
            </div>
          </div>
        </div>

        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-charcoal-light/60">

          {/* Brand Atelier Col */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-3xl tracking-widestEditorial text-ivory block">
                UPONTIK
              </span>
              <span className="block text-[8px] uppercase tracking-[0.3em] text-mustard font-sans font-semibold">
                Artisan Fashion Studio
              </span>
            </Link>
            <p className="text-xs sm:text-sm font-sans text-ivory/70 leading-relaxed max-w-sm mb-6">
              Handcrafted bags and textile accessories bringing cultural heritage, intricate loom textures, and contemporary silhouette design together.
            </p>

            <div className="flex items-center gap-4 text-ivory/80">
              <a
                href="https://www.facebook.com/share/1CYhYuFu83/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal-light/80 hover:bg-mustard hover:text-charcoal flex items-center justify-center transition-colors"
                aria-label="UPONTIK Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801917720875"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal-light/80 hover:bg-mustard hover:text-charcoal flex items-center justify-center transition-colors"
                aria-label="UPONTIK WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 5 Fixed Categories */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wideDisplay font-bold text-sand mb-4">
              Silhouettes
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-ivory/75">
              <li>
                <Link href="/category/side-bag" className="hover:text-mustard transition-colors">
                  Side Bag
                </Link>
              </li>
              <li>
                <Link href="/category/pouch-bag" className="hover:text-mustard transition-colors">
                  Pouch Bag
                </Link>
              </li>
              <li>
                <Link href="/category/dhol-bag" className="hover:text-mustard transition-colors flex items-center gap-1.5 font-medium text-ivory">
                  <span>Dhol Bag</span>
                  <span className="text-[9px] bg-mustard/20 text-mustard px-1 rounded-xs">Signature</span>
                </Link>
              </li>
              <li>
                <Link href="/category/phone-bag" className="hover:text-mustard transition-colors">
                  Phone Bag
                </Link>
              </li>
              <li>
                <Link href="/category/tote-bag" className="hover:text-mustard transition-colors">
                  Tote Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wideDisplay font-bold text-sand mb-4">
              Studio Concierge
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-ivory/75">
              <li>
                <Link href="/shipping-returns" className="hover:text-mustard transition-colors">
                  Shipping & Courier
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-mustard transition-colors">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-mustard transition-colors">
                  Care & Maintenance
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-mustard transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-mustard transition-colors">
                  Contact Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Dispatches */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wideDisplay font-bold text-sand mb-4">
              Atelier Newsletter
            </h4>
            <p className="text-[11px] text-ivory/70 leading-relaxed mb-4">
              Private previews of small-batch collections and loom stories.
            </p>
            {isSubscribed ? (
              <p className="text-xs text-mustard font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-mustard text-mustard" /> Subscribed to dispatches.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="w-full bg-charcoal-light/60 border border-charcoal-light focus:border-mustard rounded-xs px-3 py-2 text-xs text-ivory placeholder-ivory/40 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-sand hover:text-mustard transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-charcoal-light/40 text-[10px] text-ivory/60 space-y-1">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-mustard" />
                <span>ummetanzila264@gmail.com</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-mustard" />
                <span>+880 1917-720875</span>
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-mustard" />
                <span>Konabari, Gazipur, Bangladesh — 1702</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-ivory/60 gap-4">
          <p>© {new Date().getFullYear()} UPONTIK. Tradition, Woven Into Modern Living. All rights reserved.</p>
          <div className="flex items-center gap-4 text-ivory/70">
            <span className="font-mono text-[10px] uppercase bg-charcoal-light px-2 py-0.5 rounded-xs">Cash on Delivery</span>
            <span className="font-mono text-[10px] uppercase bg-charcoal-light px-2 py-0.5 rounded-xs">bKash</span>
            <span className="font-mono text-[10px] uppercase bg-charcoal-light px-2 py-0.5 rounded-xs">Nagad</span>
            <Link href="/privacy" className="hover:text-ivory transition-colors ml-2">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ivory transition-colors">
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
