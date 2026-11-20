"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface NewsletterSectionProps {
  cms?: {
    title?: string;
    subtitle?: string;
  };
}

export function NewsletterSection({ cms }: NewsletterSectionProps) {
  const { showToast } = useStore();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const title = cms?.title || "Letters From UPONTIK.";
  const subtitle =
    cms?.subtitle ||
    "Be the first to discover new collections, updates, and special announcements.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please provide a valid email address.", "error");
      return;
    }
    if (!consent) {
      showToast("Please agree to receive studio updates.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "homepage_newsletter" }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
        showToast(data.message || "Thank you. Welcome to Letters from UPONTIK.", "success");
        setEmail("");
      } else {
        showToast(data.error || "Subscription failed.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] border-b border-sand/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#B87932]" />
          <span className="text-[11px] uppercase tracking-wideDisplay text-[#80644B] font-bold font-mono">
            DISPATCHES FROM THE LOOM
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl text-[#211D1A] font-normal mb-4 tracking-tight">
          {title}
        </h2>

        <p className="text-xs sm:text-sm font-sans text-[#80644B] max-w-lg mx-auto mb-8 leading-relaxed">
          {subtitle}
        </p>

        {isSubscribed ? (
          <div className="inline-flex items-center gap-2.5 px-6 py-4 bg-ivory border border-[#B87932] rounded-xs text-[#211D1A] text-xs sm:text-sm font-sans shadow-elevated">
            <CheckCircle2 className="w-4 h-4 text-[#B87932] flex-shrink-0" />
            <span>Thank you. Your address is warmly inscribed in our studio ledger.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-ivory border border-sand/80 rounded-xs text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:border-[#B87932] transition-colors shadow-subtle"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 bg-[#211D1A] hover:bg-[#B87932] text-ivory text-xs uppercase tracking-wideDisplay font-semibold rounded-xs shadow-subtle transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-mustard" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5 text-mustard" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal-muted/80">
              <input
                type="checkbox"
                id="newsletterConsent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="accent-[#B87932] rounded-xs w-3.5 h-3.5"
              />
              <label htmlFor="newsletterConsent" className="cursor-pointer">
                I agree to receive occasional artisan collection notes. No spam.
              </label>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
