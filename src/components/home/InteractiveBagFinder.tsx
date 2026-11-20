"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
  Check,
  Heart,
} from "lucide-react";

interface QuestionOption {
  label: string;
  categoryFilter?: string;
  tag?: string;
}

interface Question {
  id: number;
  question: string;
  subtitle: string;
  options: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What silhouette calls to you today?",
    subtitle: "Select the architectural form that fits your aesthetic.",
    options: [
      { label: "Signature Dhol Bag (Turned Wood Handles)", categoryFilter: "dhol-bag" },
      { label: "Crossbody Side Bag (Hands-Free Movement)", categoryFilter: "side-bag" },
      { label: "Artisan Pouch & Clutch (Compact Elegance)", categoryFilter: "pouch-bag" },
      { label: "Heritage Woven Tote (Generous Capacity)", categoryFilter: "tote-bag" },
      { label: "Vertical Phone Sling (Ultra-Light Essentials)", categoryFilter: "phone-bag" },
    ],
  },
  {
    id: 2,
    question: "What will be its primary occasion?",
    subtitle: "Help us match the capacity and durability you need.",
    options: [
      { label: "Everyday Work & Urban Commute", tag: "work" },
      { label: "Festive Gatherings & Evenings", tag: "evening" },
      { label: "Casual Weekend Outings & Cafes", tag: "casual" },
      { label: "Minimalist Traveling & Essentials", tag: "minimal" },
    ],
  },
  {
    id: 3,
    question: "Which craftsmanship detail inspires you most?",
    subtitle: "Our pieces combine diverse generational techniques.",
    options: [
      { label: "Hand-Turned Mahogany & Teak Wood", tag: "wood" },
      { label: "Textured Loom-Woven Jacquard Patterns", tag: "jacquard" },
      { label: "Heritage Folk Embroidery & Tassels", tag: "embroidery" },
      { label: "Heavyweight Natural Unbleached Canvas", tag: "canvas" },
    ],
  },
  {
    id: 4,
    question: "Which natural tone reflects your palette?",
    subtitle: "Select an earth-inspired hue.",
    options: [
      { label: "Earthy Ochre & Warm Mustard", tag: "ochre" },
      { label: "Deep Onyx Charcoal & Natural Black", tag: "black" },
      { label: "Nordic Sand & Raw Ecru", tag: "sand" },
      { label: "Indigo River Night", tag: "indigo" },
    ],
  },
];

interface InteractiveBagFinderProps {
  products: any[];
}

export function InteractiveBagFinder({ products = [] }: InteractiveBagFinderProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuestionOption>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (option: QuestionOption) => {
    const nextAnswers = { ...answers, [currentStep]: option };
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
  };

  // Compute matched products from actual MongoDB products
  const selectedCategory = answers[0]?.categoryFilter;
  let matchingProducts = products.filter((p) => {
    if (selectedCategory && p.categorySlug !== selectedCategory) {
      return false;
    }
    return true;
  });

  if (matchingProducts.length === 0) {
    matchingProducts = products.slice(0, 3);
  } else {
    matchingProducts = matchingProducts.slice(0, 3);
  }

  const currentQuestion = QUESTIONS[currentStep];

  return (
    <section className="py-20 lg:py-28 bg-[#F3EBDD] border-b border-sand/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#80644B] font-semibold block mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B87932]" />
            CURATED DISCOVERY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#211D1A] tracking-tight">
            Find Your Perfect Bag
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#80644B] mt-2">
            Not sure which silhouette suits your everyday rhythm? Answer four brief questions to meet your match.
          </p>
        </div>

        {/* Finder Box */}
        <div className="bg-[#FAF6F0] border border-[#D7C7AE] rounded-sm p-6 sm:p-10 shadow-elevated">
          {!isCompleted ? (
            <div>
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-[#80644B] mb-6">
                <span>QUESTION 0{currentStep + 1} OF 0{QUESTIONS.length}</span>
                <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% COMPLETE</span>
              </div>
              <div className="w-full bg-sand/30 h-1.5 rounded-full overflow-hidden mb-8">
                <div
                  className="bg-[#B87932] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#211D1A] font-normal">
                      {currentQuestion.question}
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-[#80644B] mt-1">
                      {currentQuestion.subtitle}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {currentQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className="group flex items-center justify-between p-4 bg-[#F3EBDD] hover:bg-[#EAE0D0] border border-[#D7C7AE] hover:border-[#B87932] rounded-sm text-left transition-all"
                      >
                        <span className="font-serif text-base text-[#211D1A] group-hover:text-[#B87932] transition-colors">
                          {opt.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#B87932] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>

                  {currentStep > 0 && (
                    <div className="pt-4 flex justify-start">
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="text-xs uppercase tracking-editorial text-[#80644B] hover:text-[#211D1A] transition-colors"
                      >
                        ← Back to Previous Question
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Results View */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B87932] font-semibold block mb-1">
                    YOUR CURATED MATCHES
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#211D1A]">
                    Handcrafted Pieces Tailored for You
                  </h3>
                  <p className="text-xs text-[#80644B] mt-1">
                    Based on your preference for {answers[0]?.label?.split("(")[0]} and {answers[1]?.label}.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-sand/30 hover:bg-sand/50 text-xs font-sans uppercase tracking-editorial rounded text-[#211D1A] transition-colors self-start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Discovery</span>
                </button>
              </div>

              {/* Matched Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {matchingProducts.map((p) => {
                  const mainImage = p.images?.[0]?.url || p.images?.[0] || "/images/placeholder.jpg";
                  const isFav = isInWishlist(p._id || p.id);

                  return (
                    <div
                      key={p._id || p.id}
                      className="group bg-[#F3EBDD] border border-sand/70 rounded-sm overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[4/5] bg-sand/20 overflow-hidden">
                          <Image
                            src={mainImage}
                            alt={p.name}
                            fill
                            sizes="300px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={() => toggleWishlist(p._id || p.id)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-charcoal shadow-sm transition-colors"
                            aria-label="Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-[#B87932] text-[#B87932]" : ""}`} />
                          </button>
                        </div>
                        <div className="p-4">
                          <span className="text-[10px] uppercase tracking-wider text-[#80644B] font-mono block mb-1">
                            {p.categorySlug?.replace("-", " ")}
                          </span>
                          <h4 className="font-serif text-base text-[#211D1A] font-medium line-clamp-1 group-hover:text-[#B87932] transition-colors">
                            {p.name}
                          </h4>
                          <span className="font-serif text-sm font-bold text-[#211D1A] mt-2 block">
                            {formatPrice(p.price)}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 pt-0 space-y-2">
                        <button
                          onClick={() =>
                            addToCart({
                              productId: p._id || p.id,
                              name: p.name,
                              slug: p.slug,
                              sku: p.sku || "UPK",
                              price: p.price,
                              image: mainImage,
                              quantity: 1,
                            })
                          }
                          className="w-full py-2.5 bg-[#211D1A] hover:bg-[#38312B] text-ivory text-xs uppercase tracking-editorial rounded font-medium flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#B87932]" />
                          <span>Add to Bag</span>
                        </button>
                        <Link
                          href={`/product/${p.slug}`}
                          className="block text-center text-[11px] uppercase tracking-editorial text-[#80644B] hover:text-[#B87932] font-semibold transition-colors"
                        >
                          View Piece Details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
