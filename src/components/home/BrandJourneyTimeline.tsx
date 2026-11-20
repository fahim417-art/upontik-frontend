"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Scissors, CheckCircle2, Package, Truck, Sparkles } from "lucide-react";

interface JourneyStep {
  stepNumber: string;
  title: string;
  description: string;
  icon?: string;
}

interface BrandJourneyTimelineProps {
  steps?: JourneyStep[];
}

const DEFAULT_STEPS: JourneyStep[] = [
  {
    stepNumber: "01",
    title: "Designed",
    description: "Conceived in our studio with architectural proportions and ergonomic carry in mind.",
    icon: "Compass",
  },
  {
    stepNumber: "02",
    title: "Crafted",
    description: "Woven on heritage looms and paired with individually turned teak and mahogany handles.",
    icon: "Scissors",
  },
  {
    stepNumber: "03",
    title: "Quality Checked",
    description: "Every seam, brass zipper, and lining receives careful artisan inspection.",
    icon: "CheckCircle2",
  },
  {
    stepNumber: "04",
    title: "Ready for You",
    description: "Encased in an unbleached protective cotton dust bag with authenticity card.",
    icon: "Package",
  },
  {
    stepNumber: "05",
    title: "Delivered",
    description: "Swift, tracked dispatch directly to your hands anywhere across Bangladesh.",
    icon: "Truck",
  },
];

export function BrandJourneyTimeline({ steps }: BrandJourneyTimelineProps) {
  const journeySteps = steps && steps.length > 0 ? steps : DEFAULT_STEPS;
  const [activeStep, setActiveStep] = useState(0);

  const getIcon = (title: string, icon?: string) => {
    switch (title.toLowerCase()) {
      case "designed":
        return <Compass className="w-5 h-5" />;
      case "crafted":
        return <Scissors className="w-5 h-5" />;
      case "quality checked":
        return <CheckCircle2 className="w-5 h-5" />;
      case "ready for you":
        return <Package className="w-5 h-5" />;
      case "delivered":
      default:
        return <Truck className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#1F1B18] text-[#F3EBDD] border-y border-sand/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B87932] font-semibold block mb-2">
            THE ATELIER PROCESS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F3EBDD] tracking-tight">
            From Our Hands to Yours
          </h2>
          <p className="text-xs sm:text-sm font-sans text-sand/80 mt-3 leading-relaxed">
            Every UPONTIK bag travels an unhurried, thoughtful journey before arriving in your daily rotation.
          </p>
        </div>

        {/* Desktop Horizontal Stepper */}
        <div className="hidden lg:block relative mb-12">
          {/* Connector Line */}
          <div className="absolute top-7 left-12 right-12 h-[2px] bg-sand/20 z-0">
            <div
              className="h-full bg-[#B87932] transition-all duration-500 ease-out"
              style={{ width: `${(activeStep / (journeySteps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {journeySteps.map((step, idx) => {
              const isActive = idx === activeStep;
              const isPast = idx <= activeStep;
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStep(idx)}
                  className="cursor-pointer group flex flex-col items-center text-center px-2"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 mb-4 border ${
                      isActive
                        ? "bg-[#B87932] text-white border-[#B87932] shadow-luxury scale-110"
                        : isPast
                        ? "bg-[#28221E] text-mustard border-[#B87932]/60"
                        : "bg-[#1C1816] text-sand/40 border-sand/20 group-hover:border-sand/60"
                    }`}
                  >
                    {getIcon(step.title, step.icon)}
                  </div>
                  <span className="text-[10px] font-mono text-[#B87932] tracking-widest font-semibold block mb-1">
                    STAGE {step.stepNumber}
                  </span>
                  <h4 className="font-serif text-lg text-[#F3EBDD] font-medium group-hover:text-mustard transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs font-sans text-sand/70 mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Stepper */}
        <div className="lg:hidden space-y-6 relative pl-6 border-l-2 border-[#B87932]/40 ml-4">
          {journeySteps.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative pl-6"
            >
              <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-[#B87932] text-white flex items-center justify-center text-xs font-bold">
                {step.stepNumber}
              </div>
              <h4 className="font-serif text-xl text-[#F3EBDD] font-medium">{step.title}</h4>
              <p className="text-xs font-sans text-sand/80 mt-1 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
