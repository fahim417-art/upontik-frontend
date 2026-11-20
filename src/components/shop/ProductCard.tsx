"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, Sparkles, Eye } from "lucide-react";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    salePrice?: number;
    images: Array<{ url: string; alt: string; isMain?: boolean }>;
    bestSeller?: boolean;
    newArrival?: boolean;
    variants?: Array<{ name: string; options: string[] }>;
    stock?: number;
    shortDescription?: string;
    categorySlug?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isSaved = isInWishlist(String(product._id));
  const mainImage =
    product.images?.find((img) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=600";
  const hoverImage = product.images?.[1]?.url || mainImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: String(product._id),
      name: product.name,
      slug: product.slug,
      price: product.salePrice && product.salePrice > 0 ? product.salePrice : product.price,
      image: mainImage,
      sku: product.sku,
      quantity: 1,
      selectedVariant: product.variants?.[0]?.options?.[0] || undefined,
      categorySlug: product.categorySlug,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(String(product._id));
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const isDiscounted = product.salePrice && product.salePrice < product.price;
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <>
      <div
        className="group relative flex flex-col bg-ivory dark:bg-[#171411] border border-[#E8DFC8]/70 dark:border-[#2C2620] rounded-sm p-3 hover:border-[#D49542] dark:hover:border-[#D49542] hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Frame */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xs bg-[#EAE0D0]/20 dark:bg-[#1E1A16] border border-[#E8DFC8]/40 dark:border-[#2A241F]">
          {/* Editorial Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
            {product.bestSeller && (
              <span className="bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] text-[9px] font-sans font-bold uppercase tracking-wideDisplay px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#D49542] dark:text-[#0E0C0A]" />
                Most Loved
              </span>
            )}
            {product.newArrival && !product.bestSeller && (
              <span className="bg-[#B87932] text-white text-[9px] font-sans font-bold uppercase tracking-wideDisplay px-2.5 py-1 rounded-full shadow-md">
                New Release
              </span>
            )}
            {isDiscounted && (
              <span className="bg-[#D49542] text-[#0E0C0A] text-[9px] font-sans font-bold uppercase tracking-wideDisplay px-2 py-0.5 rounded-full shadow-sm">
                Artisan Price
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-[#0E0C0A]/85 text-white text-[9px] font-sans font-medium uppercase tracking-wideDisplay px-2.5 py-0.5 rounded-full">
                Sold Out
              </span>
            )}
          </div>

          {/* Action Icon Overlays (Wishlist & Quick View) */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
            <button
              onClick={handleWishlistToggle}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isSaved
                  ? "bg-[#D49542] text-[#0E0C0A] shadow-md scale-105"
                  : "bg-white/85 dark:bg-[#1E1A16]/85 text-[#211D1A] dark:text-[#F5EFE8] backdrop-blur-sm hover:bg-white dark:hover:bg-[#2A241F]"
              }`}
              aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform ${
                  isSaved ? "fill-[#0E0C0A] dark:fill-[#0E0C0A]" : ""
                }`}
              />
            </button>
            <button
              onClick={handleOpenQuickView}
              className="w-8 h-8 rounded-full bg-white/85 dark:bg-[#1E1A16]/85 text-[#211D1A] dark:text-[#F5EFE8] backdrop-blur-sm hover:bg-white dark:hover:bg-[#2A241F] hover:text-[#D49542] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
              aria-label="Quick preview"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary and Hover Cross-Fade Images */}
          <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover transition-all duration-700 ease-luxury ${
                isHovered && hoverImage !== mainImage
                  ? "opacity-0 scale-105"
                  : "opacity-100 scale-100 group-hover:scale-105"
              }`}
            />
            {hoverImage !== mainImage && (
              <Image
                src={hoverImage}
                alt={`${product.name} angle`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`object-cover transition-all duration-700 ease-luxury absolute inset-0 ${
                  isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
              />
            )}
          </Link>
        </div>

        {/* Content Section */}
        <div className="pt-3 pb-1 flex flex-col justify-between flex-1">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#80644B] dark:text-[#D49542] block mb-1">
              {product.categorySlug?.replace("-", " ") || "Handcrafted Textile"}
            </span>

            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif text-sm sm:text-base text-[#211D1A] dark:text-[#F5EFE8] font-medium leading-snug line-clamp-1 group-hover:text-[#D49542] transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E8DFC8]/60 dark:border-[#2C2620] mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-sm font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                {formatPrice(
                  product.salePrice && product.salePrice > 0
                    ? product.salePrice
                    : product.price
                )}
              </span>
              {isDiscounted && (
                <span className="font-serif text-xs text-charcoal-muted dark:text-[#A39789] line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`py-1.5 px-3 rounded-full text-[11px] font-sans uppercase tracking-editorial transition-all flex items-center gap-1.5 ${
                isAdded
                  ? "bg-emerald-600 text-white font-bold"
                  : isOutOfStock
                  ? "bg-sand/30 dark:bg-[#1E1A16] text-[#A39789] cursor-not-allowed"
                  : "bg-[#211D1A] dark:bg-[#2A241F] text-ivory hover:bg-[#D49542] hover:text-[#0E0C0A] font-medium shadow-sm"
              }`}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{isAdded ? "Added" : isOutOfStock ? "Sold" : "Add"}</span>
            </button>
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
