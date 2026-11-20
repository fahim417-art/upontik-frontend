"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { VideoModal } from "../layout/VideoModal";

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
    <section className="py-20 lg:py-28 bg-[#FAF6F0] border-b border-sand/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Magazine Framing Photography with Play Button (6 Cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-elevated border border-sand bg-sand/20 group">
              <Image
                src={image}
                alt="UPONTIK Artisan Handcrafting Process"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent pointer-events-none" />

              {/* Video Play Trigger on Image */}
              <button
                onClick={() => setIsVideoOpen(true)}
                className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform"
                aria-label="Play story video"
              >
                <div className="w-16 h-16 rounded-full bg-[#B87932]/90 hover:bg-[#B87932] text-white flex items-center justify-center shadow-luxury transition-all">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </button>

              <div className="absolute bottom-5 left-5 right-5 text-ivory">
                <span className="text-[10px] font-mono uppercase tracking-widest text-mustard block">
                  ATELIER WORKBENCH
                </span>
                <p className="font-serif text-lg text-ivory font-normal">
                  Turning mahogany handles & handloom jacquards
                </p>
              </div>
            </div>

            {/* Corner Decorative Accent */}
            <div className="hidden sm:block absolute -top-3 -left-3 w-24 h-24 border-t-2 border-l-2 border-[#B87932]/60 pointer-events-none" />
            <div className="hidden sm:block absolute -bottom-3 -right-3 w-24 h-24 border-b-2 border-r-2 border-[#B87932]/60 pointer-events-none" />
          </div>

          {/* Right Column: Editorial Narrative (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#B87932] rounded-full" />
              <span className="text-[11px] uppercase tracking-wideDisplay text-[#80644B] font-bold font-mono">
                {eyebrow}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#211D1A] font-normal leading-[1.12]">
              {title}
            </h2>

            <p className="font-serif text-lg sm:text-xl text-[#80644B] italic">
              &ldquo;{subtitle}&rdquo;
            </p>

            <div className="space-y-4 text-xs sm:text-sm font-sans text-charcoal/80 leading-relaxed">
              <p>{content}</p>

              {/* Editorial Pull Quote */}
              <div className="p-4 bg-ivory border-l-2 border-[#B87932] rounded-r-xs my-4 shadow-subtle">
                <p className="font-serif italic text-base sm:text-lg text-charcoal leading-snug">
                  &ldquo;A bag should not merely hold your essentials; it should carry the warmth, patience, and identity of the hands that formed it.&rdquo;
                </p>
                <span className="text-[10px] uppercase tracking-wideDisplay text-[#80644B] font-semibold block mt-2">
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
                className="py-3.5 px-8 bg-charcoal text-ivory text-xs uppercase tracking-wideDisplay font-medium rounded-full hover:bg-[#B87932] transition-colors flex items-center gap-2 shadow-elevated group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-mustard group-hover:text-ivory group-hover:translate-x-1 transition-all" />
              </Link>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="py-3.5 px-6 border border-sand bg-ivory text-[#211D1A] text-xs uppercase tracking-editorial font-medium rounded-full hover:border-charcoal flex items-center gap-2 transition-colors"
              >
                <Play className="w-3 h-3 fill-current text-[#B87932]" />
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
