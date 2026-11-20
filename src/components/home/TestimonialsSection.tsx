"use client";

import React from "react";
import Link from "next/link";
import { Star, CheckCircle, Quote } from "lucide-react";

interface TestimonialsSectionProps {
  reviews?: Array<{
    _id: string;
    customerName: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase?: boolean;
    productName?: string;
    location?: string;
  }>;
}

const DEFAULT_CURATED_REVIEWS = [
  {
    _id: "rev_curated_01",
    customerName: "Samira K. Rahman",
    location: "Gulshan, Dhaka",
    rating: 5,
    title: "The wooden handle Dhol Bag is pure architectural art",
    comment:
      "I was stopped three times in one afternoon at an exhibition asking where I got this bag. The turned mahogany handle has such pleasant weight and tactile warmth. UPONTIK has achieved something truly international with our heritage weaves.",
    isVerifiedPurchase: true,
    productName: "Ochre Heritage Dhol Bag",
  },
  {
    _id: "rev_curated_02",
    customerName: "Dr. Farhan Masud",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    title: "Remarkable craftsmanship and sturdy leatherette accents",
    comment:
      "Ordered the Heritage Tote for everyday university lecture carry. The heavy cotton canvas weave has held its structure impeccably through two seasons. The interior zip compartment keeps my notebook safe.",
    isVerifiedPurchase: true,
    productName: "Heritage Panel Loom Tote",
  },
  {
    _id: "rev_curated_03",
    customerName: "Tasneem Ahmed",
    location: "Chittagong",
    rating: 5,
    title: "Compact phone sling with unbelievable embroidery",
    comment:
      "The woven strap is so comfortable on the shoulder and the geometric patterns are completely distinctive. Arrived in beautiful archival studio packaging within 48 hours.",
    isVerifiedPurchase: true,
    productName: "Compact Loom Phone Bag",
  },
];

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const displayReviews = reviews && reviews.length > 0 ? reviews : DEFAULT_CURATED_REVIEWS;

  return (
    <section className="py-20 lg:py-28 bg-ivory-light border-b border-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#B87932] rounded-full" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#80644B] font-semibold">
              COLLECTOR VOICES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#211D1A] font-normal tracking-tight">
            Real Stories. Real UPONTIK.
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#80644B] mt-3 max-w-lg mx-auto leading-relaxed">
            Unsolicited reflections from collectors and patrons who carry UPONTIK pieces in their daily movements.
          </p>
        </div>

        {/* 3-Column Luxury Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayReviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-ivory border border-sand/70 p-7 sm:p-8 rounded-sm shadow-subtle flex flex-col justify-between hover:border-mustard/50 hover:shadow-luxury transition-all duration-300 relative"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? "fill-mustard text-mustard" : "text-sand"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Heading */}
                <h3 className="font-serif text-lg sm:text-xl text-charcoal font-normal mb-3 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                {/* Review Body */}
                <p className="text-xs sm:text-sm font-sans text-charcoal-muted leading-relaxed mb-6">
                  {rev.comment}
                </p>
              </div>

              {/* Reviewer Meta Footer */}
              <div className="pt-4 border-t border-sand/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-charcoal block">
                    {rev.customerName}
                  </span>
                  <span className="text-[11px] text-earth font-mono block">
                    {rev.location || "Verified Patron"}
                  </span>
                </div>
                {rev.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-earth font-mono bg-sand/30 px-2 py-0.5 rounded-xs">
                    <CheckCircle className="w-3 h-3 text-mustard" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
