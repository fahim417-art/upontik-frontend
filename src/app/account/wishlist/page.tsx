"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  Heart,
  Package,
  User,
  Share2,
  ShoppingBag,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import { FloralHeaderOrnament } from "@/components/ui/FloralMotif";

export default function AccountWishlistPage() {
  const router = useRouter();
  const { user, wishlist, showToast, addToCart, setIsCartDrawerOpen } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchWishlistProducts();
  }, [wishlist]);

  const fetchWishlistProducts = async () => {
    try {
      setIsLoading(true);
      if (wishlist.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch {
      showToast("Failed to load wishlist items", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareWishlist = () => {
    if (products.length === 0) return;
    const bagNames = products.map((p) => p.name).join(", ");
    const text = `Check out my saved UPONTIK handcrafted bags: ${bagNames} at https://upontik.com/shop`;
    if (navigator.share) {
      navigator.share({
        title: "My UPONTIK Wishlist",
        text,
        url: window.location.origin + "/shop",
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      showToast("Wishlist link and bags copied to clipboard!", "success");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleMoveAllToCart = () => {
    if (products.length === 0) return;
    let addedCount = 0;
    products.forEach((p) => {
      addToCart({
        productId: String(p._id),
        name: p.name,
        slug: p.slug,
        price: p.salePrice && p.salePrice > 0 ? p.salePrice : p.price,
        image: p.images?.[0]?.url || p.images?.[0] || "/images/placeholder.jpg",
        sku: p.sku || "UPK",
        quantity: 1,
      });
      addedCount++;
    });
    showToast(`Transferred ${addedCount} pieces to your shopping bag`, "success");
    setIsCartDrawerOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory dark:bg-[#0E0C0A] text-[#211D1A] dark:text-[#F5EFE8] transition-colors duration-300">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Navigation Tabs (scrollable on mobile) */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-[#E8DFC8]/70 dark:border-[#2C2620] mb-8 gap-4 sm:gap-6 text-xs uppercase tracking-editorial font-bold whitespace-nowrap">
          <Link
            href="/account"
            className="pb-3 border-b-2 border-transparent text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#F5EFE8] flex items-center gap-2 transition-colors"
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
            className="pb-3 border-b-2 border-[#211D1A] dark:border-[#D49542] text-[#211D1A] dark:text-[#D49542] flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </Link>
        </div>

        {/* Header with Share & Move to Bag Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#E8DFC8]/60 dark:border-[#2C2620] gap-4">
          <div>
            <FloralHeaderOrnament className="text-[#D49542] mb-1" />
            <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
              Saved Pieces ({products.length})
            </h1>
            <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
              Your curated shortlist of handcrafted bags saved for special occasions and gifting.
            </p>
          </div>

          {products.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleShareWishlist}
                className="py-2.5 px-4 rounded-full border border-sand dark:border-[#2C2620] bg-ivory dark:bg-[#171411] hover:border-[#D49542] text-xs font-medium flex items-center gap-2 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#D49542]" />}
                <span>{copiedLink ? "Link Copied!" : "Share Wishlist"}</span>
              </button>

              <button
                onClick={handleMoveAllToCart}
                className="py-2.5 px-5 rounded-full bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs font-bold uppercase tracking-editorial flex items-center gap-2 hover:bg-[#B87932] transition-colors shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag</span>
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-[#80644B] dark:text-[#D49542] font-serif">
            Loading saved pieces...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center bg-ivory dark:bg-[#171411] border border-sand/70 dark:border-[#2C2620] rounded-sm p-8 max-w-md mx-auto shadow-sm">
            <Heart className="w-12 h-12 text-[#D49542] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#211D1A] dark:text-[#F5EFE8] mb-1">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-[#80644B] dark:text-[#A39789] mb-6">
              Click the heart icon on any product to save pieces you admire for later.
            </p>
            <Link
              href="/shop"
              className="py-2.5 px-6 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded-full hover:bg-[#B87932] transition-colors"
            >
              Discover Bags
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.slug || product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
