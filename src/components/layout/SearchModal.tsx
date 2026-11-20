"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Search, X, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=6`);
        const data = await res.json();
        if (data.success && data.data) {
          setResults(data.data);
        }
      } catch (err) {
        console.error("Search query error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    } else if (e.key === "Enter" && query.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-charcoal/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <div className="min-h-screen px-4 text-center flex items-start justify-center pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-ivory w-full max-w-3xl rounded-sm shadow-elevated border border-sand/80 p-6 sm:p-8 text-left z-10"
          >
            {/* Header / Input */}
            <div className="flex items-center justify-between pb-4 border-b border-sand">
              <span className="font-serif text-xs uppercase tracking-wideDisplay text-earth font-bold">
                Search UPONTIK Atelier
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 text-charcoal-muted hover:text-charcoal rounded transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mt-4 mb-6">
              <Search className="w-5 h-5 text-mustard absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search bags, silhouettes, loomed textiles, or colors..."
                className="w-full pl-11 pr-10 py-3 bg-ivory-light border border-sand rounded-sm text-sm font-sans text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:border-mustard transition-colors"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 text-mustard animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Quick Keyword Suggestions */}
            {!query.trim() && (
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-editorial text-charcoal-muted font-bold block">
                  Suggested Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Dhol Bag", "Side Bag", "Pouch Bag", "Tote Bag", "Ochre Jacquard", "Mahogany Handle"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleQuickSearch(tag)}
                      className="px-3 py-1.5 bg-sand/20 hover:bg-sand/40 border border-sand/60 text-xs text-charcoal rounded-sm transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Search Results */}
            {query.trim() && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-charcoal-muted">
                  <span>
                    {isLoading ? "Searching..." : `${results.length} result${results.length === 1 ? "" : "s"} found`}
                  </span>
                  {results.length > 0 && (
                    <Link
                      href={`/shop?search=${encodeURIComponent(query.trim())}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="text-mustard hover:text-earth font-bold uppercase tracking-editorial flex items-center gap-1"
                    >
                      <span>View All Results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                    {results.map((product) => (
                      <Link
                        key={product._id || product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="group flex items-center gap-3 p-2.5 rounded-sm bg-ivory-light border border-sand/40 hover:border-sand hover:bg-sand/10 transition-all"
                      >
                        <div className="relative w-16 h-20 bg-sand/20 rounded-xs overflow-hidden shrink-0">
                          <Image
                            src={product.images?.[0]?.url || product.images?.[0] || "/images/placeholder.jpg"}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-serif text-sm text-charcoal font-medium line-clamp-1 group-hover:text-mustard transition-colors">
                            {product.name}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider text-earth font-sans block mt-0.5">
                            {product.categorySlug?.replace("-", " ")}
                          </span>
                          <span className="font-serif text-xs font-bold text-charcoal mt-1 block">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : !isLoading ? (
                  <div className="py-8 text-center text-charcoal-muted text-xs">
                    No handcrafted pieces match &ldquo;{query}&rdquo;.
                  </div>
                ) : null}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
