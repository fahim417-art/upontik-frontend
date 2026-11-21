"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { Eye, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { QuickViewModal } from "../shop/QuickViewModal";
import { FloralHeaderOrnament } from "../ui/FloralMotif";

interface NewArrivalsSectionProps {
  products: any[];
}

export function NewArrivalsSection({ products = [] }: NewArrivalsSectionProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const newArrivals = products.filter((p) => p.newArrival || p.status === "published").slice(0, 4);

  return (
    <section className="py-20 lg:py-24 bg-[#FAF7F2] dark:bg-[#0E0C0A] border-b border-[#E8DFC8]/60 dark:border-[#2C2620] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#E8DFC8]/70 dark:border-[#2C2620]">
          <div>
            <FloralHeaderOrnament className="text-[#D49542] mb-1" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B87932] dark:text-[#D49542] font-semibold block mb-1">
              LIMITED ATELIER RELEASES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
              Fresh From Our Studio
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#80644B] dark:text-[#A39789] mt-1">
              Meet the latest additions to our collection, shaped from fresh looms and seasonal botanical dyes.
            </p>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs uppercase tracking-editorial text-[#80644B] dark:text-[#D49542] hover:text-[#B87932] font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View All New Releases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Column Layout (2 columns on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {newArrivals.map((product) => {
            const mainImg = product.images?.[0]?.url || product.images?.[0] || "/images/placeholder.jpg";
            const isFav = isInWishlist(product._id || product.id);

            return (
              <div
                key={product._id || product.id}
                className="group flex flex-col justify-between bg-ivory dark:bg-[#171411] border border-[#E8DFC8]/80 dark:border-[#2C2620] rounded-sm overflow-hidden hover:border-[#D49542] hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-[#EAE0D0]/20 dark:bg-[#1E1A16] overflow-hidden">
                    <Image
                      src={mainImg}
                      alt={product.name}
                      fill
                      sizes="280px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* New & Discount Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                      <span className="text-[9px] uppercase tracking-wider bg-[#B87932] dark:bg-[#D49542] text-white dark:text-[#0E0C0A] px-2.5 py-0.5 rounded-full font-mono font-bold shadow-sm">
                        New Release
                      </span>
                      {product.salePrice && product.salePrice < product.price && (
                        <span className="text-[9px] uppercase tracking-wider bg-[#D49542] text-[#0E0C0A] px-2 py-0.5 rounded-full font-mono font-bold shadow-sm">
                          {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Action overlays */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleWishlist(product._id || product.id)}
                        className="p-2 rounded-full bg-white/90 dark:bg-[#1E1A16]/90 hover:bg-white dark:hover:bg-[#2A241F] text-charcoal dark:text-[#F5EFE8] shadow-md transition-colors"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-[#D49542] text-[#D49542]" : ""}`} />
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-2 rounded-full bg-white/90 dark:bg-[#1E1A16]/90 hover:bg-white dark:hover:bg-[#2A241F] text-charcoal dark:text-[#F5EFE8] shadow-md transition-colors"
                        aria-label="Quick view"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-wider text-[#80644B] dark:text-[#D49542] font-mono block mb-1">
                      {product.categorySlug?.replace("-", " ")}
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-serif text-base text-[#211D1A] dark:text-[#F5EFE8] font-medium line-clamp-1 group-hover:text-[#D49542] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-serif text-sm font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                        {formatPrice(
                          product.salePrice && product.salePrice > 0
                            ? product.salePrice
                            : product.price
                        )}
                      </span>
                      {product.salePrice && product.salePrice < product.price && (
                        <>
                          <span className="font-serif text-xs text-[#80644B] dark:text-[#A39789] line-through opacity-70">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-[10px] bg-[#D49542] text-[#0E0C0A] font-bold px-1.5 py-0.2 rounded">
                            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() =>
                      addToCart({
                        productId: product._id || product.id,
                        name: product.name,
                        slug: product.slug,
                        sku: product.sku || "UPK",
                        price: product.price,
                        image: mainImg,
                        quantity: 1,
                      })
                    }
                    className="w-full py-2.5 bg-[#211D1A] dark:bg-[#2A241F] group-hover:bg-[#B87932] dark:group-hover:bg-[#D49542] text-ivory dark:group-hover:text-[#0E0C0A] text-xs uppercase tracking-editorial rounded-full font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
