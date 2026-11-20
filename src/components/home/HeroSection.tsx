"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, ChevronUp, ChevronDown } from "lucide-react";
import { VideoModal } from "../layout/VideoModal";

interface HeroSlide {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  desktopImage: string;
  mobileImage?: string;
  isActive?: boolean;
}

interface HeroSectionProps {
  slides?: HeroSlide[];
  cms?: any;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "slide_1",
    eyebrow: "ARTISAN BAGS • TIMELESS HERITAGE",
    title: "Made By Us.\nLoved By You.",
    subtitle:
      "From our creative hands to your everyday style. Discover handcrafted bags woven with traditional care and modern grace.",
    ctaText: "Explore Our Collection",
    ctaLink: "/shop",
    secondaryCtaText: "Watch Our Story",
    secondaryCtaLink: "/story",
    desktopImage: "/images/hero/hero-slide-red.jpg",
    mobileImage: "/images/hero/hero-slide-red.jpg",
    isActive: true,
  },
  {
    id: "slide_2",
    eyebrow: "CRAFTED WITH HERITAGE • MODERN LIVING",
    title: "Tradition Woven\nInto Modern Living.",
    subtitle:
      "Deep indigo tones paired with artisanal mustard textures. Thoughtfully shaped for contemporary elegance and meaningful presence.",
    ctaText: "Discover Handbags",
    ctaLink: "/category/side-bag",
    secondaryCtaText: "View Collections",
    secondaryCtaLink: "/shop",
    desktopImage: "/images/hero/hero-slide-blue.jpg",
    mobileImage: "/images/hero/hero-slide-blue.jpg",
    isActive: true,
  },
  {
    id: "slide_3",
    eyebrow: "ARCHITECTURAL WOOD • NATURAL JACQUARD",
    title: "Woven Elegance.\nNaturally Inspired.",
    subtitle:
      "Artisan Dhol Bags framed by hand-turned mahogany handles and golden cotton jacquard. Crafted with devotion for everyday luxury.",
    ctaText: "Signature Collection",
    ctaLink: "/category/dhol-bag",
    secondaryCtaText: "Our Craft Story",
    secondaryCtaLink: "/story",
    desktopImage: "/images/hero/hero-slide-yellow.jpg",
    mobileImage: "/images/hero/hero-slide-yellow.jpg",
    isActive: true,
  },
];

