"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { formatPrice } from "@/lib/utils";
import {
  SlidersHorizontal,
  X,
  ChevronRight,
  RotateCcw,
  PackageSearch,
  Sparkles,
} from "lucide-react";

interface ShopCatalogClientProps {
  initialProducts: any[];
  categories: any[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export function ShopCatalogClient({
  initialProducts,
  categories,
  total,
  currentPage,
  totalPages,
}: ShopCatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter params
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentInStock = searchParams.get("inStock") === "true";
  const currentFeatured = searchParams.get("featured") === "true";

  // Filter dispatch helper
  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 on filter change
    params.delete("page");

    startTransition(() => {
      router.push(`/shop?${params.toString()}`);
    });
  };

  const handleResetFilters = () => {
    startTransition(() => {
      router.push("/shop");
    });
    setIsMobileFilterOpen(false);
  };

  const isAnyFilterActive =
    !!currentCategory ||
    !!currentMinPrice ||
    !!currentMaxPrice ||
    currentInStock ||
    currentFeatured;

  return (
    <div className="py-8 lg:py-12">
      {/* Editorial Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] font-sans text-charcoal-muted uppercase tracking-wideDisplay mb-6">
        <Link href="/" className="hover:text-mustard transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-sand" />
        <Link href="/shop" className="hover:text-mustard transition-colors">
          Catalog
        </Link>
        {currentCategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-sand" />
            <span className="text-mustard font-semibold capitalize">
              {currentCategory.replace("-", " ")}
            </span>
          </>
        )}
      </nav>

      {/* Heading & Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-sand/60 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 bg-mustard rounded-full" />
            <span className="text-[11px] uppercase tracking-wideDisplay text-earth font-bold">
              Artisan Catalog
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal">
            {currentCategory ? (
              <span className="capitalize">{currentCategory.replace("-", " ")} Collection</span>
            ) : (
              "All Handcrafted Collections"
            )}
          </h1>
          <p className="text-xs sm:text-sm font-sans text-charcoal-muted mt-2">
            Showing <span className="font-semibold text-charcoal">{total}</span> curated artisan pieces woven in small batches
          </p>
        </div>

        {/* Sort & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-sand bg-ivory text-xs uppercase tracking-wideDisplay rounded-xs font-medium text-charcoal shadow-subtle"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-earth" />
            <span>Filters</span>
            {isAnyFilterActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-mustard" />
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-sans">
            <span className="text-charcoal-muted uppercase tracking-wideDisplay hidden sm:inline text-[11px]">
              Sort by:
            </span>
            <select
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-3.5 py-2 bg-ivory border border-sand/80 rounded-xs text-xs font-medium text-charcoal focus:outline-none focus:border-charcoal shadow-subtle"
            >
              <option value="newest">Newest Releases</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="bestseller">Signature Best Sellers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Category Pill Bar */}
      <div className="overflow-x-auto scrollbar-none pb-4 mb-8 flex items-center gap-2 sm:gap-2.5">
        <button
          onClick={() => updateFilters({ category: null })}
          className={`px-4 py-1.5 text-xs uppercase tracking-wideDisplay rounded-xs transition-all whitespace-nowrap ${
            !currentCategory
              ? "bg-charcoal text-ivory font-semibold shadow-subtle"
              : "bg-ivory-light border border-sand/60 text-charcoal-muted hover:text-charcoal hover:border-sand"
          }`}
        >
          All Silhouettes ({total})
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => updateFilters({ category: c.slug })}
            className={`px-4 py-1.5 text-xs uppercase tracking-wideDisplay rounded-xs transition-all whitespace-nowrap ${
              currentCategory === c.slug
                ? "bg-charcoal text-ivory font-semibold shadow-subtle"
                : "bg-ivory-light border border-sand/60 text-charcoal-muted hover:text-charcoal hover:border-sand"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Active Filter Pills Indicator */}
      {isAnyFilterActive && (
        <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-sand/20 border border-sand/60 rounded-xs text-xs">
          <span className="text-charcoal-muted uppercase tracking-wideDisplay text-[10px] font-bold">
            Active Filters:
          </span>
          {currentCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory text-charcoal rounded-xs border border-sand text-xs capitalize">
              <span>{currentCategory.replace("-", " ")}</span>
              <button onClick={() => updateFilters({ category: null })} className="hover:text-mustard">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentInStock && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory text-charcoal rounded-xs border border-sand text-xs">
              <span>In Stock Only</span>
              <button onClick={() => updateFilters({ inStock: null })} className="hover:text-mustard">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentFeatured && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory text-charcoal rounded-xs border border-sand text-xs">
              <span>Curated Featured</span>
              <button onClick={() => updateFilters({ featured: null })} className="hover:text-mustard">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(currentMinPrice || currentMaxPrice) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory text-charcoal rounded-xs border border-sand text-xs">
              <span>৳{currentMinPrice || "0"} – ৳{currentMaxPrice || "Max"}</span>
              <button onClick={() => updateFilters({ minPrice: null, maxPrice: null })} className="hover:text-mustard">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="ml-auto text-[11px] text-mustard hover:text-earth font-medium underline uppercase tracking-editorial"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout Grid (Desktop Sidebar + 3-Col Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-28 bg-ivory-light p-6 rounded-xs border border-sand/60 shadow-subtle">
          <div className="flex items-center justify-between pb-4 border-b border-sand/50">
            <h3 className="font-serif text-lg text-charcoal font-medium">Refine Selection</h3>
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-mustard hover:text-earth flex items-center gap-1 font-semibold uppercase tracking-wideDisplay"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Silhouettes */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wideDisplay text-earth font-bold mb-3">
              Silhouettes
            </h4>
            <div className="space-y-1.5 text-xs font-sans">
              <button
                onClick={() => updateFilters({ category: null })}
                className={`block w-full text-left py-1 px-2 rounded-xs transition-colors ${
                  !currentCategory
                    ? "bg-sand/40 font-bold text-charcoal"
                    : "text-charcoal-muted hover:text-charcoal hover:bg-sand/20"
                }`}
              >
                All Silhouettes
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => updateFilters({ category: c.slug })}
                  className={`block w-full text-left py-1 px-2 rounded-xs transition-colors ${
                    currentCategory === c.slug
                      ? "bg-sand/40 font-bold text-charcoal"
                      : "text-charcoal-muted hover:text-charcoal hover:bg-sand/20"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="pt-4 border-t border-sand/50">
            <h4 className="text-[11px] uppercase tracking-wideDisplay text-earth font-bold mb-2.5">
              Availability
            </h4>
            <label className="flex items-center gap-2.5 text-xs text-charcoal font-sans cursor-pointer py-1">
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={(e) =>
                  updateFilters({ inStock: e.target.checked ? "true" : null })
                }
                className="rounded-xs border-sand text-charcoal accent-charcoal w-3.5 h-3.5"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Featured Filter */}
          <div className="pt-4 border-t border-sand/50">
            <label className="flex items-center gap-2.5 text-xs text-charcoal font-sans cursor-pointer py-1">
              <input
                type="checkbox"
                checked={currentFeatured}
                onChange={(e) =>
                  updateFilters({ featured: e.target.checked ? "true" : null })
                }
                className="rounded-xs border-sand text-charcoal accent-charcoal w-3.5 h-3.5"
              />
              <span>Curated Featured Pieces</span>
            </label>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-sand/50">
            <h4 className="text-[11px] uppercase tracking-wideDisplay text-earth font-bold mb-3">
              Price Range (BDT)
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                placeholder="Min ৳"
                value={currentMinPrice}
                onChange={(e) => updateFilters({ minPrice: e.target.value })}
                className="w-full p-2 bg-ivory border border-sand/80 rounded-xs text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-charcoal text-xs"
              />
              <span className="text-charcoal-muted">—</span>
              <input
                type="number"
                placeholder="Max ৳"
                value={currentMaxPrice}
                onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                className="w-full p-2 bg-ivory border border-sand/80 rounded-xs text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-charcoal text-xs"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid Area (3 Columns on Desktop) */}
        <main className="lg:col-span-3">
          {initialProducts.length === 0 ? (
            <div className="py-20 text-center bg-ivory-light border border-sand/70 rounded-xs p-8 shadow-subtle">
              <PackageSearch className="w-12 h-12 text-earth mx-auto mb-3" />
              <h3 className="font-serif text-2xl text-charcoal mb-2">
                No artisan pieces match this criteria
              </h3>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto mb-6 leading-relaxed">
                Try loosening your filters or resetting your category and price selections.
              </p>
              <button
                onClick={handleResetFilters}
                className="py-2.5 px-6 bg-charcoal text-ivory text-xs uppercase tracking-wideDisplay rounded-xs hover:bg-mustard transition-colors font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 transition-opacity duration-200 ${
                isPending ? "opacity-60" : "opacity-100"
              }`}
            >
              {initialProducts.map((p) => (
                <ProductCard key={p.slug || p._id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-sand/60">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() =>
                      updateFilters({
                        page: pageNum === 1 ? null : String(pageNum),
                      })
                    }
                    className={`w-9 h-9 rounded-xs text-xs font-semibold font-mono transition-colors ${
                      currentPage === pageNum
                        ? "bg-charcoal text-ivory shadow-subtle"
                        : "border border-sand bg-ivory text-charcoal hover:border-mustard"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-ivory shadow-elevated p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sand">
                <h3 className="font-serif text-lg text-charcoal">Filter Catalog</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-charcoal hover:text-earth"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category options */}
              <div className="py-6 space-y-4">
                <h4 className="text-[11px] uppercase tracking-wideDisplay text-earth font-bold">
                  Silhouettes
                </h4>
                <div className="space-y-2 text-xs font-sans">
                  <button
                    onClick={() => {
                      updateFilters({ category: null });
                      setIsMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1.5 px-2 rounded-xs ${
                      !currentCategory ? "bg-sand font-bold text-charcoal" : "text-charcoal"
                    }`}
                  >
                    All Silhouettes
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        updateFilters({ category: c.slug });
                        setIsMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left py-1.5 px-2 rounded-xs ${
                        currentCategory === c.slug
                          ? "bg-sand font-bold text-charcoal"
                          : "text-charcoal"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-sand flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 text-center text-xs uppercase tracking-wideDisplay border border-charcoal text-charcoal rounded-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-center text-xs uppercase tracking-wideDisplay bg-charcoal text-ivory rounded-xs font-semibold hover:bg-mustard transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
