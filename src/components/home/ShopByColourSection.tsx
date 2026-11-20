"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface ColourTone {
  name: string;
  hex: string;
  borderClass: string;
  tagline: string;
  image: string;
  filterSlug: string;
}

const COLOURS: ColourTone[] = [
  {
    name: "Earthy Ochre & Saffron",
    hex: "#B87932",
    borderClass: "border-[#B87932]",
    tagline: "Warm vegetal dye tones evoking traditional clay hearths.",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=800",
    filterSlug: "ochre",
  },
  {
    name: "Onyx Charcoal & Black",
    hex: "#211D1A",
    borderClass: "border-[#211D1A]",
    tagline: "Timeless depth framed by natural dark cotton yarn.",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800",
    filterSlug: "black",
  },
  {
    name: "Nordic Sand & Raw Ecru",
    hex: "#D7C7AE",
    borderClass: "border-[#D7C7AE]",
    tagline: "Unbleached natural loomed cotton celebrating pure fiber texture.",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=800",
    filterSlug: "sand",
  },
  {
    name: "Indigo River Night",
    hex: "#2C3E50",
    borderClass: "border-[#2C3E50]",
    tagline: "Generational indigo dye traditions with subtle geometric borders.",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=85&w=800",
    filterSlug: "indigo",
  },
];

export function ShopByColourSection() {
  const [selectedColour, setSelectedColour] = useState(COLOURS[0]);

  return (
    <section className="py-20 lg:py-28 bg-[#F3EBDD] border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Interactive Colour Showcase (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#80644B] font-semibold block mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B87932]" />
                EARTH PALETTE
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#211D1A] tracking-tight">
                Find Your Colour
              </h2>
              <p className="text-xs sm:text-sm font-sans text-[#80644B] mt-2 leading-relaxed">
                Our pieces derive their personality from unbleached natural cotton fibers, botanical dyes, and hand-rubbed timber finishes.
              </p>
            </div>

            {/* Colour Swatches Selector */}
            <div className="space-y-3 pt-2">
              {COLOURS.map((col) => {
                const isSelected = selectedColour.name === col.name;
                return (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColour(col)}
                    className={`w-full p-4 rounded-sm border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#FAF6F0] border-[#B87932] shadow-sm"
                        : "bg-[#F3EBDD]/60 hover:bg-[#FAF6F0] border-sand/60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className="w-6 h-6 rounded-full border border-black/10 shadow-inner shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <div>
                        <h4 className="font-serif text-base text-[#211D1A] font-medium">
                          {col.name}
                        </h4>
                        <p className="text-[11px] text-[#80644B] font-sans mt-0.5">
                          {col.tagline}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 text-[#B87932] transition-transform ${
                        isSelected ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial font-bold text-[#211D1A] hover:text-[#B87932] transition-colors"
              >
                <span>Browse All Available Colourways</span>
                <ArrowRight className="w-4 h-4 text-[#B87932]" />
              </Link>
            </div>
          </div>

          {/* Right: Dynamic Image Preview (6 Cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] max-w-md mx-auto rounded-sm overflow-hidden border border-[#D7C7AE] shadow-elevated bg-sand/20">
              <Image
                key={selectedColour.name}
                src={selectedColour.image}
                alt={selectedColour.name}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-ivory">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B87932] block">
                  NATURAL FIBER TONE
                </span>
                <h4 className="font-serif text-2xl text-ivory mt-1">{selectedColour.name}</h4>
                <Link
                  href="/shop"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-editorial text-mustard font-bold hover:underline"
                >
                  <span>Explore this palette</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
