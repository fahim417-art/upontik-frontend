"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Sliders,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Type,
  Image as ImageIcon,
  Compass,
  Plus,
  Trash2,
  Video,
  Share2,
  MessageCircle,
  Gift,
  ShieldCheck,
  Eye,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";

export default function AdminHomepageCMSPage() {
  const { showToast } = useStore();
  const [activeTab, setActiveTab] = useState<
    "hero" | "benefits_journey" | "story_videos" | "collections_gifts" | "care_social"
  >("hero");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  // 1. Announcement Bar
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementLink, setAnnouncementLink] = useState("");
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [announcementShowSocials, setAnnouncementShowSocials] = useState(true);

  // 2. Hero Slides
  const [heroSlides, setHeroSlides] = useState<any[]>([]);

  // 3. Brand Benefits
  const [brandBenefits, setBrandBenefits] = useState<any[]>([]);

  // 4. Brand Journey Steps
  const [brandJourney, setBrandJourney] = useState<any[]>([]);

  // 5. Brand Story
  const [storyEyebrow, setStoryEyebrow] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [storySubtitle, setStorySubtitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [storyCtaText, setStoryCtaText] = useState("");
  const [storyCtaLink, setStoryCtaLink] = useState("");
  const [storyImage, setStoryImage] = useState("");
  const [storyVideoUrl, setStoryVideoUrl] = useState("");

  // 6. Videos Showcase
  const [videos, setVideos] = useState<any[]>([]);

  // 7. Signature Collection
  const [sigTitle, setSigTitle] = useState("");
  const [sigSubtitle, setSigSubtitle] = useState("");
  const [sigDescription, setSigDescription] = useState("");
  const [sigCtaText, setSigCtaText] = useState("");
  const [sigCtaLink, setSigCtaLink] = useState("");
  const [sigImage, setSigImage] = useState("");

  // 8. Gift Section
  const [giftTitle, setGiftTitle] = useState("");
  const [giftSubtitle, setGiftSubtitle] = useState("");
  const [giftDesc, setGiftDesc] = useState("");
  const [giftCtaText, setGiftCtaText] = useState("");
  const [giftImage, setGiftImage] = useState("");

  // 9. Care Guides
  const [careGuides, setCareGuides] = useState<any[]>([]);

  // 10. Social Links & WhatsApp
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState("");

  // 11. Final CTA
  const [finalCtaTitle, setFinalCtaTitle] = useState("");
  const [finalCtaDesc, setFinalCtaDesc] = useState("");
  const [finalCtaBtnText, setFinalCtaBtnText] = useState("");
  const [finalCtaImage, setFinalCtaImage] = useState("");

  useEffect(() => {
    fetchCMS();
  }, []);

  const fetchCMS = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/homepage");
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;

        // Announcement
        setAnnouncementText(d.announcementBar?.text || "");
        setAnnouncementLink(d.announcementBar?.link || "");
        setAnnouncementActive(d.announcementBar?.isActive !== false);
        setAnnouncementShowSocials(d.announcementBar?.showSocials !== false);

        // Hero Slides
        setHeroSlides(
          d.heroSlides && d.heroSlides.length > 0
            ? d.heroSlides
            : [
              {
                id: "slide_1",
                eyebrow: "ARTISAN BAGS • TIMELESS DESIGN",
                title: "Made By Us.\nLoved By You.",
                subtitle:
                  "From our creative hands to your everyday style. Discover thoughtfully designed bags created with care and a passion for craftsmanship.",
                ctaText: "Explore Our Collection",
                ctaLink: "/shop",
                secondaryCtaText: "Watch Our Story",
                secondaryCtaLink: "/story",
                desktopImage: "/images/hero/hero-slide-1.jpg",
                isActive: true,
              },
            ]
        );

        // Benefits
        setBrandBenefits(d.brandBenefits || []);

        // Journey
        setBrandJourney(d.brandJourney || []);

        // Story
        setStoryEyebrow(d.brandStory?.eyebrow || "THE ARTISAN NARRATIVE");
        setStoryTitle(d.brandStory?.title || "Behind Every Bag, There Is a Story.");
        setStorySubtitle(d.brandStory?.subtitle || "");
        setStoryContent(d.brandStory?.content || "");
        setStoryCtaText(d.brandStory?.ctaText || "Learn Our Story");
        setStoryCtaLink(d.brandStory?.ctaLink || "/story");
        setStoryImage(d.brandStory?.image || "");
        setStoryVideoUrl(d.brandStory?.videoUrl || "");

        // Videos
        setVideos(d.videos || []);

        // Signature Collection
        setSigTitle(d.signatureCollection?.title || "The UPONTIK Signature Collection");
        setSigSubtitle(d.signatureCollection?.subtitle || "");
        setSigDescription(d.signatureCollection?.description || "");
        setSigCtaText(d.signatureCollection?.ctaText || "Discover Signature Pieces");
        setSigCtaLink(d.signatureCollection?.ctaLink || "/category/dhol-bag");
        setSigImage(d.signatureCollection?.image || "");

        // Gift Section
        setGiftTitle(d.giftSection?.title || "A Thoughtful Gift, Made Special.");
        setGiftSubtitle(d.giftSection?.subtitle || "");
        setGiftDesc(d.giftSection?.description || "");
        setGiftCtaText(d.giftSection?.ctaText || "Explore Gift Collection");
        setGiftImage(d.giftSection?.image || "");

        // Care Guides
        setCareGuides(d.careGuides || []);

        // Social Links
        setFacebookLink(d.socialLinks?.facebook || "");
        setInstagramLink(d.socialLinks?.instagram || "");
        setYoutubeLink(d.socialLinks?.youtube || "");
        setWhatsappNumber(d.socialLinks?.whatsappNumber || "+8801700000000");
        setWhatsappDefaultMessage(d.socialLinks?.defaultMessage || "");

        // Final CTA
        setFinalCtaTitle(d.finalCta?.title || "Your Next Favourite Bag Is Waiting.");
        setFinalCtaDesc(d.finalCta?.description || "");
        setFinalCtaBtnText(d.finalCta?.ctaText || "Explore the Collection");
        setFinalCtaImage(d.finalCta?.image || "");
      }
    } catch {
      showToast("Failed to fetch CMS settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        announcementBar: {
          text: announcementText,
          link: announcementLink,
          isActive: announcementActive,
          showSocials: announcementShowSocials,
        },
        heroSlides,
        brandBenefits,
        brandJourney,
        brandStory: {
          eyebrow: storyEyebrow,
          title: storyTitle,
          subtitle: storySubtitle,
          content: storyContent,
          ctaText: storyCtaText,
          ctaLink: storyCtaLink,
          image: storyImage,
          videoUrl: storyVideoUrl,
        },
        videos,
        signatureCollection: {
          title: sigTitle,
          subtitle: sigSubtitle,
          description: sigDescription,
          ctaText: sigCtaText,
          ctaLink: sigCtaLink,
          image: sigImage,
          isActive: true,
        },
        giftSection: {
          title: giftTitle,
          subtitle: giftSubtitle,
          description: giftDesc,
          ctaText: giftCtaText,
          image: giftImage,
          isActive: true,
        },
        careGuides,
        socialLinks: {
          facebook: facebookLink,
          instagram: instagramLink,
          youtube: youtubeLink,
          whatsapp: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`,
          whatsappNumber,
          defaultMessage: whatsappDefaultMessage,
        },
        finalCta: {
          title: finalCtaTitle,
          description: finalCtaDesc,
          ctaText: finalCtaBtnText,
          ctaLink: "/shop",
          image: finalCtaImage,
          isActive: true,
        },
      };

      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Homepage & Brand Experience published live to MongoDB.", "success");
      } else {
        showToast(data.error || "Failed to update CMS", "error");
      }
    } catch {
      showToast("Error updating CMS", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Slide management helpers
  const handleAddSlide = () => {
    const newSlide = {
      id: `slide_${Date.now()}`,
      eyebrow: "ARTISAN BAGS • TIMELESS DESIGN",
      title: "New Artisan Silhouette",
      subtitle: "Handcrafted with generational care and loomed natural fibers.",
      ctaText: "Explore Collection",
      ctaLink: "/shop",
      secondaryCtaText: "Watch Our Story",
      secondaryCtaLink: "/story",
      desktopImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1600",
      isActive: true,
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const handleUpdateSlide = (idx: number, field: string, val: any) => {
    const updated = [...heroSlides];
    updated[idx] = { ...updated[idx], [field]: val };
    setHeroSlides(updated);
  };

  const handleDeleteSlide = (idx: number) => {
    if (heroSlides.length <= 1) {
      showToast("You must maintain at least one active slide.", "error");
      return;
    }
    setHeroSlides(heroSlides.filter((_, i) => i !== idx));
  };

  const handleMoveSlideUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...heroSlides];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setHeroSlides(updated);
  };

  const handleMoveSlideDown = (idx: number) => {
    if (idx >= heroSlides.length - 1) return;
    const updated = [...heroSlides];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setHeroSlides(updated);
  };

  const CAMPAIGN_HERO_ASSETS = [
    {
      name: "Slide 01 — Blue Saree & Mustard Bag",
      path: "/images/hero/hero-slide-01.jpg",
      type: "primary",
    },
    {
      name: "Slide 02 — Floral Saree & Botanical Handbag",
      path: "/images/hero/hero-slide-02.jpg",
      type: "primary",
    },
    {
      name: "Slide 03 — Artisan Craftswomen Studio",
      path: "/images/hero/hero-slide-03.jpg",
      type: "primary",
    },
  ];

  if (isLoading) {
    return (
      <div className="py-12 text-center text-charcoal-muted font-serif">
        Loading Homepage & Brand CMS settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-mustard font-semibold block">
            MASTER CMS CONSOLE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Homepage & Brand Experience Management
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-sans">
            Configure editorial hero slides, craftsmanship narrative, brand journey, and social settings live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 bg-sand/30 hover:bg-sand/50 text-charcoal text-xs uppercase tracking-editorial rounded font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleSaveCMS}
            disabled={isSaving}
            className="py-2.5 px-6 bg-charcoal hover:bg-charcoal-light text-ivory text-xs uppercase tracking-editorial rounded font-bold inline-flex items-center gap-2 shadow-elevated transition-colors"
          >
            <Save className="w-4 h-4 text-mustard" />
            <span>{isSaving ? "Publishing..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-sand gap-2 overflow-x-auto text-xs uppercase tracking-editorial font-bold">
        <button
          onClick={() => setActiveTab("hero")}
          className={`pb-3 px-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === "hero" ? "border-mustard text-charcoal" : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
        >
          01. Announcement & Hero Slider
        </button>
        <button
          onClick={() => setActiveTab("benefits_journey")}
          className={`pb-3 px-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === "benefits_journey" ? "border-mustard text-charcoal" : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
        >
          02. Benefits & Journey Timeline
        </button>
        <button
          onClick={() => setActiveTab("story_videos")}
          className={`pb-3 px-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === "story_videos" ? "border-mustard text-charcoal" : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
        >
          03. Brand Story & Studio Videos
        </button>
        <button
          onClick={() => setActiveTab("collections_gifts")}
          className={`pb-3 px-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === "collections_gifts" ? "border-mustard text-charcoal" : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
        >
          04. Signature & Gift Parcels
        </button>
        <button
          onClick={() => setActiveTab("care_social")}
          className={`pb-3 px-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === "care_social" ? "border-mustard text-charcoal" : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
        >
          05. Care Guides & WhatsApp
        </button>
      </div>

      <form onSubmit={handleSaveCMS} className="space-y-8">
        {/* TAB 1: Announcement & Hero Slider */}
        {activeTab === "hero" && (
          <div className="space-y-8">
            {/* Announcement Bar Box */}
            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl text-charcoal font-medium pb-2 border-b border-sand">
                Top Announcement Bar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Free Shipping across Bangladesh • Handmade with Love"
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Link Destination (Optional)
                  </label>
                  <input
                    type="text"
                    value={announcementLink}
                    onChange={(e) => setAnnouncementLink(e.target.value)}
                    placeholder="/shop"
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                  />
                </div>
                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementActive}
                      onChange={(e) => setAnnouncementActive(e.target.checked)}
                      className="accent-mustard rounded"
                    />
                    <span>Bar Visible</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementShowSocials}
                      onChange={(e) => setAnnouncementShowSocials(e.target.checked)}
                      className="accent-mustard rounded"
                    />
                    <span>Show &ldquo;Follow Us&rdquo; Icons</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Hero Slides Box */}
            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-sand">
                <div>
                  <h3 className="font-serif text-xl text-charcoal font-medium">
                    Hero Carousel Slides ({heroSlides.length})
                  </h3>
                  <p className="text-xs text-charcoal-muted">
                    Manage the full-bleed editorial slides. Slide 1 matches the atelier reference photography.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="py-2 px-4 bg-mustard text-charcoal font-bold text-xs uppercase tracking-editorial rounded flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slide</span>
                </button>
              </div>

              {/* Quick Preset Assets Bar */}
              <div className="p-4 bg-sand/30 border border-sand rounded-sm space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-charcoal font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-mustard" />
                  <span>Available Campaign Hero Assets ({CAMPAIGN_HERO_ASSETS.length})</span>
                </span>
                <p className="text-[11px] text-charcoal-muted">
                  Click any asset below to copy its path or inspect its framing:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
                  {CAMPAIGN_HERO_ASSETS.map((asset) => (
                    <div
                      key={asset.path}
                      onClick={() => {
                        navigator.clipboard?.writeText(asset.path);
                        showToast(`Copied ${asset.path} to clipboard`, "info");
                      }}
                      className="group cursor-pointer border border-sand hover:border-mustard rounded overflow-hidden bg-ivory p-1.5 flex flex-col gap-1 transition-all"
                      title="Click to copy path"
                    >
                      <div className="relative w-full h-16 bg-charcoal/10 rounded overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset.path}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[9px] font-sans font-medium text-charcoal line-clamp-1 leading-tight">
                        {asset.name}
                      </span>
                      <span className="text-[8px] font-mono uppercase text-mustard">
                        {asset.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {heroSlides.map((slide, sIdx) => (
                  <div
                    key={slide.id || sIdx}
                    className="p-5 bg-ivory-light border border-sand/80 rounded-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between border-b border-sand/40 pb-3 gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-mustard uppercase bg-sand/40 px-2 py-0.5 rounded">
                          SLIDE 0{sIdx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveSlideUp(sIdx)}
                            disabled={sIdx === 0}
                            className="p-1 text-charcoal-muted hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSlideDown(sIdx)}
                            disabled={sIdx === heroSlides.length - 1}
                            className="p-1 text-charcoal-muted hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                          <input
                            type="checkbox"
                            checked={slide.isActive !== false}
                            onChange={(e) =>
                              handleUpdateSlide(sIdx, "isActive", e.target.checked)
                            }
                            className="accent-mustard rounded"
                          />
                          <span className="font-medium">Published / Active</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(sIdx)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Eyebrow Tag
                        </label>
                        <input
                          type="text"
                          value={slide.eyebrow || ""}
                          onChange={(e) => handleUpdateSlide(sIdx, "eyebrow", e.target.value)}
                          placeholder="ARTISAN BAGS • TIMELESS DESIGN"
                          className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Main Headline (Use \n for italic line break)
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => handleUpdateSlide(sIdx, "title", e.target.value)}
                          placeholder="Made By Us.\nLoved By You."
                          className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Editorial Subtitle / Description
                        </label>
                        <textarea
                          value={slide.subtitle}
                          onChange={(e) => handleUpdateSlide(sIdx, "subtitle", e.target.value)}
                          rows={2}
                          className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Primary CTA Text & Destination
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.ctaText}
                            onChange={(e) => handleUpdateSlide(sIdx, "ctaText", e.target.value)}
                            placeholder="Explore Our Collection"
                            className="flex-1 p-2 bg-ivory border border-sand rounded text-xs text-charcoal"
                          />
                          <input
                            type="text"
                            value={slide.ctaLink}
                            onChange={(e) => handleUpdateSlide(sIdx, "ctaLink", e.target.value)}
                            placeholder="/shop"
                            className="w-28 p-2 bg-ivory border border-sand rounded text-xs text-charcoal"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Secondary CTA Text & Destination
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.secondaryCtaText || ""}
                            onChange={(e) => handleUpdateSlide(sIdx, "secondaryCtaText", e.target.value)}
                            placeholder="Watch Our Story"
                            className="flex-1 p-2 bg-ivory border border-sand rounded text-xs text-charcoal"
                          />
                          <input
                            type="text"
                            value={slide.secondaryCtaLink || ""}
                            onChange={(e) => handleUpdateSlide(sIdx, "secondaryCtaLink", e.target.value)}
                            placeholder="/story"
                            className="w-28 p-2 bg-ivory border border-sand rounded text-xs text-charcoal"
                          />
                        </div>
                      </div>

                      {/* Desktop Image with Live Preview */}
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Desktop Image URL / Path (16:9)
                        </label>
                        <input
                          type="text"
                          value={slide.desktopImage}
                          onChange={(e) => handleUpdateSlide(sIdx, "desktopImage", e.target.value)}
                          placeholder="/images/hero/hero-slide-1.jpg or https://..."
                          className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard font-mono"
                        />
                        {slide.desktopImage && (
                          <div className="mt-2 relative w-full h-24 bg-charcoal/10 rounded overflow-hidden border border-sand">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={slide.desktopImage}
                              alt="Desktop Preview"
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 bg-charcoal/80 text-ivory text-[9px] px-1.5 py-0.5 rounded font-mono">
                              Desktop
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Mobile Image with Live Preview */}
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Mobile Image URL / Path (Portrait 9:16)
                        </label>
                        <input
                          type="text"
                          value={slide.mobileImage || ""}
                          onChange={(e) => handleUpdateSlide(sIdx, "mobileImage", e.target.value)}
                          placeholder="/images/hero/hero-slide-1-mobile.jpg"
                          className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard font-mono"
                        />
                        {slide.mobileImage && (
                          <div className="mt-2 relative w-20 h-24 bg-charcoal/10 rounded overflow-hidden border border-sand">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={slide.mobileImage}
                              alt="Mobile Preview"
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 bg-charcoal/80 text-ivory text-[9px] px-1.5 py-0.5 rounded font-mono">
                              Mobile
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Benefits & Journey */}
        {activeTab === "benefits_journey" && (
          <div className="space-y-8">
            {/* Brand Benefits Box */}
            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl text-charcoal font-medium pb-2 border-b border-sand">
                Brand Benefits Strip (Under Hero)
              </h3>
              <p className="text-xs text-charcoal-muted">
                4 horizontal confidence indicators.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {brandBenefits.map((b, bIdx) => (
                  <div key={bIdx} className="p-3 bg-ivory-light border border-sand/60 rounded">
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Benefit 0{bIdx + 1} Title
                    </label>
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const updated = [...brandBenefits];
                        updated[bIdx].title = e.target.value;
                        setBrandBenefits(updated);
                      }}
                      className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal mb-2"
                    />
                    <label className="block text-[11px] font-medium text-charcoal-muted mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={b.description}
                      onChange={(e) => {
                        const updated = [...brandBenefits];
                        updated[bIdx].description = e.target.value;
                        setBrandBenefits(updated);
                      }}
                      className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Journey Timeline */}
            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl text-charcoal font-medium pb-2 border-b border-sand">
                From Our Hands to Yours — 5 Manufacturing & Delivery Stages
              </h3>
              <div className="space-y-3">
                {brandJourney.map((step, sIdx) => (
                  <div key={sIdx} className="p-3 bg-ivory-light border border-sand/60 rounded grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <span className="font-mono text-xs font-bold text-mustard sm:col-span-1">
                      {step.stepNumber}
                    </span>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...brandJourney];
                          updated[sIdx].title = e.target.value;
                          setBrandJourney(updated);
                        }}
                        className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal font-bold"
                      />
                    </div>
                    <div className="sm:col-span-7">
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) => {
                          const updated = [...brandJourney];
                          updated[sIdx].description = e.target.value;
                          setBrandJourney(updated);
                        }}
                        className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Story & Videos */}
        {activeTab === "story_videos" && (
          <div className="space-y-8">
            {/* Story Section */}
            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl text-charcoal font-medium pb-2 border-b border-sand">
                Behind Every Bag, There Is a Story
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={storyEyebrow}
                    onChange={(e) => setStoryEyebrow(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Headline</label>
                  <input
                    type="text"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-charcoal mb-1">Narrative Content</label>
                  <textarea
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Workbench Image URL</label>
                  <input
                    type="text"
                    value={storyImage}
                    onChange={(e) => setStoryImage(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Studio Video Embed URL</label>
                  <input
                    type="text"
                    value={storyVideoUrl}
                    onChange={(e) => setStoryVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Videos Showcase */}
            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl text-charcoal font-medium pb-2 border-b border-sand">
                Facebook & Studio Video Showcase
              </h3>
              <div className="space-y-4">
                {videos.map((vid, vIdx) => (
                  <div key={vid.id || vIdx} className="p-4 bg-ivory-light border border-sand rounded space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-charcoal mb-1">Category</label>
                        <input
                          type="text"
                          value={vid.category}
                          onChange={(e) => {
                            const updated = [...videos];
                            updated[vIdx].category = e.target.value;
                            setVideos(updated);
                          }}
                          className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-charcoal mb-1">Title</label>
                        <input
                          type="text"
                          value={vid.title}
                          onChange={(e) => {
                            const updated = [...videos];
                            updated[vIdx].title = e.target.value;
                            setVideos(updated);
                          }}
                          className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-charcoal mb-1">Video URL (YouTube/FB)</label>
                        <input
                          type="text"
                          value={vid.videoUrl}
                          onChange={(e) => {
                            const updated = [...videos];
                            updated[vIdx].videoUrl = e.target.value;
                            setVideos(updated);
                          }}
                          className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-charcoal mb-1">Thumbnail URL</label>
                        <input
                          type="text"
                          value={vid.thumbnailUrl}
                          onChange={(e) => {
                            const updated = [...videos];
                            updated[vIdx].thumbnailUrl = e.target.value;
                            setVideos(updated);
                          }}
                          className="w-full p-2 bg-ivory border border-sand rounded text-xs text-charcoal font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Collections & Gifts */}
        {activeTab === "collections_gifts" && (
          <div className="space-y-8">
            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl text-charcoal font-medium pb-2 border-b border-sand">
                The UPONTIK Signature Collection
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Title</label>
                  <input
                    type="text"
                    value={sigTitle}
                    onChange={(e) => setSigTitle(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={sigSubtitle}
                    onChange={(e) => setSigSubtitle(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-charcoal mb-1">Description</label>
                  <textarea
                    value={sigDescription}
                    onChange={(e) => setSigDescription(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">CTA Label</label>
                  <input
                    type="text"
                    value={sigCtaText}
                    onChange={(e) => setSigCtaText(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Campaign Image URL</label>
                  <input
                    type="text"
                    value={sigImage}
                    onChange={(e) => setSigImage(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl text-charcoal font-medium pb-2 border-b border-sand">
                Bespoke Gifting & Presentation Parcels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Title</label>
                  <input
                    type="text"
                    value={giftTitle}
                    onChange={(e) => setGiftTitle(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={giftSubtitle}
                    onChange={(e) => setGiftSubtitle(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-charcoal mb-1">Description</label>
                  <textarea
                    value={giftDesc}
                    onChange={(e) => setGiftDesc(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Care & WhatsApp */}
        {activeTab === "care_social" && (
          <div className="space-y-8">
            {/* Social & WhatsApp */}
            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl text-charcoal font-medium pb-2 border-b border-sand">
                Official Social Media & WhatsApp Concierge
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Facebook Page Link</label>
                  <input
                    type="text"
                    value={facebookLink}
                    onChange={(e) => setFacebookLink(e.target.value)}
                    placeholder="https://facebook.com/upontik"
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Instagram Link</label>
                  <input
                    type="text"
                    value={instagramLink}
                    onChange={(e) => setInstagramLink(e.target.value)}
                    placeholder="https://instagram.com/upontik"
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">YouTube Link</label>
                  <input
                    type="text"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="https://youtube.com/@upontik"
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+8801700000000"
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-charcoal mb-1">WhatsApp Default Inbound Message</label>
                  <input
                    type="text"
                    value={whatsappDefaultMessage}
                    onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
              </div>
            </div>

            {/* Closing Brand CTA */}
            <div className="bg-ivory border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl text-charcoal font-medium pb-2 border-b border-sand">
                Closing Brand CTA (Before Footer)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Headline</label>
                  <input
                    type="text"
                    value={finalCtaTitle}
                    onChange={(e) => setFinalCtaTitle(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    value={finalCtaBtnText}
                    onChange={(e) => setFinalCtaBtnText(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-charcoal mb-1">Description</label>
                  <input
                    type="text"
                    value={finalCtaDesc}
                    onChange={(e) => setFinalCtaDesc(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-charcoal mb-1">Atmospheric Image URL</label>
                  <input
                    type="text"
                    value={finalCtaImage}
                    onChange={(e) => setFinalCtaImage(e.target.value)}
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-xs text-charcoal font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button at Bottom */}
        <div className="pt-4 border-t border-sand flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="py-3.5 px-8 bg-charcoal hover:bg-charcoal-light text-ivory text-xs uppercase tracking-editorial rounded font-bold inline-flex items-center gap-2 shadow-elevated transition-colors"
          >
            <Save className="w-4 h-4 text-mustard" />
            <span>{isSaving ? "Publishing to Live Atelier..." : "Publish Live Homepage Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
