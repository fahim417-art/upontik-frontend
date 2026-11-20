"use client";

import React from "react";
import Image from "next/image";
import { Instagram, ArrowUpRight } from "lucide-react";

interface GalleryItem {
  imageUrl: string;
  caption?: string;
  permalink?: string;
}

interface InstagramGalleryProps {
  items?: GalleryItem[];
}

export function InstagramGallerySection({ items }: InstagramGalleryProps) {
  const defaultItems: GalleryItem[] = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=600",
      caption: "The Ochre Dhol Bag in morning studio light.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=600",
      caption: "Urban styling with our loomed Side Crossbody.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=85&w=600",
      caption: "Tactile details: hand-knotted tassel accents.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=600",
      caption: "Timeless volume: The Heritage Canvas Tote.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=85&w=600",
      caption: "Compact simplicity for everyday movement.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=85&w=600",
      caption: "Turned mahogany meets hand-loomed jacquard.",
      permalink: "https://instagram.com/upontik",
    },
  ];

  const gallery = items && items.length > 0 ? items : defaultItems;

  return (
    <section className="py-20 lg:py-24 bg-ivory border-b border-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-5 border-b border-sand/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-mustard rounded-full" />
              <span className="text-[11px] uppercase tracking-wideDisplay text-earth font-bold">
                Studio Vignettes
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              A Little World of UPONTIK.
            </h2>
          </div>
          <a
            href="https://instagram.com/upontik"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wideDisplay font-bold text-earth hover:text-mustard transition-colors mt-4 sm:mt-0"
          >
            <Instagram className="w-4 h-4 text-mustard" />
            <span>@upontik on Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {gallery.slice(0, 6).map((item, idx) => (
            <a
              key={idx}
              href={item.permalink || "https://instagram.com/upontik"}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xs bg-sand/30 block border border-sand/60 shadow-subtle hover:border-mustard transition-all"
            >
              <Image
                src={item.imageUrl}
                alt={item.caption || "UPONTIK handcrafted bag"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-charcoal/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-left">
                <span className="text-right text-ivory">
                  <Instagram className="w-4 h-4 ml-auto" />
                </span>
                <p className="text-[10px] font-sans text-ivory leading-snug line-clamp-3">
                  {item.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
