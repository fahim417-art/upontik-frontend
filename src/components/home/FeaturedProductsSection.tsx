"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";

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
    <section className="py-20 lg:py-28 bg-ivory border-b border-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-sand/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-mustard rounded-full" />
              <span className="text-[11px] uppercase tracking-wideDisplay text-earth font-bold">
                Artisan Curation
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal">
              Pieces Worth Keeping.
            </h2>
          </div>

          {/* Quick Filter Tabs & Link */}
          <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wideDisplay rounded-xs transition-all ${activeFilter === "all"
                ? "bg-charcoal text-ivory font-semibold shadow-subtle"
                : "text-charcoal-muted hover:text-charcoal bg-sand/30"
                }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setActiveFilter("bestseller")}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wideDisplay rounded-xs transition-all ${activeFilter === "bestseller"
                ? "bg-charcoal text-ivory font-semibold shadow-subtle"
                : "text-charcoal-muted hover:text-charcoal bg-sand/30"
                }`}
            >
              Signatures
            </button>
            <button
              onClick={() => setActiveFilter("new")}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wideDisplay rounded-xs transition-all ${activeFilter === "new"
                ? "bg-charcoal text-ivory font-semibold shadow-subtle"
                : "text-charcoal-muted hover:text-charcoal bg-sand/30"
                }`}
            >
              New Arrivals
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wideDisplay font-bold text-earth hover:text-mustard transition-colors ml-2 pl-3 border-l border-sand/80"
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
      </div>
    </section>
  );
}
