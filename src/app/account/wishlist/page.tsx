"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { Heart, Package, User } from "lucide-react";

export default function AccountWishlistPage() {
  const router = useRouter();
  const { user, wishlist, showToast } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Navigation Tabs */}
        <div className="flex border-b border-sand mb-8 gap-6 text-xs uppercase tracking-editorial font-bold">
          <Link
            href="/account"
            className="pb-3 border-b-2 border-transparent text-charcoal-muted hover:text-charcoal flex items-center gap-2 transition-colors"
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
            className="pb-3 border-b-2 border-charcoal text-charcoal flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </Link>
        </div>

        <h1 className="font-serif text-3xl text-charcoal font-normal mb-8">
          Saved Pieces
        </h1>

        {isLoading ? (
          <div className="py-16 text-center text-charcoal-muted font-serif">
            Loading saved pieces...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center bg-ivory-light border border-sand rounded-sm p-8 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-earth mx-auto mb-3" />
            <h3 className="font-serif text-xl text-charcoal mb-1">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-charcoal-muted mb-6">
              Click the heart icon on any product to save pieces you admire for later.
            </p>
            <Link
              href="/shop"
              className="py-2.5 px-6 bg-charcoal text-ivory text-xs uppercase tracking-editorial rounded hover:bg-charcoal-light transition-colors"
            >
              Discover Bags
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
