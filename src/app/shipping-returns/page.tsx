import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck, RotateCcw, ShieldCheck, Check } from "lucide-react";

export const metadata = {
  title: "Courier & Return Policy | UPONTIK",
  description:
    "Learn about UPONTIK courier delivery timeframes across Bangladesh, shipping rates, and our 7-day exchange policy.",
};

export default function ShippingReturnsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-wideDisplay text-mustard font-bold block mb-2">
            Store Policies
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mb-3">
            Courier & Exchange Policy
          </h1>
          <p className="text-xs text-charcoal-muted max-w-md mx-auto">
            Clear, transparent guidelines for delivery and piece exchange across Bangladesh.
          </p>
        </div>

        <div className="space-y-8 bg-ivory-light border border-sand/60 p-8 rounded-sm">
          {/* Shipping */}
          <div className="space-y-3">
            <h2 className="font-serif text-xl text-charcoal font-medium flex items-center gap-2 pb-2 border-b border-sand">
              <Truck className="w-5 h-5 text-earth" />
              <span>Courier Delivery Schedule & Charges</span>
            </h2>
            <ul className="space-y-2 text-xs font-sans text-charcoal-muted leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-mustard shrink-0 mt-0.5" />
                <span>
                  <strong>Inside Dhaka Metropolitan:</strong> Standard courier fee is ৳80.
                  Delivery arrives within 48 to 72 business hours.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-mustard shrink-0 mt-0.5" />
                <span>
                  <strong>Outside Dhaka (All 64 Districts):</strong> Standard courier fee is ৳130.
                  Delivery arrives within 3 to 5 business days.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-mustard shrink-0 mt-0.5" />
                <span>
                  <strong>Complimentary Shipping:</strong> Orders with a merchandise subtotal
                  exceeding ৳3,000 qualify for complimentary delivery.
                </span>
              </li>
            </ul>
          </div>

          {/* Returns & Exchange */}
          <div className="space-y-3 pt-6 border-t border-sand/40">
            <h2 className="font-serif text-xl text-charcoal font-medium flex items-center gap-2 pb-2 border-b border-sand">
              <RotateCcw className="w-5 h-5 text-earth" />
              <span>7-Day Piece Exchange</span>
            </h2>
            <p className="text-xs font-sans text-charcoal-muted leading-relaxed">
              Handcrafted items may be exchanged within 7 days of verified courier
              delivery, provided the bag is in pristine, unworn condition with its
              original brand tags and dust bag intact.
            </p>
            <p className="text-xs font-sans text-charcoal-muted leading-relaxed">
              To initiate an exchange, please contact our concierge at{" "}
              <a href="mailto:care@upontik.com" className="text-mustard font-bold underline">
                care@upontik.com
              </a>{" "}
              with your order reference number.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
