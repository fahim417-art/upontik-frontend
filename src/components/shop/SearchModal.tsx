"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({
    products: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults({ products: [], categories: [] });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [] });
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative max-w-3xl mx-auto my-12 px-4">
        <div className="bg-ivory border border-sand shadow-elevated rounded-sm overflow-hidden">
          {/* Search Header Input */}
          <div className="p-4 sm:p-6 border-b border-sand flex items-center gap-3">
            <Search className="w-5 h-5 text-earth shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handcrafted bags, textile pouches, Dhol bags..."
              className="w-full bg-transparent text-charcoal placeholder-charcoal-muted/60 text-base sm:text-lg font-serif focus:outline-none"
            />
            {isLoading && (
              <Loader2 className="w-5 h-5 text-mustard animate-spin shrink-0" />
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-charcoal hover:text-earth transition-colors shrink-0"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Categories Bar */}
          <div className="px-6 py-3 bg-sand/20 border-b border-sand/40 flex items-center gap-2 overflow-x-auto text-xs font-sans">
            <span className="text-earth uppercase tracking-editorial font-bold shrink-0">
              Popular:
            </span>
            <Link
              href="/category/dhol-bag"
              onClick={() => setIsSearchOpen(false)}
              className="px-2.5 py-1 rounded bg-ivory border border-sand/60 text-charcoal hover:border-mustard transition-colors shrink-0"
            >
              Dhol Bag
            </Link>
            <Link
              href="/category/side-bag"
              onClick={() => setIsSearchOpen(false)}
              className="px-2.5 py-1 rounded bg-ivory border border-sand/60 text-charcoal hover:border-mustard transition-colors shrink-0"
            >
              Side Bag
            </Link>
            <Link
              href="/category/pouch-bag"
              onClick={() => setIsSearchOpen(false)}
              className="px-2.5 py-1 rounded bg-ivory border border-sand/60 text-charcoal hover:border-mustard transition-colors shrink-0"
            >
              Pouch Bag
            </Link>
            <Link
              href="/category/tote-bag"
              onClick={() => setIsSearchOpen(false)}
              className="px-2.5 py-1 rounded bg-ivory border border-sand/60 text-charcoal hover:border-mustard transition-colors shrink-0"
            >
              Tote Bag
            </Link>
          </div>

          {/* Search Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {query.trim() && !isLoading && results.products.length === 0 && results.categories.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-serif text-lg text-charcoal mb-1">
                  No matching artisan pieces found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-charcoal-muted">
                  Try searching for &quot;Dhol Bag&quot;, &quot;Ochre&quot;, &quot;Tote&quot;, or &quot;Crossbody&quot;.
                </p>
              </div>
            ) : null}

            {/* Matched Categories */}
            {results.categories.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[11px] uppercase tracking-editorial text-earth font-bold mb-3">
                  Matching Categories
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.categories.map((c: any) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="p-3 bg-ivory-light border border-sand rounded flex items-center justify-between hover:border-mustard transition-colors group"
                    >
                      <div>
                        <p className="font-serif text-sm text-charcoal font-medium group-hover:text-mustard">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-charcoal-muted line-clamp-1">
                          {c.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-earth group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Products */}
            {results.products.length > 0 && (
              <div>
                <h4 className="text-[11px] uppercase tracking-editorial text-earth font-bold mb-3">
                  Matching Products ({results.products.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.products.map((p: any) => {
                    const img =
                      p.images?.find((i: any) => i.isMain)?.url ||
                      p.images?.[0]?.url ||
                      "";
                    return (
                      <Link
                        key={p.slug}
                        href={`/product/${p.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2 rounded hover:bg-sand/20 transition-colors group"
                      >
                        <div className="relative w-16 h-20 rounded bg-sand/30 overflow-hidden shrink-0">
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-sm text-charcoal font-medium truncate group-hover:text-mustard transition-colors">
                            {p.name}
                          </h5>
                          <p className="text-xs text-charcoal font-semibold mt-1">
                            {formatPrice(p.salePrice || p.price)}
                            {p.salePrice && p.salePrice < p.price && (
                              <span className="text-[11px] text-charcoal-muted line-through ml-2 font-normal">
                                {formatPrice(p.price)}
                              </span>
                            )}
                          </p>
                          <span className="text-[10px] uppercase tracking-wider text-earth font-sans">
                            {p.sku}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
