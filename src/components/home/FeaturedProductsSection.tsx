"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";
import { FloralDivider, FloralHeaderOrnament } from "../ui/FloralMotif";

interface FeaturedProductsSectionProps {
  products: any[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "bestseller" | "new">("all");

  if (!products || products.length === 0) return null;

  const filtered = products.filter((p) => {
    if (activeFilter === "bestseller") return p.bestSeller;
    if (activeFilter === "new") return p.newArrival;
    return true;
  });

  const displayList = (filtered.length > 0 ? filtered : products).slice(0, 8);

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] dark:bg-[#120F0C] border-b border-[#E8DFC8]/60 dark:border-[#2C2620] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#E8DFC8]/70 dark:border-[#2C2620]">
          <div>
            <FloralHeaderOrnament className="text-[#D49542] mb-1" />
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-[#B87932] dark:bg-[#D49542] rounded-full" />
              <span className="text-[11px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold font-mono">
                Artisan Curation
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
              Pieces Worth Keeping.
            </h2>
          </div>

          {/* Quick Filter Tabs & Link */}
          <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 text-xs uppercase tracking-wideDisplay rounded-full transition-all ${
                activeFilter === "all"
                  ? "bg-[#211D1A] dark:bg-[#D49542] text-[#F5EFE8] dark:text-[#0E0C0A] font-bold shadow-md"
                  : "text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#F5EFE8] bg-[#EAE0D0]/50 dark:bg-[#1E1A16]"
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setActiveFilter("bestseller")}
              className={`px-4 py-2 text-xs uppercase tracking-wideDisplay rounded-full transition-all ${
                activeFilter === "bestseller"
                  ? "bg-[#211D1A] dark:bg-[#D49542] text-[#F5EFE8] dark:text-[#0E0C0A] font-bold shadow-md"
                  : "text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#F5EFE8] bg-[#EAE0D0]/50 dark:bg-[#1E1A16]"
              }`}
            >
              Signatures
            </button>
            <button
              onClick={() => setActiveFilter("new")}
              className={`px-4 py-2 text-xs uppercase tracking-wideDisplay rounded-full transition-all ${
                activeFilter === "new"
                  ? "bg-[#211D1A] dark:bg-[#D49542] text-[#F5EFE8] dark:text-[#0E0C0A] font-bold shadow-md"
                  : "text-[#80644B] dark:text-[#A39789] hover:text-[#211D1A] dark:hover:text-[#F5EFE8] bg-[#EAE0D0]/50 dark:bg-[#1E1A16]"
              }`}
            >
              New Arrivals
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wideDisplay font-bold text-[#80644B] dark:text-[#D49542] hover:text-[#B87932] transition-colors ml-2 pl-3 border-l border-[#D7C7AE] dark:border-[#2C2620]"
            >
              <span>Explore All ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {displayList.map((product) => (
            <ProductCard key={product.slug || product._id} product={product} />
          ))}
        </div>

        {/* Center Floral Accent Divider */}
        <div className="mt-16">
          <FloralDivider className="text-[#D49542]" />
        </div>
      </div>
    </section>
  );
}
