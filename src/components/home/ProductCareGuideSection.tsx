"use client";

import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CareGuideItem {
  material: string;
  title: string;
  tips: string[];
}

interface ProductCareGuideSectionProps {
  careGuides?: CareGuideItem[];
}

const DEFAULT_GUIDES: CareGuideItem[] = [
  {
    material: "Hand-Loomed Cotton",
    title: "Caring for Woven Cotton Textiles",
    tips: [
      "Spot clean immediately with a damp cotton cloth and mild cold water.",
      "Do not machine wash or tumble dry to preserve natural yarn tension.",
      "Store in the provided breathable dust bag in a dry, ventilated closet.",
    ],
  },
  {
    material: "Reclaimed Teak & Mahogany",
    title: "Preserving Hand-Turned Wooden Handles",
    tips: [
      "Keep wooden handles protected from prolonged rainfall or extreme heat.",
      "Gently buff with a drop of organic beeswax or coconut oil annually to nourish natural grain.",
      "Avoid synthetic chemical detergents or alcohol-based wipes on wooden grab handles.",
    ],
  },
  {
    material: "Brass Alloy Hardware",
    title: "Maintaining Lustrous Metallic Fittings",
    tips: [
      "Wipe zippers, rings, and buckle studs periodically with a dry microfiber cloth.",
      "Avoid spraying perfume, cosmetics, or harsh hand sanitizers directly onto metallic parts.",
    ],
  },
];

export function ProductCareGuideSection({ careGuides }: ProductCareGuideSectionProps) {
  const items = careGuides && careGuides.length > 0 ? careGuides : DEFAULT_GUIDES;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] border-b border-sand/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#B87932] font-semibold block mb-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B87932]" />
            HEIRLOOM PRESERVATION
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#211D1A] tracking-tight">
            Love Your Bag. Keep It Beautiful.
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#80644B] mt-2">
            Thoughtful care practices to ensure your handcrafted piece endures for years of meaningful carry.
          </p>
        </div>

        {/* Expandable Accordion List */}
        <div className="space-y-4">
          {items.map((guide, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-ivory border border-sand/80 rounded-sm overflow-hidden transition-all shadow-subtle"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#B87932] font-semibold">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-serif text-lg sm:text-xl text-[#211D1A] font-medium">
                        {guide.title}
                      </h4>
                      <span className="text-[11px] font-sans text-[#80644B]">
                        Material: {guide.material}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#80644B] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#B87932]" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-6 pt-2 border-t border-sand/40"
                    >
                      <ul className="space-y-2 text-xs sm:text-sm font-sans text-charcoal leading-relaxed list-disc list-inside">
                        {guide.tips.map((tip, tIdx) => (
                          <li key={tIdx} className="text-charcoal/90">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
