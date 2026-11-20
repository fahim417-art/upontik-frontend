"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, Sparkles } from "lucide-react";

interface GiftCollectionSectionProps {
  cms?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    image?: string;
    isActive?: boolean;
  };
}

export function GiftCollectionSection({ cms }: GiftCollectionSectionProps) {
  if (cms?.isActive === false) return null;

  const eyebrow = cms?.eyebrow || "BESPOKE GIFTING";
  const title = cms?.title || "A Thoughtful Gift, Made Special.";
  const subtitle =
    cms?.subtitle || "Present the timeless beauty of handcrafted art to those you cherish.";
  const description =
    cms?.description ||
    "Every gift order is packaged in our signature cotton dust bag with an artisan certificate of authenticity and optional handwritten calligraphy note.";
  const ctaText = cms?.ctaText || "Explore Gift Collection";
  const ctaLink = cms?.ctaLink || "/shop?collection=gifts";
  const image =
    cms?.image ||
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=1200";

  return (
    <section className="py-20 lg:py-28 bg-[#F3EBDD] border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Content (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#B87932] uppercase">
              <Gift className="w-4 h-4 text-[#B87932]" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#211D1A] tracking-tight">
              {title}
            </h2>

            <p className="font-serif text-lg text-[#80644B] italic">
              &ldquo;{subtitle}&rdquo;
            </p>

            <p className="text-xs sm:text-sm font-sans text-charcoal/80 leading-relaxed">
              {description}
            </p>

            {/* Included Gift Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#FAF6F0] border border-sand/60 rounded-xs text-xs text-charcoal">
                <span className="font-bold block text-[#B87932] mb-0.5">✦ Signature Dust Bag</span>
                Unbleached natural cotton preservation pouch included with every piece.
              </div>
              <div className="p-3 bg-[#FAF6F0] border border-sand/60 rounded-xs text-xs text-charcoal">
                <span className="font-bold block text-[#B87932] mb-0.5">✦ Calligraphy Note</span>
                Personalized gift message inscribed on textured cotton paper.
              </div>
            </div>

            <div className="pt-4">
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#211D1A] hover:bg-[#38312B] text-ivory text-xs uppercase tracking-editorial font-medium rounded-full shadow-elevated transition-colors"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#B87932]" />
              </Link>
            </div>
          </div>

          {/* Right: Image (6 Cols) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-sand shadow-elevated bg-sand/20">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
