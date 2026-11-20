"use client";

import React from "react";
import { motion } from "framer-motion";

interface BrandBenefit {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
}

interface BrandBenefitsStripProps {
  benefits?: BrandBenefit[];
}

const DEFAULT_BENEFITS: BrandBenefit[] = [
  {
    id: "b1",
    title: "Handcrafted with Care",
    description: "Each piece shaped by skilled artisan hands",
    icon: "hand",
  },
  {
    id: "b2",
    title: "Distinctive Designs",
    description: "Architectural shapes and cultural geometry",
    icon: "diamond",
  },
  {
    id: "b3",
    title: "Sustainable Choice",
    description: "Natural loomed cotton & reclaimed woods",
    icon: "leaf",
  },
  {
    id: "b4",
    title: "Dedicated Support",
    description: "Direct studio concierge across all 64 districts",
    icon: "headphones",
  },
];

export function BrandBenefitsStrip({ benefits }: BrandBenefitsStripProps) {
  const items = benefits && benefits.length > 0 ? benefits : DEFAULT_BENEFITS;

  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "hand":
      case "handcrafted with care":
        return (
          <svg className="w-5 h-5 text-[#80644B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
          </svg>
        );
      case "diamond":
      case "distinctive designs":
        return (
          <svg className="w-5 h-5 text-[#80644B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 12L2 9z"/>
            <path d="M11 3 8 9l4 12 4-12-3-6"/>
            <path d="M2 9h20"/>
          </svg>
        );
      case "leaf":
      case "sustainable choice":
        return (
          <svg className="w-5 h-5 text-[#80644B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        );
      case "headphones":
      case "dedicated support":
      default:
        return (
          <svg className="w-5 h-5 text-[#80644B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
          </svg>
        );
    }
  };

  return (
    <div className="w-full bg-[#F3EBDD] border-b border-[#D7C7AE]/60 py-6 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#D7C7AE]/80">
          {items.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex items-center justify-center gap-3.5 py-3 sm:py-2 px-3 text-center sm:text-left group cursor-default"
            >
              <div className="p-2 rounded-full bg-[#EAE0D0] group-hover:bg-[#E3D6C1] transition-colors shrink-0">
                {renderIcon(item.icon || item.title)}
              </div>
              <div className="text-left">
                <h4 className="font-serif text-sm sm:text-base text-[#211D1A] font-medium tracking-tight">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-[11px] font-sans text-[#80644B] leading-tight mt-0.5 hidden sm:block">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
