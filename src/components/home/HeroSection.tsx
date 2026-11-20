"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowLeft, Play, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { VideoModal } from "../layout/VideoModal";
import { FloralCorner, FloralWatermark } from "../ui/FloralMotif";

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
    eyebrow: "ARTISAN BAGS • TIMELESS DESIGN",
    title: "Made By Us.\nLoved By You.",
    subtitle:
      "From our creative hands to your everyday style. Discover thoughtfully designed bags woven with care and modern grace.",
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

  const renderHeadline = (rawTitle: string) => {
    const lines = rawTitle.split("\n");
    if (lines.length > 1) {
      return (
        <>
          <span className="block">{lines[0]}</span>
          <span className="italic block font-normal text-[#E8D8C4] dark:text-[#EADBC8]">
            {lines.slice(1).join(" ")}
          </span>
        </>
      );
    }
    return rawTitle;
  };

  return (
    <section
      className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center bg-[#151210] dark:bg-[#0A0908] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Artisan Hero Showcase"
    >
      {/* Background Image Carousel with Smooth Cross-Fade */}
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
                  className="object-cover object-center lg:object-[center_right] transform scale-100 transition-transform duration-7000 ease-out"
                />
              </div>

              {/* Mobile Portrait Image */}
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

              {/* Directional Luxury Atmospheric Vignette Overlays */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#120F0D]/90 via-[#120F0D]/55 to-transparent sm:w-[62%] dark:from-[#080706]/95 dark:via-[#080706]/70" />
              <div className="block sm:hidden absolute inset-0 bg-gradient-to-b from-[#120F0D]/90 via-[#120F0D]/40 to-[#120F0D]/95 dark:from-[#080706]/95 dark:to-[#080706]/95" />
              <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
            </div>
          );
        })}
      </div>

      {/* Decorative Floral Watermark Filigree in Background */}
      <div className="absolute right-6 top-12 sm:top-16 z-[5] pointer-events-none opacity-20 dark:opacity-25 text-[#D49542] animate-pulse">
        <FloralWatermark className="w-56 h-56 sm:w-96 sm:h-96" />
      </div>

      {/* Main Content Composition */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
        <div className="max-w-xl text-left relative">
          
          {/* Subtle Ambient Card Frame */}
          <div className="relative bg-[#1A1613]/70 dark:bg-[#120F0C]/85 backdrop-blur-md p-6 sm:p-10 rounded-sm border border-[#D49542]/25 shadow-2xl">
            {/* Corner Floral Motifs */}
            <FloralCorner position="top-right" className="text-[#D49542]/60 w-10 h-10 -top-2 -right-2" />
            <FloralCorner position="bottom-left" className="text-[#D49542]/60 w-10 h-10 -bottom-2 -left-2" />

            {/* Eyebrow with fine accent gold line */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#E8D8C4] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D49542]" />
                {currentSlide.eyebrow || "ARTISAN BAGS • TIMELESS DESIGN"}
              </span>
              <span className="w-10 sm:w-16 h-[1.5px] bg-[#D49542]" />
            </div>

            {/* Cormorant Garamond Main Headline */}
            <h1 className="font-serif text-3.5xl sm:text-6xl lg:text-7xl text-[#FAF6F0] font-normal leading-[1.1] sm:leading-[1.06] tracking-tight mb-4 sm:mb-6 drop-shadow-sm">
              {renderHeadline(currentSlide.title)}
            </h1>

            {/* Editorial Description */}
            <p className="text-xs sm:text-base font-sans text-[#EAE2D7]/90 font-normal leading-relaxed max-w-lg mb-6 sm:mb-10 line-clamp-3 sm:line-clamp-none">
              {currentSlide.subtitle}
            </p>

            {/* Dual CTAs matching reference */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              {/* Primary Amber-Gold Button */}
              <Link
                href={currentSlide.ctaLink || "/shop"}
                className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#B87932] hover:bg-[#A36827] text-[#FAF6F0] text-xs sm:text-[13px] font-sans uppercase tracking-editorial font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{currentSlide.ctaText || "Explore Our Collection"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary Translucent Pill Button with Play Icon */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="group inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/35 text-[#FAF6F0] text-xs sm:text-[13px] font-sans uppercase tracking-editorial font-medium rounded-full transition-all hover:border-[#D49542]"
              >
                <Play className="w-3.5 h-3.5 fill-[#D49542] text-[#D49542] transition-transform group-hover:scale-110" />
                <span>{currentSlide.secondaryCtaText || "Watch Our Story"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left: Reference Pagination Counter `01 / 03  —  ←  →` */}
      <div className="absolute left-6 sm:left-12 bottom-6 sm:bottom-10 z-20 flex items-center gap-4 text-xs font-mono tracking-widest text-[#FAF6F0]/90 bg-[#1A1613]/80 dark:bg-[#100D0B]/80 backdrop-blur-md py-2 px-4 rounded-full border border-[#D49542]/30">
        <span className="text-sm font-serif font-bold text-[#D49542]">
          {`0${currentSlideIndex + 1}`}
        </span>
        <span className="text-[#FAF6F0]/40">/</span>
        <span className="text-xs text-[#FAF6F0]/60">
          {`0${activeSlides.length}`}
        </span>
        <span className="w-8 sm:w-12 h-[1px] bg-[#D49542]/60" />
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-white/15 text-[#FAF6F0]/80 hover:text-white transition-colors"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-white/15 text-[#FAF6F0]/80 hover:text-white transition-colors"
            aria-label="Next slide"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Side: Vertical Slide Indicators matching reference (desktop) */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4 bg-[#1A1613]/60 dark:bg-[#100D0B]/70 backdrop-blur-sm py-4 px-2 rounded-full border border-[#D49542]/20">
        <button
          onClick={handlePrev}
          className="p-1 text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition-colors"
          aria-label="Previous slide"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-2.5 text-xs font-mono">
          {activeSlides.map((slide: HeroSlide, idx: number) => {
            const isActive = idx === currentSlideIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`relative py-1 transition-all flex items-center gap-1.5 ${
                  isActive ? "text-[#D49542] font-bold" : "text-[#FAF6F0]/40 hover:text-[#FAF6F0]"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span className="text-[11px]">{`0${idx + 1}`}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeSlideIndicator"
                    className="w-2.5 h-[2px] bg-[#D49542]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-1 text-[#FAF6F0]/60 hover:text-[#FAF6F0] transition-colors"
          aria-label="Next slide"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Editorial Slide Countdown Progress Line (3s auto-advance) */}
      {!shouldReduceMotion && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 dark:bg-white/5 z-20 overflow-hidden">
          <motion.div
            key={currentSlide.id}
            initial={{ width: "0%" }}
            animate={{ width: isPaused ? "0%" : "100%" }}
            transition={{ duration: isPaused ? 0 : 3, ease: "linear" }}
            className="h-full bg-gradient-to-r from-[#B87932] to-[#E8B878]"
          />
        </div>
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={cms?.brandStory?.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
        title="UPONTIK Atelier — Crafting With Meaning"
      />
    </section>
  );
}
