"use client";

import React, { useState } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useStore } from "@/context/StoreContext";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const { showToast } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    setIsSent(true);
    showToast("Thank you. Your message has been received by our studio team.", "success");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wideDisplay text-mustard font-bold block mb-2">
            Studio Inquiries
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-charcoal font-normal mb-4">
            Connect With UPONTIK
          </h1>
          <p className="text-sm font-sans text-charcoal-muted leading-relaxed">
            Have questions about custom bag silhouettes, corporate gifting, or orders?
            Our studio team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          {/* Studio Contact Card (5 Cols) */}
          <div className="lg:col-span-5 bg-charcoal text-ivory p-5 sm:p-8 rounded-sm shadow-elevated space-y-8">
            <div>
              <span className="font-serif text-2xl tracking-wideDisplay text-ivory block">
                UPONTIK
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-sand font-sans">
                Studio & Atelier
              </span>
            </div>

            <div className="space-y-6 text-xs font-sans text-ivory/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-mustard shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ivory mb-0.5">Studio & Atelier</p>
                  <p>Konabari, Gazipur, Gazipur</p>
                  <p>Dhaka Division, Bangladesh — 1702</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-mustard shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ivory mb-0.5">Direct & WhatsApp</p>
                  <p>+880 1917-720875</p>
                  <p className="text-[10px] text-ivory/60">Always open • In-store pickup, online booking & delivery</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-mustard shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ivory mb-0.5">Official Email</p>
                  <p>ummetanzila264@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form (7 Cols) */}
          <div className="lg:col-span-7 bg-ivory-light border border-sand/60 p-5 sm:p-8 rounded-sm shadow-sm">
            <h2 className="font-serif text-2xl text-charcoal font-medium mb-6 pb-3 border-b border-sand/40">
              Send a Note
            </h2>

            {isSent ? (
              <div className="p-6 bg-sand/30 border border-sand rounded text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-mustard mx-auto" />
                <h3 className="font-serif text-lg text-charcoal">Message Delivered</h3>
                <p className="text-xs text-charcoal-muted">
                  We typically reply within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ayesha Rahman"
                      required
                      className="w-full p-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ayesha@example.com"
                      required
                      className="w-full p-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Question about Dhol Bag dimensions"
                    className="w-full p-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Your Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="How can we assist you with our handcrafted bags?"
                    required
                    className="w-full p-2.5 bg-ivory border border-sand rounded text-xs text-charcoal focus:outline-none focus:border-mustard"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-8 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-charcoal-light shadow-elevated transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-mustard" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
