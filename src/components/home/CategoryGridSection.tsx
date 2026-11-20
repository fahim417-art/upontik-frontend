"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryItem {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface CategoryGridSectionProps {
  categories?: CategoryItem[];
}

const CATEGORY_META: Record<string, { order: string; feature: string }> = {
  "side-bag": { order: "01", feature: "Woven Crossbody Architecture" },
  "pouch-bag": { order: "02", feature: "Embroidered Tassel Clutches" },
  "dhol-bag": { order: "03", feature: "Turned Mahogany Wood Handles" },
  "phone-bag": { order: "04", feature: "Compact Slings with Card Partitions" },
  "tote-bag": { order: "05", feature: "Enduring Canvas & Jacquard Panels" },
};

export function CategoryGridSection({ categories }: CategoryGridSectionProps) {
  const cats =
    categories && categories.length > 0
      ? categories
      : [
          {
            name: "Side Bag",
            slug: "side-bag",
            description: "Crossbody silhouettes with woven front panels and adjustable leatherette strap.",
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800",
          },
          {
            name: "Pouch Bag",
            slug: "pouch-bag",
            description: "Artisanal tactile pouches with handmade silk-blend tassel accents.",
            image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=85&w=800",
          },
          {
            name: "Dhol Bag",
            slug: "dhol-bag",
            description: "Our signature cylindrical silhouette inspired by classic folk instruments, framed with hand-carved turned mahogany handles.",
            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=800",
          },
          {
            name: "Phone Bag",
            slug: "phone-bag",
            description: "Compact vertical crossbody slings engineered for effortless modern movement.",
            image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=85&w=800",
          },
          {
            name: "Tote Bag",
            slug: "tote-bag",
            description: "Substantial everyday carryalls blending durable natural canvas with heritage weaves.",
            image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=800",
          },
        ];

  const dholBag = cats.find((c) => c.slug === "dhol-bag") || cats[2];
  const otherCats = cats.filter((c) => c.slug !== "dhol-bag");

  return (
    <section className="py-20 lg:py-28 bg-ivory-light border-b border-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 pb-6 border-b border-sand/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-[#B87932] rounded-full" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#80644B] font-semibold">
                FIVE ARTISAN SILHOUETTES
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#211D1A] font-normal tracking-tight">
              Explore Our Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-sans text-[#80644B] max-w-md mt-4 md:mt-0 leading-relaxed">
            Find the bag that feels like you. Every category showcases generational loom mastery, distinctive textile patterns, and architectural handles shaped for everyday elegance.
          </p>
        </div>

        {/* Editorial Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Featured Hero Card: Signature Dhol Bag (Left 5 Columns) */}
          {dholBag && (
            <div className="lg:col-span-5 relative group overflow-hidden rounded-sm bg-sand/30 border border-sand shadow-luxury min-h-[500px] flex flex-col justify-between p-8">
              <Image
                src={dholBag.image}
                alt={dholBag.name}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent transition-opacity group-hover:opacity-95" />

              {/* Top Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-mustard text-charcoal text-[10px] font-bold uppercase tracking-wideDisplay rounded-xs shadow-subtle">
                  <Sparkles className="w-3 h-3 text-charcoal" />
                  Signature Silhouette
                </span>
                <span className="text-xs font-mono font-bold text-ivory/80 tracking-widest">
                  No. 03
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 text-ivory pt-16">
                <span className="text-[10px] font-mono uppercase tracking-widest text-mustard block mb-1">
                  Solid Turned Mahogany
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-ivory font-normal mb-3 leading-tight">
                  {dholBag.name}
                </h3>
                <p className="text-xs font-sans text-ivory/85 max-w-sm mb-6 leading-relaxed">
                  {dholBag.description}
                </p>
                <Link
                  href={`/category/${dholBag.slug}`}
                  className="inline-flex items-center gap-2 py-2.5 px-5 bg-ivory text-charcoal text-xs uppercase tracking-wideDisplay font-semibold rounded-xs hover:bg-mustard hover:text-ivory transition-all shadow-subtle group/btn"
                >
                  <span>Explore Signature Piece</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          )}

          {/* 4-Item Secondary Grid (Right 7 Columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherCats.map((cat) => {
              const meta = CATEGORY_META[cat.slug] || { order: "00", feature: "Artisan Textile" };
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group relative overflow-hidden rounded-sm bg-sand/20 border border-sand/60 shadow-subtle aspect-[4/5] flex flex-col justify-between p-6 hover:border-mustard/60 transition-all duration-300"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                    className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent transition-opacity group-hover:opacity-90" />

                  {/* Top Order Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-sand/90">
                      No. {meta.order}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-ivory/10 backdrop-blur-sm border border-ivory/20 flex items-center justify-center text-ivory group-hover:bg-mustard group-hover:text-charcoal transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  {/* Bottom Text */}
                  <div className="relative z-10 text-ivory">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-mustard block mb-1">
                      {meta.feature}
                    </span>
                    <h4 className="font-serif text-2xl text-ivory font-normal mb-1 group-hover:text-mustard transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] font-sans text-ivory/75 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
