"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { SearchModal } from "./SearchModal";
import { CartDrawer } from "../cart/CartDrawer";

interface CategoryLink {
  name: string;
  slug: string;
  tag: string;
  description: string;
  image: string;
}

const DEFAULT_MEGA_CATEGORIES: CategoryLink[] = [
  {
    name: "Side Bag",
    slug: "side-bag",
    tag: "Everyday Carry",
    description: "Sculptural loomed crossbody silhouettes.",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=400",
  },
  {
    name: "Pouch Bag",
    slug: "pouch-bag",
    tag: "Artisan Detail",
    description: "Embroidered clutches with handmade tassels.",
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=85&w=400",
  },
  {
    name: "Dhol Bag",
    slug: "dhol-bag",
    tag: "Signature Piece",
    description: "Cylindrical form with turned mahogany handles.",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=400",
  },
  {
    name: "Phone Bag",
    slug: "phone-bag",
    tag: "Urban Mobility",
    description: "Compact vertical woven slings for essentials.",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=85&w=400",
  },
  {
    name: "Tote Bag",
    slug: "tote-bag",
    tag: "Generous Volume",
    description: "Enduring canvas carryalls with heritage woven panels.",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=400",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const {
    cartCount,
    wishlistCount,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    user,
    theme,
    toggleTheme,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsShopMenuOpen(false);
    setIsCollectionsOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
          ? "bg-[#211D1A]/95 backdrop-blur-md text-[#F3EBDD] shadow-luxury border-b border-sand/20 py-3.5"
          : "bg-[#211D1A] text-[#F3EBDD] border-b border-sand/15 py-4 sm:py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo Wordmark with Artisan Floral Lotus */}
            <div className="flex items-center gap-6">
              <Link href="/" className="inline-flex items-center gap-2 sm:gap-2.5 group focus:outline-none">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#B87932] group-hover:text-mustard transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C11 5 8 8 4 10C8 11 11 14 12 22C13 14 16 11 20 10C16 8 13 5 12 2Z" />
                  <circle cx="12" cy="11" r="1.5" fill="#FAF6F0" />
                </svg>
                <span className="font-serif text-2xl sm:text-3xl lg:text-[2rem] tracking-[0.18em] text-[#F3EBDD] font-normal group-hover:text-mustard transition-colors">
                  UPONTIK
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links (matching reference image) */}
            <nav className="hidden lg:flex items-center gap-7 text-[13px] font-sans font-medium text-[#F3EBDD]/90">
              {/* Home */}
              <Link
                href="/"
                className={`transition-colors relative py-1 hover:text-mustard ${pathname === "/" ? "text-[#F3EBDD] font-semibold" : "text-[#F3EBDD]/80"
                  }`}
              >
                Home
                {pathname === "/" && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-mustard rounded-full" />
                )}
              </Link>

              {/* Shop + Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsShopMenuOpen(true)}
                onMouseLeave={() => setIsShopMenuOpen(false)}
              >
                <Link
                  href="/shop"
                  className={`flex items-center gap-1 transition-colors relative py-1 hover:text-mustard ${pathname.startsWith("/shop") || pathname.startsWith("/category")
                    ? "text-[#F3EBDD] font-semibold"
                    : "text-[#F3EBDD]/80"
                    }`}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isShopMenuOpen ? "rotate-180 text-mustard" : "text-[#F3EBDD]/60"
                      }`}
                  />
                  {(pathname.startsWith("/shop") || pathname.startsWith("/category")) && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-mustard rounded-full" />
                  )}
                </Link>

                {/* Shop Mega Menu */}
                <AnimatePresence>
                  {isShopMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[880px] z-50 pointer-events-auto"
                    >
                      <div className="bg-[#1C1816] border border-sand/30 shadow-elevated rounded-sm p-6 grid grid-cols-5 gap-3.5 text-left text-ivory">
                        {DEFAULT_MEGA_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            className="group flex flex-col p-2 rounded hover:bg-[#28221E] transition-all border border-transparent hover:border-sand/40"
                          >
                            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xs mb-3 bg-sand/20">
                              <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                sizes="180px"
                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              />
                              <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider bg-charcoal/80 backdrop-blur-sm text-ivory px-2 py-0.5 rounded-xs font-mono font-medium">
                                {cat.tag}
                              </span>
                            </div>
                            <h4 className="font-serif text-base text-ivory font-medium group-hover:text-mustard transition-colors flex items-center justify-between">
                              <span>{cat.name}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-mustard" />
                            </h4>
                            <p className="text-[11px] font-sans text-sand/70 line-clamp-2 mt-1 leading-snug">
                              {cat.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Our Story */}
              <Link
                href="/story"
                className={`transition-colors relative py-1 hover:text-mustard ${pathname === "/story" ? "text-[#F3EBDD] font-semibold" : "text-[#F3EBDD]/80"
                  }`}
              >
                Our Story
                {pathname === "/story" && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-mustard rounded-full" />
                )}
              </Link>

              {/* Collections + Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCollectionsOpen(true)}
                onMouseLeave={() => setIsCollectionsOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 transition-colors relative py-1 hover:text-mustard text-[#F3EBDD]/80"
                >
                  <span>Collections</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollectionsOpen ? "rotate-180 text-mustard" : "text-[#F3EBDD]/60"
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {isCollectionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full pt-2 w-56 z-50 pointer-events-auto"
                    >
                      <div className="bg-[#1C1816] border border-sand/30 shadow-elevated rounded-sm p-3 space-y-1 text-left text-xs">
                        <Link
                          href="/category/dhol-bag"
                          className="block px-3 py-2 rounded text-ivory/90 hover:text-mustard hover:bg-[#28221E] transition-colors"
                        >
                          Signature Dhol Collection
                        </Link>
                        <Link
                          href="/shop?collection=heritage-edit"
                          className="block px-3 py-2 rounded text-ivory/90 hover:text-mustard hover:bg-[#28221E] transition-colors"
                        >
                          The Heritage Edit (Autumn/Winter)
                        </Link>
                        <Link
                          href="/shop?collection=essentials"
                          className="block px-3 py-2 rounded text-ivory/90 hover:text-mustard hover:bg-[#28221E] transition-colors"
                        >
                          Everyday Essentials
                        </Link>
                        <Link
                          href="/shop?collection=gifts"
                          className="block px-3 py-2 rounded text-ivory/90 hover:text-mustard hover:bg-[#28221E] transition-colors"
                        >
                          Thoughtful Gifts & Parcels
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Blog */}
              <Link
                href="/story"
                className={`transition-colors relative py-1 hover:text-mustard ${pathname === "/blog" ? "text-[#F3EBDD] font-semibold" : "text-[#F3EBDD]/80"
                  }`}
              >
                Blog
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`transition-colors relative py-1 hover:text-mustard ${pathname === "/contact" ? "text-[#F3EBDD] font-semibold" : "text-[#F3EBDD]/80"
                  }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right: Action Icons (Day/Night, Search, Wishlist, Cart, Account) */}
            <div className="flex items-center gap-1 sm:gap-2.5">
              {/* Day / Night Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 text-[#F3EBDD]/90 hover:text-mustard focus:outline-none transition-all rounded-full hover:bg-white/10"
                aria-label={theme === "dark" ? "Switch to Day Mode" : "Switch to Night Mode"}
                title={theme === "dark" ? "Switch to Day Mode • দিনের মোড" : "Switch to Night Mode • রাতের মোড"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5A855] transition-transform rotate-0 hover:rotate-90 duration-300" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform hover:-rotate-12 duration-300" />
                )}
              </button>

              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-[#F3EBDD]/90 hover:text-mustard p-1.5 focus:outline-none transition-colors"
                aria-label="Open search dialog"
              >
                <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist Icon with Jewelry Badge */}
              <Link
                href="/account/wishlist"
                className="relative text-[#F3EBDD]/90 hover:text-mustard p-1.5 focus:outline-none transition-colors"
                aria-label={`Saved pieces (${wishlistCount})`}
              >
                <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-mustard text-charcoal text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Icon with Cart Badge */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative text-[#F3EBDD]/90 hover:text-mustard p-1.5 focus:outline-none transition-colors"
                aria-label={`Shopping bag (${cartCount})`}
              >
                <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-mustard text-charcoal text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Customer Account / Sign In Icon (hidden on small mobile to prevent header squish) */}
              <Link
                href={user ? (user.role === "admin" ? "/admin" : "/account") : "/auth/login"}
                className="hidden sm:inline-flex text-[#F3EBDD]/90 hover:text-mustard p-1.5 focus:outline-none transition-colors"
                aria-label={user ? `Signed in as ${user.name}` : "Sign in to account"}
              >
                <UserIcon className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-[#F3EBDD] hover:text-mustard p-1.5 lg:hidden focus:outline-none transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-charcoal/70 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#1C1816] text-ivory z-50 lg:hidden p-6 flex flex-col justify-between overflow-y-auto"
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-sand/20 mb-6">
                    <span className="font-serif text-2xl tracking-[0.18em] text-ivory">
                      UPONTIK
                    </span>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1.5 text-sand hover:text-ivory"
                      aria-label="Close navigation"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <nav className="space-y-3.5 text-sm font-sans">
                    {/* Quick Search Bar in Mobile Menu */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSearchOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#28221E] border border-sand/20 rounded text-xs text-sand/80 hover:text-mustard transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-mustard" />
                        <span>Search collection...</span>
                      </span>
                      <span className="text-[10px] uppercase font-mono text-sand/50">Explore</span>
                    </button>

                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-ivory hover:text-mustard font-medium border-b border-sand/10"
                    >
                      Home
                    </Link>
                    <Link
                      href="/shop"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-ivory hover:text-mustard font-medium border-b border-sand/10"
                    >
                      Shop All Bags
                    </Link>

                    {/* 5 Categories Links */}
                    <div className="pl-3 py-1 space-y-2 border-l border-mustard/40 my-2">
                      <span className="text-[10px] uppercase tracking-wider text-sand/60 font-mono">
                        Categories
                      </span>
                      {DEFAULT_MEGA_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs text-ivory/80 hover:text-mustard py-1"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>

                    <Link
                      href="/account/wishlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 text-ivory hover:text-mustard font-medium border-b border-sand/10"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-mustard" />
                        <span>Saved Pieces (Wishlist)</span>
                      </span>
                      {wishlistCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-mustard text-charcoal text-[10px] font-bold">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/cart"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 text-ivory hover:text-mustard font-medium border-b border-sand/10"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-mustard" />
                        <span>Shopping Bag</span>
                      </span>
                      {cartCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-mustard text-charcoal text-[10px] font-bold">
                          {cartCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/story"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-ivory hover:text-mustard font-medium border-b border-sand/10"
                    >
                      Our Story
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-ivory hover:text-mustard font-medium border-b border-sand/10"
                    >
                      Contact
                    </Link>
                    {/* Mobile Day/Night Mode Switch */}
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between py-2.5 text-ivory/90 hover:text-mustard font-medium border-b border-sand/10 text-xs uppercase tracking-editorial"
                    >
                      <span>Theme Mode: {theme === "dark" ? "Night (রাত)" : "Day (দিন)"}</span>
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4 text-[#E5A855]" />
                      ) : (
                        <Moon className="w-4 h-4 text-mustard" />
                      )}
                    </button>

                    <Link
                      href={user ? (user.role === "admin" ? "/admin" : "/account") : "/auth/login"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-mustard hover:text-mustard-light font-medium"
                    >
                      {user ? (user.role === "admin" ? "Admin Console" : "Patron Account") : "Sign In to Atelier"}
                    </Link>
                  </nav>
                </div>

                <div className="pt-6 border-t border-sand/20 text-xs text-sand/60">
                  <p className="font-serif text-ivory text-sm">UPONTIK Studio Atelier</p>
                  <p className="mt-1">Handcrafted Bags & Textile Accessories</p>
                  <p className="mt-1 text-mustard">care@upontik.com</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Global Interactive Modals */}
      <SearchModal />
      <CartDrawer />
    </>
  );
}
