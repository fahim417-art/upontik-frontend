"use client";

import React, { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Convert video URL to proper iframe embed
  let embedUrl = videoUrl || "https://www.facebook.com/share/r/1A4gbDNKhE/";
  const isFacebook = embedUrl.includes("facebook.com");

  if (isFacebook) {
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(embedUrl)}&show_text=false&t=0`;
  } else if (embedUrl.includes("watch?v=")) {
    embedUrl = embedUrl.replace("watch?v=", "embed/");
  } else if (embedUrl.includes("youtu.be/")) {
    embedUrl = embedUrl.replace("youtu.be/", "www.youtube.com/embed/");
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-charcoal text-ivory w-full max-w-4xl rounded-sm shadow-elevated border border-sand/30 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#1C1816] border-b border-sand/20">
            <h3 className="font-serif text-base text-ivory font-medium truncate pr-4">
              {title || "UPONTIK Atelier Studio Story"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-sand hover:text-ivory transition-colors"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Container (16:9 ratio) */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={embedUrl}
              title={title || "UPONTIK Video"}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Footer note */}
          <div className="p-4 bg-[#1C1816] border-t border-sand/20 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-sand/80 gap-2">
            <span>UPONTIK — Generational Heritage & Handcrafted Silhouettes</span>
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mustard text-charcoal font-medium rounded-xs hover:bg-mustard-light transition-colors"
              >
                <span>{isFacebook ? "Watch on Facebook Reel" : "Watch Full Video"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
