"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FinalBrandCTAProps {
  cms?: {
    title?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    image?: string;
    isActive?: boolean;
  };
}

export function FinalBrandCTA({ cms }: FinalBrandCTAProps) {
  if (cms?.isActive === false) return null;

  const title = cms?.title || "Your Next Favourite Bag Is Waiting.";
  const description =
    cms?.description ||
    "Explore the UPONTIK collection and find a design that becomes part of your everyday story.";
  const ctaText = cms?.ctaText || "Explore the Collection";
  const ctaLink = cms?.ctaLink || "/shop";
  const image =
    cms?.image ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1600";

  return (
    <section className="relative py-24 sm:py-32 bg-[#1A1614] text-[#F3EBDD] overflow-hidden">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-[#1A1614]/80 to-[#1A1614]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B87932] font-semibold block"
        >
          TRADITION, WOVEN INTO MODERN LIVING
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F3EBDD] tracking-tight leading-tight"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-sm sm:text-base font-sans text-sand/80 max-w-xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="pt-4 flex flex-wrap justify-center gap-4"
        >
          <Link
            href={ctaLink}
            className="px-9 py-4 bg-[#B87932] hover:bg-[#A36827] text-white text-xs uppercase tracking-editorial font-medium rounded-full shadow-luxury inline-flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/story"
            className="px-7 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-[#F3EBDD] text-xs uppercase tracking-editorial font-medium rounded-full transition-colors"
          >
            Discover Atelier
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
