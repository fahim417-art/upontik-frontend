"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Search,
  LayoutGrid,
  Columns2,
  Flame,
} from "lucide-react";

interface ShopCatalogClientProps {
  initialProducts: any[];
  categories: any[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const ARTISAN_MATERIALS = [
  "Solid Turned Mahogany",
  "Cotton Jacquard",
  "Handloom Canvas",
  "Silk-Blend Tassel",
  "Natural Indigo Dye",
];

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
  const [viewMode, setViewMode] = useState<"grid" | "editorial">("grid");
  const [liveSearchQuery, setLiveSearchQuery] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

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
    setSelectedMaterial(null);
    setLiveSearchQuery("");
    startTransition(() => {
      router.push("/shop");
    });
    setIsMobileFilterOpen(false);
  };

  // Client-side live search and material filtering
  const displayedProducts = useMemo(() => {
    let list = initialProducts;
    if (liveSearchQuery.trim()) {
      const q = liveSearchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.categorySlug?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }
    if (selectedMaterial) {
      const m = selectedMaterial.toLowerCase();
      list = list.filter(
        (p) =>
          p.description?.toLowerCase().includes(m) ||
          p.shortDescription?.toLowerCase().includes(m) ||
          p.materials?.some((mat: string) => mat.toLowerCase().includes(m))
      );
    }
    return list;
  }, [initialProducts, liveSearchQuery, selectedMaterial]);

  // Autocomplete preview matches
  const autocompleteMatches = useMemo(() => {
    if (!liveSearchQuery.trim() || liveSearchQuery.length < 2) return [];
    const q = liveSearchQuery.toLowerCase();
    return initialProducts
      .filter((p) => p.name.toLowerCase().includes(q) || p.categorySlug?.includes(q))
      .slice(0, 4);
  }, [initialProducts, liveSearchQuery]);

  const isAnyFilterActive =
    !!currentCategory ||
    !!currentMinPrice ||
    !!currentMaxPrice ||
    currentInStock ||
    currentFeatured ||
    !!selectedMaterial ||
    !!liveSearchQuery;

