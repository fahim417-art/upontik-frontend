"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { VideoModal } from "../layout/VideoModal";
import { FloralCorner, FloralHeaderOrnament } from "../ui/FloralMotif";

interface BrandStoryProps {
  cms?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    ctaText?: string;
    ctaLink?: string;
    image?: string;
    videoUrl?: string;
  };
}

export function BrandStorySection({ cms }: BrandStoryProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const eyebrow = cms?.eyebrow || "THE ARTISAN NARRATIVE";
  const title = cms?.title || "Behind Every Bag, There Is a Story.";
  const subtitle =
    cms?.subtitle || "Discover the thought, creativity, and care behind our collections.";
  const content =
    cms?.content ||
    "At UPONTIK, each piece is born from a deep dialogue between generational artisan heritage and contemporary silhouette design. Our textile bags weave intricate patterns, natural textures, and structural wooden elements into enduring fashion statements.";
  const ctaText = cms?.ctaText || "Learn Our Story";
  const ctaLink = cms?.ctaLink || "/story";
  const image =
    cms?.image ||
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1200";
  const videoUrl = cms?.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] dark:bg-[#120F0C] border-b border-[#E8DFC8]/60 dark:border-[#2C2620] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Magazine Framing Photography with Play Button (6 Cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl border border-[#D49542]/30 bg-[#1A1613] group">
              <Image
                src={image}
                alt="UPONTIK Artisan Handcrafting Process"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A]/70 via-transparent to-transparent pointer-events-none" />

              {/* Corner Floral Motifs */}
              <FloralCorner position="top-left" className="text-[#D49542]/60 w-12 h-12 top-2 left-2 z-10" />
              <FloralCorner position="bottom-right" className="text-[#D49542]/60 w-12 h-12 bottom-2 right-2 z-10" />

              {/* Video Play Trigger on Image */}
              <button
                onClick={() => setIsVideoOpen(true)}
                className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform z-20"
                aria-label="Play story video"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#B87932]/95 hover:bg-[#A36827] text-white flex items-center justify-center shadow-2xl transition-all border border-white/30">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </button>

              <div className="absolute bottom-5 left-5 right-5 text-[#FAF6F0] z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D49542] block">
                  ATELIER WORKBENCH • GAZIPUR
                </span>
                <p className="font-serif text-lg text-[#FAF6F0] font-normal">
                  Turning mahogany handles & handloom jacquards
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <FloralHeaderOrnament className="text-[#D49542]" />
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#B87932] dark:bg-[#D49542] rounded-full" />
              <span className="text-[11px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-bold font-mono">
                {eyebrow}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#211D1A] dark:text-[#F5EFE8] font-normal leading-[1.12]">
              {title}
            </h2>

            <p className="font-serif text-lg sm:text-xl text-[#80644B] dark:text-[#D49542] italic">
              &ldquo;{subtitle}&rdquo;
            </p>

            <div className="space-y-4 text-xs sm:text-sm font-sans text-charcoal/80 dark:text-[#F5EFE8]/80 leading-relaxed">
              <p>{content}</p>

              {/* Editorial Pull Quote */}
              <div className="p-5 bg-ivory dark:bg-[#1A1613] border-l-3 border-[#D49542] rounded-r-sm my-4 shadow-sm">
                <p className="font-serif italic text-base sm:text-lg text-charcoal dark:text-[#FAF6F0] leading-snug">
                  &ldquo;A bag should not merely hold your essentials; it should carry the warmth, patience, and identity of the hands that formed it.&rdquo;
                </p>
                <span className="text-[10px] uppercase tracking-wideDisplay text-[#80644B] dark:text-[#D49542] font-semibold block mt-2">
                  — UPONTIK Atelier Design Manifesto
                </span>
              </div>

              <p>
                From hand-turning solid reclaimed mahogany into cylindrical handles to meticulously securing brass alloy zip closures, every decision is purposeful.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={ctaLink}
                className="py-3.5 px-8 bg-[#211D1A] dark:bg-[#D49542] text-ivory dark:text-[#0E0C0A] text-xs uppercase tracking-wideDisplay font-medium rounded-full hover:bg-[#B87932] dark:hover:bg-[#E8B878] transition-colors flex items-center gap-2 shadow-md group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="py-3.5 px-6 border border-[#D7C7AE] dark:border-[#2C2620] bg-ivory dark:bg-[#1A1613] text-[#211D1A] dark:text-[#F5EFE8] text-xs uppercase tracking-editorial font-medium rounded-full hover:border-[#D49542] flex items-center gap-2 transition-colors"
              >
                <Play className="w-3 h-3 fill-current text-[#D49542]" />
                <span>Watch Studio Film</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={videoUrl}
        title="Inside UPONTIK — Behind Every Bag, There Is a Story"
      />
    </section>
  );
}
