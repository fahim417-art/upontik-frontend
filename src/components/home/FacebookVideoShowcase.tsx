"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, Sparkles } from "lucide-react";
import { VideoModal } from "../layout/VideoModal";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  isFeatured?: boolean;
}

interface FacebookVideoShowcaseProps {
  videos?: VideoItem[];
}

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Turning Solid Mahogany Handles on the Lathe",
    description: "Witness the craft behind our signature Dhol Bag handles, hand-shaped from reclaimed hardwoods.",
    category: "Making Process",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1200",
    isFeatured: true,
  },
  {
    id: "v2",
    title: "Autumn / Winter Textile Weaving in the Studio",
    description: "Generational loom techniques woven into contemporary fashion bags.",
    category: "Behind the Scenes",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=800",
    isFeatured: false,
  },
  {
    id: "v3",
    title: "The Signature Dhol Bag: Styling & Proportion",
    description: "How to carry our most iconic silhouette from morning gallery visits to evening dinners.",
    category: "Product Showcase",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800",
    isFeatured: false,
  },
];

export function FacebookVideoShowcase({ videos }: FacebookVideoShowcaseProps) {
  const items = videos && videos.length > 0 ? videos : DEFAULT_VIDEOS;
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Making Process", "Behind the Scenes", "Product Showcase"];
  const filteredVideos =
    activeCategory === "All" ? items : items.filter((v) => v.category === activeCategory);

  const featuredVideo = items.find((v) => v.isFeatured) || items[0];
  const supportingVideos = items.filter((v) => v.id !== featuredVideo.id);

  return (
    <section className="py-20 lg:py-28 bg-[#181513] text-[#F3EBDD] overflow-hidden border-t border-sand/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-sand/20">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B87932] font-semibold block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B87932]" />
              VISUAL JOURNAL
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F3EBDD] tracking-tight">
              Inside the World of UPONTIK
            </h2>
            <p className="text-xs sm:text-sm font-sans text-sand/80 mt-2">
              Watch our latest stories, collections, and creative moments in the studio.
            </p>
          </div>

          <a
            href="https://facebook.com/upontik"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-sans uppercase tracking-editorial rounded-full transition-colors text-ivory self-start sm:self-auto"
          >
            <span>Watch More on Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Grid Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Featured Video (7 Cols) */}
          <div
            onClick={() => setSelectedVideo(featuredVideo)}
            className="lg:col-span-7 group cursor-pointer relative aspect-video rounded-sm overflow-hidden border border-sand/20 shadow-elevated bg-black"
          >
            <Image
              src={featuredVideo.thumbnailUrl}
              alt={featuredVideo.title}
              fill
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#B87932]/90 group-hover:bg-[#B87932] group-hover:scale-110 text-white flex items-center justify-center shadow-luxury transition-all">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
              </div>
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-ivory">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B87932] bg-black/60 px-2 py-0.5 rounded-xs">
                {featuredVideo.category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-ivory mt-2 font-medium">
                {featuredVideo.title}
              </h3>
              <p className="text-xs text-sand/80 mt-1 line-clamp-1">
                {featuredVideo.description}
              </p>
            </div>
          </div>

          {/* Supporting Video Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {supportingVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className="group cursor-pointer flex gap-4 p-3 bg-[#241F1C] hover:bg-[#2C2622] border border-sand/20 rounded-sm transition-all"
              >
                <div className="relative w-36 aspect-[16/10] bg-black rounded-xs overflow-hidden shrink-0">
                  <Image
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    fill
                    sizes="150px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/80 group-hover:bg-[#B87932] text-charcoal group-hover:text-white flex items-center justify-center transition-colors">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#B87932] block">
                    {vid.category}
                  </span>
                  <h4 className="font-serif text-sm text-ivory font-medium line-clamp-2 mt-1 group-hover:text-mustard transition-colors">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-sand/60 line-clamp-1 mt-1 font-sans">
                    {vid.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Playback Modal */}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.videoUrl}
        title={selectedVideo?.title}
      />
    </section>
  );
}
