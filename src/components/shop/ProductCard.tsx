"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, Check, Sparkles, Eye } from "lucide-react";
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
        className="group relative flex flex-col bg-ivory-light border border-sand/50 rounded-sm p-3 hover:border-sand hover:shadow-luxury transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Frame */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xs bg-sand/20 border border-sand/30">
          {/* Editorial Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
            {product.bestSeller && (
              <span className="bg-charcoal text-ivory text-[9px] font-sans font-bold uppercase tracking-wideDisplay px-2.5 py-1 rounded-xs shadow-subtle flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-mustard" />
                Most Loved
              </span>
            )}
            {product.newArrival && !product.bestSeller && (
              <span className="bg-earth text-ivory text-[9px] font-sans font-bold uppercase tracking-wideDisplay px-2.5 py-1 rounded-xs shadow-subtle">
                New Release
              </span>
            )}
            {isDiscounted && (
              <span className="bg-mustard text-charcoal text-[9px] font-sans font-bold uppercase tracking-wideDisplay px-2 py-0.5 rounded-xs shadow-subtle">
                Artisan Price
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-charcoal/80 text-ivory text-[9px] font-sans font-medium uppercase tracking-wideDisplay px-2 py-0.5 rounded-xs">
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
                  ? "bg-mustard text-charcoal shadow-sm scale-105"
                  : "bg-ivory/80 text-charcoal backdrop-blur-sm hover:bg-ivory hover:text-earth"
              }`}
              aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform ${
                  isSaved ? "fill-charcoal" : ""
                }`}
              />
            </button>
            <button
              onClick={handleOpenQuickView}
              className="w-8 h-8 rounded-full bg-ivory/80 text-charcoal backdrop-blur-sm hover:bg-ivory hover:text-mustard flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm"
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
                isHovered && hoverImage !== mainImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
              }`}
            />
            {hoverImage && hoverImage !== mainImage && (
              <Image
                src={hoverImage}
                alt={`${product.name} alternate angle`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`object-cover transition-all duration-700 ease-luxury absolute inset-0 ${
                  isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
              />
            )}
          </Link>

          {/* Quick Add To Bag Action */}
          <div
            className={`absolute bottom-3 inset-x-3 transition-all duration-300 transform ${
              isHovered && !isOutOfStock
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "translate-y-3 opacity-0 pointer-events-none"
            }`}
          >
            <button
              onClick={handleQuickAdd}
              disabled={isAdded || isOutOfStock}
              className="w-full py-2 px-3 bg-charcoal/95 hover:bg-mustard text-ivory hover:text-charcoal text-[11px] uppercase tracking-wideDisplay font-semibold rounded-xs backdrop-blur-md flex items-center justify-center gap-2 shadow-elevated transition-all duration-200"
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-mustard hover:text-charcoal" />
                  <span>Piece Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-mustard" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Details Row */}
        <div className="pt-3.5 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-earth font-mono">
                {product.sku}
              </span>
              {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
                <span className="text-[9px] uppercase tracking-wider text-mustard font-semibold">
                  Only {product.stock} left
                </span>
              )}
            </div>

            <h3 className="font-serif text-base sm:text-lg text-charcoal font-normal mt-1 group-hover:text-mustard transition-colors line-clamp-1 leading-snug">
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </h3>

            {product.shortDescription && (
              <p className="text-xs text-charcoal-muted line-clamp-1 mt-1 font-sans">
                {product.shortDescription}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-sand/40">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-base sm:text-lg font-normal text-charcoal">
                {formatPrice(isDiscounted && product.salePrice ? product.salePrice : product.price)}
              </span>
              {isDiscounted && (
                <span className="font-serif text-xs text-charcoal-muted line-through opacity-70">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.variants && product.variants.length > 0 && (
              <span className="text-[10px] font-sans text-charcoal-muted font-medium bg-sand/30 px-1.5 py-0.5 rounded-xs">
                {product.variants[0].options?.length || 1} options
              </span>
            )}
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