  return (
    <div className="py-8 lg:py-12">
      {/* Editorial Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] font-sans text-charcoal-muted dark:text-[#A39789] uppercase tracking-wideDisplay mb-6">
        <Link href="/" className="hover:text-[#D49542] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-sand dark:text-[#383028]" />
        <Link href="/shop" className="hover:text-[#D49542] transition-colors">
          Catalog
        </Link>
        {currentCategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-sand dark:text-[#383028]" />
            <span className="text-[#D49542] font-semibold capitalize">
              {currentCategory.replace("-", " ")}
            </span>
          </>
        )}
      </nav>

      {/* Heading & Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-sand/60 dark:border-[#2C2620] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 bg-[#D49542] rounded-full" />
            <span className="text-[11px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold font-mono">
              Artisan Catalog
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal dark:text-[#F5EFE8] font-normal">
            {currentCategory ? (
              <span className="capitalize">{currentCategory.replace("-", " ")} Collection</span>
            ) : (
              "All Handcrafted Collections"
            )}
          </h1>
          <p className="text-xs sm:text-sm font-sans text-charcoal-muted dark:text-[#A39789] mt-2">
            Showing <span className="font-semibold text-charcoal dark:text-[#FAF6F0]">{displayedProducts.length}</span> curated artisan pieces woven in small studio batches
          </p>
        </div>

        {/* Live Search & Sort & View Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Search Bar with Instant Autocomplete */}
          <div className="relative">
            <div className="flex items-center bg-ivory dark:bg-[#171411] border border-sand/80 dark:border-[#2C2620] rounded-full px-3 py-1.5 shadow-sm">
              <Search className="w-3.5 h-3.5 text-[#80644B] dark:text-[#D49542] mr-2 shrink-0" />
              <input
                type="text"
                value={liveSearchQuery}
                onChange={(e) => setLiveSearchQuery(e.target.value)}
                placeholder="Live search bags..."
                className="w-28 xs:w-36 sm:w-48 bg-transparent text-xs text-[#211D1A] dark:text-[#F5EFE8] placeholder:text-charcoal-muted/60 dark:placeholder:text-[#A39789]/60 focus:outline-none"
              />
              {liveSearchQuery && (
                <button
                  onClick={() => setLiveSearchQuery("")}
                  className="text-charcoal-muted hover:text-[#D49542] ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown Preview */}
            {autocompleteMatches.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-[calc(100vw-2.5rem)] max-w-xs sm:w-72 bg-ivory dark:bg-[#171411] border border-[#D49542]/40 rounded-sm shadow-xl p-2 z-30 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#80644B] dark:text-[#D49542] font-mono block px-2 py-1">
                  Matching Pieces ({autocompleteMatches.length})
                </span>
                {autocompleteMatches.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/product/${m.slug}`}
                    className="flex items-center gap-2.5 p-2 rounded hover:bg-[#EAE0D0]/30 dark:hover:bg-[#1E1A16] transition-colors"
                  >
                    <div className="w-10 h-10 relative rounded overflow-hidden bg-sand/20 shrink-0">
                      <Image
                        src={m.images?.[0]?.url || m.images?.[0] || "/images/placeholder.jpg"}
                        alt={m.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-xs text-charcoal dark:text-[#F5EFE8] truncate">
                        {m.name}
                      </p>
                      <span className="font-mono text-[11px] font-bold text-[#D49542]">
                        {formatPrice(m.salePrice || m.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Grid / Editorial Magazine View Mode Switcher */}
          <div className="hidden sm:flex items-center bg-ivory dark:bg-[#171411] border border-sand/80 dark:border-[#2C2620] rounded-full p-1 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === "grid"
                  ? "bg-[#211D1A] dark:bg-[#D49542] text-white dark:text-[#0E0C0A]"
                  : "text-charcoal-muted dark:text-[#A39789] hover:text-charcoal"
              }`}
              title="Compact 3-Column Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("editorial")}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === "editorial"
                  ? "bg-[#211D1A] dark:bg-[#D49542] text-white dark:text-[#0E0C0A]"
                  : "text-charcoal-muted dark:text-[#A39789] hover:text-charcoal"
              }`}
              title="Editorial 2-Column Showcase"
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-sand dark:border-[#2C2620] bg-ivory dark:bg-[#171411] text-xs uppercase tracking-wideDisplay rounded-full font-medium text-charcoal dark:text-[#F5EFE8] shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D49542]" />
            <span>Filters</span>
            {isAnyFilterActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#D49542]" />
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-sans">
            <span className="text-charcoal-muted dark:text-[#A39789] uppercase tracking-wideDisplay hidden sm:inline text-[11px]">
              Sort:
            </span>
            <select
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-3.5 py-1.5 bg-ivory dark:bg-[#171411] border border-sand/80 dark:border-[#2C2620] rounded-full text-xs font-medium text-charcoal dark:text-[#F5EFE8] focus:outline-none focus:border-[#D49542] shadow-sm"
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
      <div className="overflow-x-auto scrollbar-none pb-4 mb-4 flex items-center gap-2 sm:gap-2.5">
        <button
          onClick={() => updateFilters({ category: null })}
          className={`px-4 py-1.5 text-xs uppercase tracking-wideDisplay rounded-full transition-all whitespace-nowrap ${
            !currentCategory
              ? "bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] font-bold shadow-sm"
              : "bg-ivory dark:bg-[#171411] border border-sand/60 dark:border-[#2C2620] text-charcoal-muted dark:text-[#A39789] hover:text-charcoal dark:hover:text-[#F5EFE8]"
          }`}
        >
          All Silhouettes ({total})
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => updateFilters({ category: c.slug })}
            className={`px-4 py-1.5 text-xs uppercase tracking-wideDisplay rounded-full transition-all whitespace-nowrap ${
              currentCategory === c.slug
                ? "bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] font-bold shadow-sm"
                : "bg-ivory dark:bg-[#171411] border border-sand/60 dark:border-[#2C2620] text-charcoal-muted dark:text-[#A39789] hover:text-charcoal dark:hover:text-[#F5EFE8]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Material & Feature Chips */}
      <div className="overflow-x-auto scrollbar-none pb-4 mb-8 flex items-center gap-2 text-xs">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#80644B] dark:text-[#D49542] font-semibold flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-[#D49542]" /> Materials:
        </span>
        {ARTISAN_MATERIALS.map((mat) => (
          <button
            key={mat}
            onClick={() => setSelectedMaterial(selectedMaterial === mat ? null : mat)}
            className={`px-3 py-1 rounded-full text-[11px] transition-all whitespace-nowrap border ${
              selectedMaterial === mat
                ? "bg-[#D49542] text-[#0E0C0A] font-bold border-[#D49542] shadow-sm"
                : "bg-sand/20 dark:bg-[#1E1A16] border-sand/50 dark:border-[#2C2620] text-[#80644B] dark:text-[#A39789] hover:border-[#D49542]"
            }`}
          >
            {mat}
          </button>
        ))}
      </div>

      {/* Active Filter Pills Indicator */}
      {isAnyFilterActive && (
        <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-sand/20 dark:bg-[#1E1A16] border border-sand/60 dark:border-[#2C2620] rounded-sm text-xs">
          <span className="text-charcoal-muted dark:text-[#A39789] uppercase tracking-wideDisplay text-[10px] font-bold">
            Active Filters:
          </span>
          {currentCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory dark:bg-[#171411] text-charcoal dark:text-[#F5EFE8] rounded-full border border-sand dark:border-[#2C2620] text-xs capitalize">
              <span>{currentCategory.replace("-", " ")}</span>
              <button onClick={() => updateFilters({ category: null })} className="hover:text-[#D49542]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedMaterial && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory dark:bg-[#171411] text-[#D49542] rounded-full border border-[#D49542]/40 text-xs">
              <span>{selectedMaterial}</span>
              <button onClick={() => setSelectedMaterial(null)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {liveSearchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory dark:bg-[#171411] text-charcoal dark:text-[#F5EFE8] rounded-full border border-sand dark:border-[#2C2620] text-xs">
              <span>Search: &ldquo;{liveSearchQuery}&rdquo;</span>
              <button onClick={() => setLiveSearchQuery("")} className="hover:text-[#D49542]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentInStock && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory dark:bg-[#171411] text-charcoal dark:text-[#F5EFE8] rounded-full border border-sand dark:border-[#2C2620] text-xs">
              <span>In Stock Only</span>
              <button onClick={() => updateFilters({ inStock: null })} className="hover:text-[#D49542]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentFeatured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory dark:bg-[#171411] text-charcoal dark:text-[#F5EFE8] rounded-full border border-sand dark:border-[#2C2620] text-xs">
              <span>Curated Featured</span>
              <button onClick={() => updateFilters({ featured: null })} className="hover:text-[#D49542]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(currentMinPrice || currentMaxPrice) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory dark:bg-[#171411] text-charcoal dark:text-[#F5EFE8] rounded-full border border-sand dark:border-[#2C2620] text-xs">
              <span>৳{currentMinPrice || "0"} – ৳{currentMaxPrice || "Max"}</span>
              <button onClick={() => updateFilters({ minPrice: null, maxPrice: null })} className="hover:text-[#D49542]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="ml-auto text-[11px] text-[#B87932] dark:text-[#D49542] hover:underline font-medium uppercase tracking-editorial"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout Grid (Desktop Sidebar + Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">

        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-28 bg-ivory dark:bg-[#171411] p-6 rounded-sm border border-sand/60 dark:border-[#2C2620] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-sand/50 dark:border-[#2C2620]">
            <h3 className="font-serif text-lg text-charcoal dark:text-[#F5EFE8] font-medium">Refine Selection</h3>
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#D49542] hover:underline flex items-center gap-1 font-semibold uppercase tracking-wideDisplay"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Silhouettes */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold font-mono mb-3">
              Silhouettes
            </h4>
            <div className="space-y-1.5 text-xs font-sans">
              <button
                onClick={() => updateFilters({ category: null })}
                className={`block w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                  !currentCategory
                    ? "bg-[#EAE0D0]/50 dark:bg-[#2A241F] font-bold text-charcoal dark:text-[#FAF6F0]"
                    : "text-charcoal-muted dark:text-[#A39789] hover:text-charcoal dark:hover:text-[#F5EFE8]"
                }`}
              >
                All Silhouettes
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => updateFilters({ category: c.slug })}
                  className={`block w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                    currentCategory === c.slug
                      ? "bg-[#EAE0D0]/50 dark:bg-[#2A241F] font-bold text-charcoal dark:text-[#FAF6F0]"
                      : "text-charcoal-muted dark:text-[#A39789] hover:text-charcoal dark:hover:text-[#F5EFE8]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="pt-4 border-t border-sand/50 dark:border-[#2C2620]">
            <h4 className="text-[11px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold font-mono mb-2.5">
              Availability
            </h4>
            <label className="flex items-center gap-2.5 text-xs text-charcoal dark:text-[#F5EFE8] font-sans cursor-pointer py-1">
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={(e) =>
                  updateFilters({ inStock: e.target.checked ? "true" : null })
                }
                className="rounded border-sand accent-[#D49542] w-3.5 h-3.5"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Featured Filter */}
          <div className="pt-4 border-t border-sand/50 dark:border-[#2C2620]">
            <label className="flex items-center gap-2.5 text-xs text-charcoal dark:text-[#F5EFE8] font-sans cursor-pointer py-1">
              <input
                type="checkbox"
                checked={currentFeatured}
                onChange={(e) =>
                  updateFilters({ featured: e.target.checked ? "true" : null })
                }
                className="rounded border-sand accent-[#D49542] w-3.5 h-3.5"
              />
              <span>Curated Featured Pieces</span>
            </label>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-sand/50 dark:border-[#2C2620]">
            <h4 className="text-[11px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold font-mono mb-3">
              Price Range (BDT)
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                placeholder="Min ৳"
                value={currentMinPrice}
                onChange={(e) => updateFilters({ minPrice: e.target.value })}
                className="w-full p-2 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded text-charcoal dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none text-xs font-mono"
              />
              <span className="text-charcoal-muted">—</span>
              <input
                type="number"
                placeholder="Max ৳"
                value={currentMaxPrice}
                onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                className="w-full p-2 bg-ivory dark:bg-[#1E1A16] border border-sand/80 dark:border-[#2C2620] rounded text-charcoal dark:text-[#F5EFE8] focus:border-[#D49542] focus:outline-none text-xs font-mono"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {displayedProducts.length === 0 ? (
            <div className="py-20 text-center bg-ivory dark:bg-[#171411] border border-sand/70 dark:border-[#2C2620] rounded-sm p-8 shadow-sm">
              <PackageSearch className="w-12 h-12 text-[#D49542] mx-auto mb-3" />
              <h3 className="font-serif text-2xl text-charcoal dark:text-[#F5EFE8] mb-2">
                No artisan pieces match this criteria
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-[#A39789] max-w-sm mx-auto mb-6 leading-relaxed">
                Try loosening your filters or resetting your category, search, and price selections.
              </p>
              <button
                onClick={handleResetFilters}
                className="py-2.5 px-6 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-wideDisplay rounded-full hover:bg-[#B87932] transition-colors font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-3 sm:gap-6 lg:gap-7 transition-opacity duration-200 ${
                viewMode === "editorial"
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-2 lg:grid-cols-3"
              } ${isPending ? "opacity-60" : "opacity-100"}`}
            >
              {displayedProducts.map((p) => (
                <div key={p.slug || p._id} className="relative group">
                  <ProductCard product={p} />
                  {/* Stock scarcity alert on catalog card */}
                  {p.stock !== undefined && p.stock > 0 && p.stock <= 3 && (
                    <div className="absolute bottom-14 sm:bottom-20 left-2 sm:left-6 z-10 pointer-events-none">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-[#1A1613]/90 text-[#D49542] text-[8px] sm:text-[10px] font-mono font-bold shadow-md border border-[#D49542]/40">
                        <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D49542] animate-pulse" />
                        Only {p.stock} left in studio
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-sand/60 dark:border-[#2C2620]">
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
                    className={`w-9 h-9 rounded-full text-xs font-semibold font-mono transition-colors ${
                      currentPage === pageNum
                        ? "bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] shadow-sm"
                        : "border border-sand dark:border-[#2C2620] bg-ivory dark:bg-[#171411] text-charcoal dark:text-[#F5EFE8] hover:border-[#D49542]"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-ivory dark:bg-[#171411] text-charcoal dark:text-[#F5EFE8] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sand dark:border-[#2C2620]">
                <h3 className="font-serif text-lg">Filter Catalog</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 hover:text-[#D49542]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category options */}
              <div className="py-6 space-y-4">
                <h4 className="text-[11px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold">
                  Silhouettes
                </h4>
                <div className="space-y-2 text-xs font-sans">
                  <button
                    onClick={() => {
                      updateFilters({ category: null });
                      setIsMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1.5 px-2.5 rounded ${
                      !currentCategory ? "bg-sand dark:bg-[#2A241F] font-bold" : ""
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
                      className={`block w-full text-left py-1.5 px-2.5 rounded ${
                        currentCategory === c.slug
                          ? "bg-sand dark:bg-[#2A241F] font-bold text-[#D49542]"
                          : ""
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-sand dark:border-[#2C2620] flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 text-center text-xs uppercase tracking-wideDisplay border border-sand dark:border-[#2C2620] rounded-full font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-center text-xs uppercase tracking-wideDisplay bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] rounded-full font-semibold hover:bg-[#B87932] transition-colors"
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
