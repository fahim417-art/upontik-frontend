"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface TeamStorySectionProps {
  cms?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    image?: string;
    isActive?: boolean;
  };
}

export function TeamStorySection({ cms }: TeamStorySectionProps) {
  if (cms?.isActive === false) return null;

  const eyebrow = cms?.eyebrow || "THE ATELIER";
  const title = cms?.title || "Meet the People Behind the Brand.";
  const subtitle =
    cms?.subtitle || "Generational weavers, wood carvers, and modern textile designers.";
  const content =
    cms?.content ||
    "UPONTIK brings together master craftspeople who have spent decades perfecting the art of loom weaving and wood turning with contemporary accessories designers who understand modern daily needs.";
  const image =
    cms?.image ||
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=85&w=1200";

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Image (5 Cols) */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-[#D7C7AE] shadow-elevated bg-sand/20">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-ivory">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B87932] block">
                  CRAFTSMANSHIP CIRCLE
                </span>
                <p className="font-serif text-lg text-ivory">Banani Studio Atelier, Dhaka</p>
              </div>
            </div>
          </div>

          {/* Right: Narrative (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#B87932] uppercase">
              <Sparkles className="w-4 h-4 text-[#B87932]" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#211D1A] tracking-tight">
              {title}
            </h2>

            <p className="font-serif text-xl text-[#80644B] italic">
              &ldquo;{subtitle}&rdquo;
            </p>

            <p className="text-sm font-sans text-charcoal/80 leading-relaxed">
              {content}
            </p>

            <p className="text-sm font-sans text-charcoal/80 leading-relaxed">
              By working directly with master artisans rather than industrial mass-production mills, UPONTIK honors the human element in every seam, handle, and stitch.
            </p>

            <div className="pt-2">
              <Link
                href="/story"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial font-bold text-[#211D1A] hover:text-[#B87932] transition-colors"
              >
                <span>Read the Complete Atelier Story</span>
                <ArrowRight className="w-4 h-4 text-[#B87932]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
