"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface CampaignSectionProps {
  cms?: {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    image?: string;
    isActive?: boolean;
  };
}

export function CampaignSection({ cms }: CampaignSectionProps) {
  if (cms?.isActive === false) return null;

  const title = cms?.title || "The Heritage Edit";
  const subtitle = cms?.subtitle || "Artisan Autumn / Winter Series";
  const description =
    cms?.description ||
    "A master curation of cylindrical Dhol Bags, loomed saddle bags, and tactile clutches featuring hand-carved mahogany wood and earth-derived dye palettes.";
  const ctaText = cms?.ctaText || "Shop The Heritage Edit";
  const ctaLink = cms?.ctaLink || "/shop?collection=heritage-edit";
  const image =
    cms?.image ||
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1600";

  return (
    <section className="relative py-28 sm:py-36 bg-charcoal text-ivory overflow-hidden border-b border-charcoal-light">
      {/* Background Campaign Imagery with deep contrast */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover opacity-40 filter contrast-105 scale-100 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Campaign Narrative (Left 7 Cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcoal-light/70 backdrop-blur-md border border-charcoal-muted rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-mustard animate-pulse" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wideDisplay text-mustard font-semibold">
                {subtitle}
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory font-normal leading-[1.1] mb-6">
              {title}
            </h2>

            <p className="text-sm sm:text-base font-sans text-ivory/80 leading-relaxed mb-8 max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={ctaLink}
                className="py-3.5 px-8 bg-mustard text-charcoal text-xs uppercase tracking-wideDisplay font-bold rounded-xs hover:bg-mustard-light shadow-luxury transition-all flex items-center gap-2 group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop"
                className="py-3.5 px-6 border border-ivory/30 text-ivory text-xs uppercase tracking-wideDisplay font-medium rounded-xs hover:bg-ivory/10 hover:border-ivory transition-colors"
              >
                View Lookbook
              </Link>
            </div>
          </div>

          {/* Right Floating Campaign Callout Card (Right 5 Cols) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="p-6 bg-charcoal/80 backdrop-blur-md border border-charcoal-muted/60 rounded-xs shadow-elevated">
              <span className="text-[10px] font-mono uppercase tracking-widest text-mustard block mb-2">
                Studio Curated Palette
              </span>
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="h-10 rounded-xs bg-[#F3EBDD] border border-ivory/20 flex items-center justify-center text-[9px] font-mono text-charcoal font-bold">
                  Ivory
                </div>
                <div className="h-10 rounded-xs bg-[#B87932] border border-ivory/20 flex items-center justify-center text-[9px] font-mono text-ivory font-bold">
                  Ochre
                </div>
                <div className="h-10 rounded-xs bg-[#80644B] border border-ivory/20 flex items-center justify-center text-[9px] font-mono text-ivory font-bold">
                  Earth
                </div>
                <div className="h-10 rounded-xs bg-[#211D1A] border border-ivory/20 flex items-center justify-center text-[9px] font-mono text-ivory font-bold">
                  Charcoal
                </div>
              </div>
              <p className="text-xs font-sans text-ivory/70 leading-relaxed">
                Hand-dyed naturally using regional mineral and botanical pigments, honoring centuries of Bengali loom heritage.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
