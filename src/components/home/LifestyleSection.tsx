"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface LifestyleItem {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface LifestyleSectionProps {
  collections?: LifestyleItem[];
}

const DEFAULT_LIFESTYLE: LifestyleItem[] = [
  {
    title: "Everyday Essentials",
    description: "Lightweight, tactile silhouettes crafted for effortless daily movement.",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800",
    link: "/shop?collection=essentials",
  },
  {
    title: "Work & Study",
    description: "Spacious jacquard totes with reinforced double straps and book partitions.",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=800",
    link: "/shop?category=tote-bag",
  },
  {
    title: "Casual Outings",
    description: "Hands-free loomed crossbody silhouettes for weekend cafes and markets.",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=85&w=800",
    link: "/shop?category=side-bag",
  },
  {
    title: "Special Occasions",
    description: "Intricately embroidered evening pouches with handmade tassel closures.",
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=85&w=800",
    link: "/shop?category=pouch-bag",
  },
];

export function LifestyleSection({ collections }: LifestyleSectionProps) {
  const items = collections && collections.length > 0 ? collections : DEFAULT_LIFESTYLE;

  return (
    <section className="py-20 lg:py-28 bg-[#1C1816] text-[#F3EBDD] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#B87932] font-semibold block mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B87932]" />
            CURATED MOMENTS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F3EBDD] tracking-tight">
            Made for Your Everyday Moments
          </h2>
          <p className="text-xs sm:text-sm font-sans text-sand/80 mt-3 leading-relaxed">
            From the bustling commute to candlelit evening celebrations, find the companion woven for your story.
          </p>
        </div>

        {/* 4-Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="group relative aspect-[3/4] rounded-sm overflow-hidden border border-sand/20 shadow-elevated flex flex-col justify-end p-6"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B87932] block">
                  EDITION 0{idx + 1}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-ivory font-medium group-hover:text-mustard transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-sans text-sand/80 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs uppercase tracking-editorial text-mustard font-semibold group-hover:text-white transition-colors">
                  <span>Explore Series</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
