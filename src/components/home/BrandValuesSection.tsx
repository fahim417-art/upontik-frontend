"use client";

import React from "react";
import { Sparkles, Layers, ShieldCheck, HeartHandshake } from "lucide-react";

interface BrandValue {
  title: string;
  description: string;
  icon?: string;
}

interface BrandValuesSectionProps {
  values?: BrandValue[];
}

export function BrandValuesSection({ values }: BrandValuesSectionProps) {
  const defaultValues: BrandValue[] = [
    {
      title: "Thoughtful Craftsmanship",
      description:
        "Every stitch, turned wooden handle, and hand-knotted tassel is assembled by skilled artisan hands.",
      icon: "Sparkles",
    },
    {
      title: "Distinctive Silhouettes",
      description:
        "Unique architectural forms like our signature Dhol Bag celebrate cultural geometry and modern utility.",
      icon: "Layers",
    },
    {
      title: "Small-Batch Integrity",
      description:
        "Limited atelier production runs ensuring uncompromising attention to every individual woven thread.",
      icon: "ShieldCheck",
    },
    {
      title: "Patron Experience",
      description:
        "From personalized concierge support to luxurious archival cotton packaging with each delivery.",
      icon: "HeartHandshake",
    },
  ];

  const displayValues = values && values.length > 0 ? values : defaultValues;

  const renderIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Sparkles className="w-4 h-4 text-mustard" />;
      case 1:
        return <Layers className="w-4 h-4 text-mustard" />;
      case 2:
        return <ShieldCheck className="w-4 h-4 text-mustard" />;
      case 3:
      default:
        return <HeartHandshake className="w-4 h-4 text-mustard" />;
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-ivory border-b border-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Subheader */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[10px] uppercase tracking-wideDisplay text-earth font-bold block mb-2">
            The Atelier Commitment
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Rooted In Heritage. Built For Today.
          </h2>
        </div>

        {/* Editorial Line-Bordered Strip (Not generic cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-sand/70 border-y border-sand/70">
          {displayValues.map((val, idx) => (
            <div
              key={idx}
              className="py-8 sm:py-6 px-4 lg:px-8 flex flex-col justify-between group hover:bg-ivory-light transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-earth">
                  0{idx + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-sand/30 flex items-center justify-center group-hover:bg-mustard/20 transition-colors">
                  {renderIcon(idx)}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-normal mb-2 group-hover:text-mustard transition-colors">
                  {val.title}
                </h3>
                <p className="text-xs font-sans text-charcoal-muted leading-relaxed">
                  {val.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