export function HeroSection({ slides, cms }: HeroSectionProps) {
  // Use passed slides or fallback to CMS slides or defaults
  const activeSlides: HeroSlide[] = (slides && slides.length > 0
    ? slides
    : cms?.heroSlides && cms.heroSlides.length > 0
    ? cms.heroSlides
    : DEFAULT_SLIDES
  ).filter((s: HeroSlide) => s.isActive !== false);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0] || DEFAULT_SLIDES[0];

  // Auto-advance slides every 3 seconds when not hovered (client requirement)
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSlides.length, isPaused]);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  // Helper to format headline with italicized second line if matching "Made By Us. Loved By You."
  const renderHeadline = (rawTitle: string) => {
    const lines = rawTitle.split("\n");
    if (lines.length > 1) {
      return (
        <>
          <span className="block">{lines[0]}</span>
          <span className="italic block font-normal">{lines.slice(1).join(" ")}</span>
        </>
      );
    }
    return rawTitle;
  };

  return (
    <section
      className="relative w-full min-h-[82vh] lg:min-h-[88vh] flex items-center bg-[#1A1614] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Artisan Hero Showcase"
    >
      {/* Background Image Carousel with Smooth Layered Cross-Fade */}
      <div className="absolute inset-0 z-0">
        {activeSlides.map((slide: HeroSlide, idx: number) => {
          const isCurrent = idx === currentSlideIndex;
          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Desktop Banner Image */}
              <div className="hidden sm:block absolute inset-0">
                <Image
                  src={slide.desktopImage}
                  alt={slide.title}
                  fill
                  priority={true}
                  sizes="100vw"
                  className="object-cover object-center lg:object-[center_right]"
                />
              </div>

              {/* Mobile Companion Portrait Image */}
              <div className="block sm:hidden absolute inset-0">
                <Image
                  src={slide.mobileImage || slide.desktopImage}
                  alt={slide.title}
                  fill
                  priority={true}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Subtle directional dark gradient on desktop for high contrast editorial text readability */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#1A1614]/85 via-[#1A1614]/45 to-transparent sm:w-[65%]" />
              {/* Vertical gradient on mobile so top and bottom copy stays crisp */}
              <div className="block sm:hidden absolute inset-0 bg-gradient-to-b from-[#1A1614]/85 via-[#1A1614]/35 to-[#1A1614]/90" />
              {/* Gentle overall ambient vignette */}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          );
        })}
      </div>

      {/* Main Content Composition */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-24">
        <div className="max-w-xl text-left bg-[#1A1614]/75 sm:bg-[#1A1614]/60 backdrop-blur-md p-6 sm:p-9 rounded-sm border border-[#D7C7AE]/20 shadow-luxury">
          {/* Eyebrow with fine accent line */}
          <div className="flex items-center gap-3 mb-3 sm:mb-6">
            <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#D7C7AE] font-semibold">
              {currentSlide.eyebrow || "ARTISAN BAGS • TIMELESS HERITAGE"}
            </span>
            <span className="w-8 sm:w-16 h-[1.5px] bg-[#B87932]" />
          </div>

          {/* Cormorant Garamond Main Headline */}
          <h1 className="font-serif text-3.5xl sm:text-6xl lg:text-7xl text-[#F3EBDD] font-normal leading-[1.1] sm:leading-[1.08] tracking-tight mb-4 sm:mb-6">
            {renderHeadline(currentSlide.title)}
          </h1>

          {/* Editorial Description */}
          <p className="text-xs sm:text-base font-sans text-[#F3EBDD]/85 font-normal leading-relaxed max-w-xl mb-6 sm:mb-10 line-clamp-3 sm:line-clamp-none">
            {currentSlide.subtitle}
          </p>

          {/* Dual CTAs matching reference */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            {/* Primary Mustard Button */}
            <Link
              href={currentSlide.ctaLink || "/shop"}
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#B87932] hover:bg-[#A36827] text-[#F3EBDD] text-xs sm:text-[13px] font-sans uppercase tracking-editorial font-medium rounded-full shadow-luxury transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{currentSlide.ctaText || "Explore Our Collection"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Secondary Translucent Outline Button with Play Icon */}
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="group inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-[#F3EBDD] text-xs sm:text-[13px] font-sans uppercase tracking-editorial font-medium rounded-full transition-all hover:border-white/50"
            >
              <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110 text-[#B87932]" />
              <span>{currentSlide.secondaryCtaText || "Watch Our Story"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Left: Mouse Scroll Indicator matching reference */}
      <div className="absolute left-6 sm:left-12 bottom-6 sm:bottom-10 z-20 hidden md:flex items-center gap-3 text-xs text-[#F3EBDD]/80 font-sans tracking-wide">
        <div className="w-5 h-8 rounded-full border border-[#F3EBDD]/60 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1 h-2 bg-[#B87932] rounded-full"
          />
        </div>
        <span className="text-[11px] uppercase tracking-wider text-[#F3EBDD]/70">
          Scroll to explore
        </span>
      </div>

      {/* Right Side: Vertical Slide Indicators matching reference (visible on tablet/desktop) */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4">
        {/* Up Chevron */}
        <button
          onClick={handlePrev}
          className="p-1 text-[#F3EBDD]/60 hover:text-[#F3EBDD] transition-colors"
          aria-label="Previous slide"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Numbered Slide Indicators */}
        <div className="flex flex-col items-center gap-3 text-xs font-mono">
          {activeSlides.map((slide: HeroSlide, idx: number) => {
            const isActive = idx === currentSlideIndex;
            const numberString = `0${idx + 1}`;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`relative py-1 transition-all flex items-center gap-2 ${
                  isActive ? "text-[#B87932] font-bold" : "text-[#F3EBDD]/50 hover:text-[#F3EBDD]"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span>{numberString}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeSlideIndicator"
                    className="w-3 h-[2px] bg-[#B87932]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Down Chevron */}
        <button
          onClick={handleNext}
          className="p-1 text-[#F3EBDD]/60 hover:text-[#F3EBDD] transition-colors"
          aria-label="Next slide"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Editorial Slide Countdown Progress Bar (3 seconds) */}
      {!shouldReduceMotion && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20 overflow-hidden">
          <motion.div
            key={currentSlide.id}
            initial={{ width: "0%" }}
            animate={{ width: isPaused ? "0%" : "100%" }}
            transition={{ duration: isPaused ? 0 : 3, ease: "linear" }}
            className="h-full bg-[#B87932]"
          />
        </div>
      )}

      {/* Story Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={cms?.brandStory?.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
        title="UPONTIK Atelier — Crafting With Meaning"
      />
    </section>
  );
}
