"use client";

import React, { useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function FloatingWhatsApp({
  phoneNumber = "+8801917720875",
  defaultMessage = "Hello UPONTIK! I would like to inquire about your handcrafted bag collection.",
}: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState("");

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");

  const handleSend = (text: string) => {
    const message = encodeURIComponent(text || defaultMessage);
    const url = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* WhatsApp Dialog Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2.5rem)] max-w-sm bg-ivory dark:bg-[#1A1613] rounded-sm shadow-elevated border border-sand dark:border-[#2C2620] overflow-hidden z-50 text-charcoal dark:text-[#F5EFE8]"
          >
            {/* Header */}
            <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-serif text-lg font-bold">
                  U
                </div>
                <div>
                  <h4 className="font-serif text-sm font-medium">Upontik Handicraft Concierge</h4>
                  <p className="text-[10px] text-white/80">Typically replies within an hour</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1"
                aria-label="Close WhatsApp chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-[#EFEAE2] space-y-3 max-h-72 overflow-y-auto">
              <div className="bg-white p-3 rounded-lg shadow-subtle text-xs text-charcoal max-w-[85%] leading-relaxed">
                Hello! Welcome to UPONTIK Studio Atelier. How may we assist you today with our handcrafted bags?
              </div>

              {/* Quick Prompt Pills */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => handleSend("Hello! I want to inquire about custom or in-stock Dhol bags.")}
                  className="w-full text-left p-2 rounded bg-white/80 hover:bg-white text-[11px] text-charcoal transition-colors border border-sand/40"
                >
                  👜 Inquire about Dhol Bags & Silhouettes
                </button>
                <button
                  onClick={() => handleSend("Hi UPONTIK! I would like to check on my recent order.")}
                  className="w-full text-left p-2 rounded bg-white/80 hover:bg-white text-[11px] text-charcoal transition-colors border border-sand/40"
                >
                  📦 Inquire about Order Delivery Status
                </button>
                <button
                  onClick={() => handleSend("Hello! Do you offer corporate or festive gift packaging?")}
                  className="w-full text-left p-2 rounded bg-white/80 hover:bg-white text-[11px] text-charcoal transition-colors border border-sand/40"
                >
                  🎁 Gifting & Bespoke Orders
                </button>
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-sand/40 flex items-center gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(customText);
                }}
                placeholder="Type your message..."
                className="flex-1 p-2 bg-ivory border border-sand/60 rounded text-xs text-charcoal focus:outline-none focus:border-[#25D366]"
              />
              <button
                onClick={() => handleSend(customText)}
                className="p-2 bg-[#25D366] text-white rounded hover:bg-[#20bd5a] transition-colors"
                aria-label="Send WhatsApp message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Green WhatsApp Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-luxury flex items-center justify-center hover:bg-[#20bd5a] transition-all relative focus:outline-none"
        aria-label="Chat with UPONTIK on WhatsApp"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>

        {/* Pulse beacon */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-mustard rounded-full animate-ping opacity-75" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-mustard rounded-full" />
      </motion.button>
    </div>
  );
}
