"use client";

import React from "react";

interface FloralProps {
  className?: string;
}

/**
 * Symmetrical Central Floral Divider for separating sections
 */
export function FloralDivider({ className = "" }: FloralProps) {
  return (
    <div className={`flex items-center justify-center my-6 sm:my-10 ${className}`}>
      <div className="flex-1 max-w-xs h-[1px] bg-gradient-to-r from-transparent via-[#B87932]/40 dark:via-[#D49542]/40 to-[#B87932]/60" />
      <div className="px-3 flex items-center gap-1.5 text-[#B87932] dark:text-[#D49542]">
        {/* Left leaf */}
        <svg className="w-4 h-4 transform -scale-x-100 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21C12 21 5 16 5 10C5 6 8 3 12 3C16 3 19 6 19 10C19 16 12 21 12 21Z" strokeLinecap="round"/>
          <path d="M12 3V17"/>
        </svg>
        {/* Central Blooming Lotus */}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C11 6 8 9 5 11C8 12 10 15 12 21C14 15 16 12 19 11C16 9 13 6 12 3Z" opacity="0.9" />
          <path d="M12 7C13 9 16 11 19 12C16 13 13 16 12 20C11 16 8 13 5 12C8 11 11 9 12 7Z" opacity="0.6" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
        {/* Right leaf */}
        <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21C12 21 5 16 5 10C5 6 8 3 12 3C16 3 19 6 19 10C19 16 12 21 12 21Z" strokeLinecap="round"/>
          <path d="M12 3V17"/>
        </svg>
      </div>
      <div className="flex-1 max-w-xs h-[1px] bg-gradient-to-l from-transparent via-[#B87932]/40 dark:via-[#D49542]/40 to-[#B87932]/60" />
    </div>
  );
}

/**
 * Botanical Floral Corner filigree ornament
 */
export function FloralCorner({ className = "", position = "top-right" }: FloralProps & { position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" }) {
  const transformMap = {
    "top-right": "",
    "top-left": "-scale-x-100",
    "bottom-right": "-scale-y-100",
    "bottom-left": "-scale-x-100 -scale-y-100",
  };

  return (
    <div className={`pointer-events-none select-none text-[#B87932]/35 dark:text-[#D49542]/40 ${transformMap[position]} ${className}`}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 4C45 4 32 12 24 24C16 36 8 49 4 60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
        {/* Blooming bud 1 */}
        <path d="M48 8C52 10 54 16 52 20C48 22 42 20 40 16C40 12 44 8 48 8Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2"/>
        {/* Petal 2 */}
        <path d="M32 20C36 22 38 27 36 30C33 32 28 30 26 27C26 24 29 20 32 20Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2"/>
        {/* Leaf flourish */}
        <path d="M20 36C22 38 25 43 23 46C20 48 16 45 15 42C15 39 18 36 20 36Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2"/>
        {/* Delicate Tendrils */}
        <path d="M50 16C56 18 60 24 58 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M34 28C38 32 40 38 36 42" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/**
 * Header Floral Ornament placed above eyebrow labels
 */
export function FloralHeaderOrnament({ className = "" }: FloralProps) {
  return (
    <div className={`flex items-center justify-center gap-2 mb-2.5 text-[#B87932] dark:text-[#D49542] ${className}`}>
      <svg className="w-5 h-2.5 opacity-70 transform -scale-x-100" viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 10C8 8 16 5 26 2" strokeLinecap="round" />
        <circle cx="10" cy="5" r="2" fill="currentColor" fillOpacity="0.5" />
      </svg>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C11 5 8 8 4 10C8 11 11 14 12 22C13 14 16 11 20 10C16 8 13 5 12 2Z" />
        <circle cx="12" cy="11" r="1.5" fill="white" />
      </svg>
      <svg className="w-5 h-2.5 opacity-70" viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 10C8 8 16 5 26 2" strokeLinecap="round" />
        <circle cx="10" cy="5" r="2" fill="currentColor" fillOpacity="0.5" />
      </svg>
    </div>
  );
}

/**
 * Botanical Embroidery Floral Watermark for section backdrops
 */
export function FloralWatermark({ className = "" }: FloralProps) {
  return (
    <div className={`pointer-events-none select-none absolute opacity-20 dark:opacity-15 text-[#B87932] dark:text-[#D49542] ${className}`}>
      <svg width="240" height="240" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Central stem */}
        <path d="M100 190C100 130 90 70 100 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
        
        {/* Flower 1 (Top Bloom) */}
        <g transform="translate(100, 30)">
          <path d="M0 -18C-8 -6 -16 6 -8 16C-2 20 6 20 12 14C18 6 12 -8 0 -18Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M0 -18C8 -6 16 6 8 16C2 20 -6 20 -12 14C-18 6 -12 -8 0 -18Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="0" cy="4" r="3" fill="currentColor"/>
        </g>
        
        {/* Leaves Left */}
        <path d="M98 70C75 60 55 75 52 95C65 98 85 90 98 70Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M98 120C75 110 50 125 48 150C62 152 82 142 98 120Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5"/>
        
        {/* Leaves Right */}
        <path d="M102 90C125 80 148 95 150 115C136 118 116 108 102 90Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M102 140C125 130 152 145 154 168C138 170 118 160 102 140Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

/**
 * Artisan Floral Badge Seal
 */
export function FloralBadge({ text = "Artisan Made", className = "" }: { text?: string; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans uppercase tracking-editorial font-bold bg-[#FAF6F0] dark:bg-[#1E1A16] border border-[#B87932]/40 dark:border-[#D49542]/50 text-[#80644B] dark:text-[#D49542] shadow-subtle ${className}`}>
      <svg className="w-3.5 h-3.5 text-[#B87932] dark:text-[#D49542] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C11 5 8 8 4 10C8 11 11 14 12 22C13 14 16 11 20 10C16 8 13 5 12 2Z" />
      </svg>
      <span>{text}</span>
    </div>
  );
}
