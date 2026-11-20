"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { Eye, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { QuickViewModal } from "../shop/QuickViewModal";

interface NewArrivalsSectionProps {
  products: any[];
}

export function NewArrivalsSection({ products = [] }: NewArrivalsSectionProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const newArrivals = products.filter((p) => p.newArrival || p.status === "published").slice(0, 4);

  return (
    <section className="py-20 lg:py-24 bg-[#FAF6F0] border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-sand">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B87932] font-semibold block mb-1">
              LIMITED ATELIER RELEASES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#211D1A] font-normal">
              Fresh From Our Studio
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#80644B] mt-1">
              Meet the latest additions to our collection, shaped from fresh looms and seasonal dyes.
            </p>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs uppercase tracking-editorial text-[#80644B] hover:text-[#B87932] font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View All New Releases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.map((product) => {
            const mainImg = product.images?.[0]?.url || product.images?.[0] || "/images/placeholder.jpg";
            const isFav = isInWishlist(product._id || product.id);

            return (
              <div
                key={product._id || product.id}
                className="group flex flex-col justify-between bg-ivory border border-sand/60 rounded-sm overflow-hidden hover:border-[#B87932]/60 hover:shadow-elevated transition-all duration-300"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-sand/20 overflow-hidden">
                    <Image
                      src={mainImg}
                      alt={product.name}
                      fill
                      sizes="280px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* New Badge */}
                    <span className="absolute top-2.5 left-2.5 text-[9px] uppercase tracking-wider bg-[#B87932] text-white px-2 py-0.5 rounded-xs font-mono font-bold">
                      New Release
                    </span>

                    {/* Action overlays */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleWishlist(product._id || product.id)}
                        className="p-2 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-sm transition-colors"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-[#B87932] text-[#B87932]" : ""}`} />
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-2 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-sm transition-colors"
                        aria-label="Quick view"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-wider text-[#80644B] font-mono block mb-1">
                      {product.categorySlug?.replace("-", " ")}
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-serif text-base text-[#211D1A] font-medium line-clamp-1 group-hover:text-[#B87932] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-serif text-sm font-bold text-[#211D1A]">
                        {formatPrice(product.price)}
                      </span>
                      {product.salePrice && product.salePrice < product.price && (
                        <span className="font-serif text-xs text-charcoal-muted line-through">
                          {formatPrice(product.salePrice)}
                        </span>
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
                    className="w-full py-2.5 bg-[#211D1A] group-hover:bg-[#B87932] text-ivory text-xs uppercase tracking-editorial rounded font-medium flex items-center justify-center gap-1.5 transition-colors"
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
