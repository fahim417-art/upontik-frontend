"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  Heart,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle,
  Eye,
  ZoomIn,
  Package,
} from "lucide-react";

interface ProductDetailsClientProps {
  product: any;
  category: any;
  relatedProducts: any[];
  initialReviews: any[];
}

export function ProductDetailsClient({
  product,
  category,
  relatedProducts,
  initialReviews,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart, isInWishlist, toggleWishlist, showToast } = useStore();

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=800",
            alt: product.name,
          },
        ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.options?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Zoom magnifier state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Accordions
  const [openAccordion, setOpenAccordion] = useState<string | null>("craftsmanship");

  // Review State
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const isSaved = isInWishlist(String(product._id));
  const activePrice =
    product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const isDiscounted = product.salePrice && product.salePrice < product.price;
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      productId: String(product._id),
      name: product.name,
      slug: product.slug,
      price: activePrice,
      image: images[0]?.url || "",
      sku: product.sku,
      quantity,
      selectedVariant: selectedVariant || undefined,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart({
      productId: String(product._id),
      name: product.name,
      slug: product.slug,
      price: activePrice,
      image: images[0]?.url || "",
      sku: product.sku,
      quantity,
      selectedVariant: selectedVariant || undefined,
    });
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewTitle || !reviewComment) {
      showToast("Please fill all review fields", "error");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const newRev = {
        _id: `rev_${Date.now()}`,
        productId: product._id,
        customerName: reviewName,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        isVerifiedPurchase: true,
        createdAt: new Date(),
      };
      setReviews([newRev, ...reviews]);
      showToast("Thank you. Your patron review has been recorded.", "success");
      setReviewName("");
      setReviewTitle("");
      setReviewComment("");
    } catch {
      showToast("Failed to submit review", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="py-8 lg:py-16 pb-28 lg:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Editorial Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] font-sans text-charcoal-muted dark:text-[#A39789] uppercase tracking-wideDisplay mb-8">
        <Link href="/" className="hover:text-[#D49542] transition-colors">
          Home
        </Link>
        <span className="text-sand dark:text-[#383028]">/</span>
        <Link href="/shop" className="hover:text-[#D49542] transition-colors">
          Collections
        </Link>
        <span className="text-sand dark:text-[#383028]">/</span>
        <Link
          href={`/category/${category?.slug || "dhol-bag"}`}
          className="hover:text-[#D49542] transition-colors text-charcoal dark:text-[#F5EFE8] font-medium"
        >
          {category?.name || "Handcrafted Bag"}
        </Link>
      </nav>

      {/* Main Two-Column Editorial Product Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Gallery & Magnifier (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
          
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible w-full sm:w-24 shrink-0 pb-2 sm:pb-0 scrollbar-none">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-24 sm:h-28 rounded-xs overflow-hidden bg-sand/20 dark:bg-[#1E1A16] border transition-all ${
                  selectedImageIndex === idx
                    ? "border-[#D49542] ring-1 ring-[#D49542] shadow-sm"
                    : "border-sand/60 dark:border-[#2C2620] opacity-70 hover:opacity-100"
                }`}
                aria-label={`View angle ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${product.name} view ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Large Main Showcase Canvas with Interactive Zoom */}
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative w-full aspect-[4/5] rounded-xs overflow-hidden bg-sand/20 dark:bg-[#1E1A16] border border-sand dark:border-[#2C2620] shadow-xl group cursor-crosshair"
          >
            <Image
              src={images[selectedImageIndex]?.url || images[0]?.url}
              alt={images[selectedImageIndex]?.alt || product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={`object-cover transition-transform duration-200 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
            />

            {/* Zoom Tooltip Hint */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-sans flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none">
              <ZoomIn className="w-3 h-3 text-[#D49542]" />
              <span>Hover to Zoom Weave</span>
            </div>

            {isDiscounted && (
              <span className="absolute top-4 left-4 bg-[#D49542] text-[#0E0C0A] text-[10px] font-sans font-bold uppercase tracking-wideDisplay px-3 py-1 rounded-full shadow-md">
                Studio Special
              </span>
            )}
            {product.categorySlug === "dhol-bag" && (
              <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-[9px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
                Turned Mahogany Handles
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Information, Pricing, & Ordering (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Silhouette & SKU metadata */}
            <div className="flex items-center justify-between text-xs font-sans text-charcoal-muted dark:text-[#A39789] mb-2">
              <Link
                href={`/category/${category?.slug || "dhol-bag"}`}
                className="text-[#80644B] dark:text-[#D49542] uppercase tracking-wideDisplay font-bold hover:text-[#B87932] transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#D49542]" />
                <span>{category?.name || "Artisan Silhouette"}</span>
              </Link>
              <span className="font-mono text-[11px] text-charcoal-muted dark:text-[#A39789] tracking-wider">
                SKU: {product.sku}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-charcoal dark:text-[#F5EFE8] font-normal leading-[1.12] mb-4">
              {product.name}
            </h1>

            {/* Price Badge */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-sand/60 dark:border-[#2C2620]">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal dark:text-[#FAF6F0]">
                {formatPrice(activePrice)}
              </span>
              {isDiscounted && (
                <span className="font-serif text-lg text-charcoal-muted dark:text-[#A39789] line-through opacity-70">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-[11px] font-sans text-[#80644B] dark:text-[#D49542] ml-2 bg-[#EAE0D0]/40 dark:bg-[#1E1A16] px-2.5 py-0.5 rounded-full border border-[#D49542]/20">
                All Studio Taxes Included
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm font-sans text-charcoal-muted dark:text-[#A39789] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Variant Options Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <span className="text-[11px] uppercase tracking-wideDisplay text-charcoal dark:text-[#F5EFE8] font-bold block mb-2.5">
                  {product.variants[0].name}:{" "}
                  <span className="font-normal text-[#D49542]">
                    {selectedVariant}
                  </span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants[0].options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariant(opt)}
                      className={`px-4 py-1.5 rounded-full text-xs font-sans transition-all ${
                        selectedVariant === opt
                          ? "bg-[#211D1A] dark:bg-[#D49542] text-white dark:text-[#0E0C0A] font-bold shadow-sm"
                          : "bg-ivory dark:bg-[#171411] border border-sand dark:border-[#2C2620] text-charcoal dark:text-[#F5EFE8] hover:border-[#D49542]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Controls & Stock Health */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center border border-sand dark:border-[#2C2620] rounded-full bg-ivory-light dark:bg-[#1E1A16]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:text-[#D49542] transition-colors"
                  aria-label="Decrease piece quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      product.stock ? Math.min(product.stock, q + 1) : q + 1
                    )
                  }
                  className="p-2 hover:text-[#D49542] transition-colors"
                  aria-label="Increase piece quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs font-sans">
                {product.stock !== undefined && product.stock > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Studio ({product.stock} pieces crafted)
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Currently Sold Out</span>
                )}
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isAdded || isOutOfStock}
                className="w-full py-4 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-wideDisplay font-bold rounded-full flex items-center justify-center gap-2 hover:bg-[#B87932] dark:hover:bg-[#E8B878] shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Piece Added To Bag</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 bg-[#B87932] hover:bg-[#A36827] text-white text-xs uppercase tracking-wideDisplay font-bold rounded-full shadow-md transition-all duration-200 text-center disabled:opacity-50"
                >
                  Instant Studio Checkout
                </button>

                <button
                  onClick={() => toggleWishlist(String(product._id))}
                  className={`px-5 py-3.5 rounded-full border border-sand dark:border-[#2C2620] bg-ivory dark:bg-[#1E1A16] transition-all flex items-center justify-center hover:border-[#D49542]`}
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${isSaved ? "fill-[#D49542] text-[#D49542]" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Bengali Trust & Delivery Guarantee Box */}
            <div className="p-4 bg-[#FAF7F2] dark:bg-[#171411] border border-sand/70 dark:border-[#2C2620] rounded-sm mb-6 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#211D1A] dark:text-[#F5EFE8]">
                <Truck className="w-4 h-4 text-[#D49542] shrink-0" />
                <span>সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
              </div>
              <div className="flex items-center gap-2 text-[#211D1A] dark:text-[#F5EFE8]">
                <Eye className="w-4 h-4 text-[#D49542] shrink-0" />
                <span>ডেলিভারিম্যানের সামনে চেক করে নেওয়ার শতভাগ সুযোগ</span>
              </div>
              <div className="flex items-center gap-2 text-[#211D1A] dark:text-[#F5EFE8]">
                <RotateCcw className="w-4 h-4 text-[#D49542] shrink-0" />
                <span>৩ দিনের সহজ এক্সচেঞ্জ ও কাস্টমার সাপোর্ট গ্যারান্টি</span>
              </div>
              <div className="flex items-center gap-2 text-[#211D1A] dark:text-[#F5EFE8]">
                <Sparkles className="w-4 h-4 text-[#D49542] shrink-0" />
                <span>১০০% অথেনটিক হস্তশিল্প ও টার্নড মেহগনি কাঠের তৈরি</span>
              </div>
            </div>
          </div>

          {/* Accordion Specifications */}
          <div className="mt-4 divide-y divide-sand/60 dark:divide-[#2C2620] border-b border-sand/60 dark:border-[#2C2620]">
            {/* 1. Craftsmanship & Materials */}
            <div className="py-3.5">
              <button
                onClick={() =>
                  setOpenAccordion(
                    openAccordion === "craftsmanship" ? null : "craftsmanship"
                  )
                }
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wideDisplay font-bold text-charcoal dark:text-[#F5EFE8]"
              >
                <span>Materials & Craftsmanship</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#D49542] transition-transform duration-200 ${
                    openAccordion === "craftsmanship" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "craftsmanship" && (
                <div className="pt-3 text-xs font-sans text-charcoal-muted dark:text-[#A39789] space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-charcoal dark:text-[#F5EFE8] font-semibold">Materials:</strong>{" "}
                    {product.materials ||
                      "Hand-loomed cotton jacquard weave, solid turned mahogany wood, brass alloy hardware."}
                  </p>
                  <p>
                    <strong className="text-charcoal dark:text-[#F5EFE8] font-semibold">Care Instructions:</strong>{" "}
                    {product.careInstructions ||
                      "Gently spot clean with a soft damp cloth. Avoid submerging wooden handles in water. Store in archival dust bag."}
                  </p>
                </div>
              )}
            </div>

            {/* 2. Dimensions */}
            <div className="py-3.5">
              <button
                onClick={() =>
                  setOpenAccordion(
                    openAccordion === "dimensions" ? null : "dimensions"
                  )
                }
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wideDisplay font-bold text-charcoal dark:text-[#F5EFE8]"
              >
                <span>Dimensions & Ergonomics</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#D49542] transition-transform duration-200 ${
                    openAccordion === "dimensions" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "dimensions" && (
                <div className="pt-3 text-xs font-sans text-charcoal-muted dark:text-[#A39789] leading-relaxed space-y-1">
                  <p className="font-mono text-charcoal dark:text-[#FAF6F0]">
                    Length: {product.dimensions?.length || "26 cm"} • Width:{" "}
                    {product.dimensions?.width || "14 cm"} • Height:{" "}
                    {product.dimensions?.height || "14 cm"}
                  </p>
                  <p>
                    Structured for graceful daily carry with interior partitions tailored for keys, lip balm, and phone.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Shipping Terms */}
            <div className="py-3.5">
              <button
                onClick={() =>
                  setOpenAccordion(
                    openAccordion === "shipping" ? null : "shipping"
                  )
                }
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wideDisplay font-bold text-charcoal dark:text-[#F5EFE8]"
              >
                <span>Shipping & Studio Returns</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#D49542] transition-transform duration-200 ${
                    openAccordion === "shipping" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "shipping" && (
                <div className="pt-3 text-xs font-sans text-charcoal-muted dark:text-[#A39789] space-y-1.5 leading-relaxed">
                  <p>• Inside Dhaka: ৳80 delivery charge (24–48 hours express).</p>
                  <p>• Outside Dhaka: ৳130 delivery charge (48–72 hours via Steadfast).</p>
                  <p>• Complimentary express courier on all studio orders above ৳3,000.</p>
                  <p>• 7-day studio exchange policy for unused items in original presentation packaging.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-20 pt-16 border-t border-sand/60 dark:border-[#2C2620]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold block mb-1">
              Patron Impressions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-[#F5EFE8] font-normal">
              Collector Reviews
            </h2>
            <p className="text-xs text-charcoal-muted dark:text-[#A39789] mt-1">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"} recorded for this handcrafted piece
            </p>
          </div>

          {/* Review Submission Form */}
          <form
            onSubmit={handleReviewSubmit}
            className="p-6 sm:p-8 bg-ivory dark:bg-[#171411] border border-sand/70 dark:border-[#2C2620] rounded-sm mb-12 space-y-4 shadow-sm"
          >
            <h3 className="font-serif text-xl text-charcoal dark:text-[#F5EFE8]">Write an Impression</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-[#F5EFE8] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Samira Rahman"
                  required
                  className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs text-charcoal dark:text-[#F5EFE8] focus:outline-none focus:border-[#D49542]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-[#F5EFE8] mb-1">
                  Artisan Rating
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs text-charcoal dark:text-[#F5EFE8] focus:outline-none focus:border-[#D49542] font-medium"
                >
                  <option value={5}>★★★★★ 5 Stars — Masterpiece</option>
                  <option value={4}>★★★★☆ 4 Stars — Great Craftsmanship</option>
                  <option value={3}>★★★☆☆ 3 Stars — Satisfactory</option>
                  <option value={2}>★★☆☆☆ 2 Stars — Needs Refinement</option>
                  <option value={1}>★☆☆☆☆ 1 Star — Unsatisfactory</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal dark:text-[#F5EFE8] mb-1">
                Headline
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. The wooden handle has extraordinary tactile warmth"
                required
                className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs text-charcoal dark:text-[#F5EFE8] focus:outline-none focus:border-[#D49542]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal dark:text-[#F5EFE8] mb-1">
                Your Review
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe your tactile experience with this piece..."
                rows={3}
                required
                className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded-sm text-xs text-charcoal dark:text-[#F5EFE8] focus:outline-none focus:border-[#D49542]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="py-2.5 px-6 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-wideDisplay font-bold rounded-full hover:bg-[#B87932] transition-colors shadow-sm"
            >
              {isSubmittingReview ? "Recording Review..." : "Submit Review"}
            </button>
          </form>

          {/* Existing Reviews List */}
          {reviews.length > 0 && (
            <div className="space-y-4">
              {reviews.map((r: any) => (
                <div
                  key={r._id}
                  className="p-6 bg-ivory dark:bg-[#171411] border border-sand/70 dark:border-[#2C2620] rounded-sm shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-[#D49542]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? "fill-[#D49542] text-[#D49542]" : "text-sand dark:text-[#383028]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-charcoal-muted dark:text-[#A39789]">
                      {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-charcoal dark:text-[#F5EFE8] mb-1.5">
                    {r.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-charcoal-muted dark:text-[#A39789] font-sans leading-relaxed">
                    {r.comment}
                  </p>
                  <p className="text-xs font-semibold text-charcoal dark:text-[#F5EFE8] mt-3 flex items-center gap-1.5">
                    <span>— {r.customerName}</span>
                    <span className="text-[10px] text-[#D49542] font-mono font-normal">
                      (Verified Patron)
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Complementary Silhouettes (Related Products) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-20 pt-16 border-t border-sand/60 dark:border-[#2C2620]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-sand/50 dark:border-[#2C2620]">
            <div>
              <span className="text-[10px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold block mb-1">
                Atelier Recommendations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-charcoal dark:text-[#F5EFE8] font-normal">
                Complementary Silhouettes
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-wideDisplay font-bold text-[#80644B] dark:text-[#D49542] hover:underline transition-colors"
            >
              Explore All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {relatedProducts.map((p) => (
              <ProductCard key={p.slug || p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add-to-Bag Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-ivory/95 dark:bg-[#120F0C]/95 backdrop-blur-md border-t border-sand/80 dark:border-[#2C2620] p-3 z-30 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="font-serif text-base font-bold text-charcoal dark:text-[#FAF6F0] block">
            {formatPrice(activePrice)}
          </span>
          <span className="text-[10px] text-charcoal-muted dark:text-[#A39789] truncate max-w-[140px] block">
            {product.name}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="py-2.5 px-5 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-wideDisplay font-bold rounded-full flex items-center gap-1.5 hover:bg-[#B87932] transition-colors shadow-md disabled:opacity-50"
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Added</span>
            </>
          ) : isOutOfStock ? (
            <span>Sold Out</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
