"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { X, Plus, Minus, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuickViewModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0
    ? product.images.map((img: any) => typeof img === "string" ? img : img.url)
    : ["/images/placeholder.jpg"];

  const handleAddToCart = () => {
    addToCart({
      productId: product._id || product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || "UPK",
      price: product.price,
      image: images[0],
      categorySlug: product.categorySlug,
      quantity,
      selectedVariant: selectedVariant || undefined,
    });
    onClose();
  };

  const isFavorited = isInWishlist(product._id || product.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-ivory text-charcoal w-full max-w-3xl rounded-sm shadow-elevated border border-sand overflow-hidden z-10 p-6 sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 text-charcoal-muted hover:text-charcoal transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Gallery */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-[4/5] bg-sand/20 rounded-xs overflow-hidden border border-sand/40">
                <Image
                  src={images[selectedImageIndex] || images[0]}
                  alt={product.name}
                  fill
                  sizes="350px"
                  className="object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-16 rounded-xs overflow-hidden border transition-all ${
                        selectedImageIndex === idx ? "border-mustard ring-1 ring-mustard" : "border-sand/40 opacity-70"
                      }`}
                    >
                      <Image src={img} alt="Thumb" fill sizes="56px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="md:col-span-6 flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-earth font-bold block mb-1">
                  {product.categorySlug?.replace("-", " ")}
                </span>
                <h3 className="font-serif text-2xl text-charcoal font-medium leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-charcoal-muted mt-1">SKU: {product.sku}</p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-serif text-2xl font-bold text-charcoal">
                    {formatPrice(product.price)}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span className="font-serif text-base text-charcoal-muted/60 line-through">
                      {formatPrice(product.salePrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs font-sans text-charcoal-muted leading-relaxed mt-3 line-clamp-3">
                  {product.shortDescription || product.description}
                </p>

                {/* Variants if any */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-sand/40 space-y-2">
                    <span className="text-xs font-medium text-charcoal block">Select Palette / Variant:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants[0]?.options?.map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariant(opt)}
                          className={`px-3 py-1 text-xs rounded-xs border transition-all ${
                            selectedVariant === opt
                              ? "bg-charcoal text-ivory border-charcoal"
                              : "bg-ivory border-sand text-charcoal hover:border-mustard"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-sand/40 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-sand rounded bg-ivory">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-charcoal hover:text-earth transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-charcoal hover:text-earth transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center justify-center gap-2 hover:bg-charcoal-light shadow-elevated transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-mustard" />
                    <span>Add to Bag</span>
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product._id || product.id)}
                    className={`p-3 border rounded transition-colors ${
                      isFavorited ? "border-mustard text-mustard bg-mustard/10" : "border-sand text-charcoal hover:border-mustard"
                    }`}
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? "fill-mustard" : ""}`} />
                  </button>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="w-full text-center text-xs uppercase tracking-editorial text-earth hover:text-mustard font-bold flex items-center justify-center gap-1.5 pt-1"
                >
                  <span>Explore Full Craftsmanship Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
