"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { FloralCorner, FloralDivider } from "../ui/FloralMotif";

interface SignatureCollectionProps {
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

export function SignatureCollectionSection({ cms }: SignatureCollectionProps) {
  if (cms?.isActive === false) return null;

  const eyebrow = cms?.eyebrow || "HERITAGE ARCHITECTURE";
  const title = cms?.title || "The UPONTIK Signature Collection";
  const subtitle = cms?.subtitle || "Sculptural silhouettes carved from solid teak and woven on heritage looms.";
  const description =
    cms?.description ||
    "Our signature Dhol Bag embodies acoustic symmetry and generational woodwork, paired with rich loomed cotton weave.";
  const ctaText = cms?.ctaText || "Discover Signature Pieces";
  const ctaLink = cms?.ctaLink || "/category/dhol-bag";
  const image =
    cms?.image ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1400";

  return (
    <section className="py-20 lg:py-28 bg-[#14110E] dark:bg-[#0A0908] text-[#FAF6F0] overflow-hidden relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left: Editorial Image Block (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-sm overflow-hidden border border-[#D49542]/30 shadow-2xl">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Corner Floral Motifs */}
              <FloralCorner position="top-left" className="text-[#D49542]/60 w-12 h-12 top-2 left-2 z-10" />
              <FloralCorner position="bottom-right" className="text-[#D49542]/60 w-12 h-12 bottom-2 right-2 z-10" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D49542] block">
                    HAND-TURNED MAHOGANY
                  </span>
                  <p className="font-serif text-lg text-[#FAF6F0]">The Acoustic Cylindrical Silhouette</p>
                </div>
              </div>
            </div>

            {/* Accent Floating Badge with Floral Accent */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#1E1A16] border border-[#D49542]/40 p-5 rounded-sm shadow-2xl max-w-xs text-xs font-sans text-[#EAE2D7]">
              <span className="text-[#D49542] font-serif text-sm block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Generational Heritage
              </span>
              Hand-carved by master wood artisans in small studio batches with bespoke brass fixtures.
            </div>
          </motion.div>

          {/* Right: Narrative & CTAs (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D49542] uppercase">
              <Sparkles className="w-4 h-4 text-[#D49542]" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#FAF6F0] leading-tight">
              {title}
            </h2>

            <p className="font-serif text-lg text-[#D49542] italic">
              &ldquo;{subtitle}&rdquo;
            </p>

            <p className="text-xs sm:text-sm font-sans text-[#FAF6F0]/75 leading-relaxed">
              {description}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href={ctaLink}
                className="px-8 py-4 bg-[#B87932] hover:bg-[#A36827] text-white text-xs uppercase tracking-editorial rounded-full font-medium inline-flex items-center justify-center gap-2.5 shadow-lg transition-all transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/story"
                className="text-xs uppercase tracking-editorial text-[#D49542] hover:text-white transition-colors underline underline-offset-4 py-2 text-center"
              >
                Learn How It&apos;s Crafted
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
