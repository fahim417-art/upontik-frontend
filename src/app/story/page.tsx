import Image from "next/image";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Sparkles, Layers, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Our Story — Tradition, Woven Into Modern Living | UPONTIK",
  description:
    "Discover the artisanal genesis of UPONTIK. Bringing Bangladeshi textile craftsmanship, hand-carved wooden handles, and contemporary bag design together.",
};

export default function StoryPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-ivory-light border-b border-sand/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-wideDisplay text-mustard font-bold block mb-3">
            The UPONTIK Genesis
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal font-normal leading-tight mb-6">
            Tradition, Woven Into Modern Living.
          </h1>
          <p className="font-sans text-base text-charcoal-muted leading-relaxed max-w-2xl mx-auto">
            UPONTIK exists to honor generational craftsmanship while designing
            architectural bags that belong effortlessly in modern city rhythms.
          </p>
        </div>
      </section>

      {/* Story Sections */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-20">
        {/* Story Section 1: The Loom & The Wood */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-[4/5] rounded-sm overflow-hidden shadow-elevated border border-sand bg-sand/20">
            <Image
              src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1000"
              alt="Crafting the Dhol Bag wooden handle"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-editorial text-earth font-bold">
              Materiality & Form
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              The Architecture of the Dhol Bag
            </h2>
            <p className="text-sm font-sans text-charcoal-muted leading-relaxed">
              Our signature silhouette draws inspiration from the acoustic and visual
              proportions of traditional South Asian folk percussion—the dhol.
              Rather than replicating an antique artifact, we abstracted its cylindrical
              rhythm into a sculptural everyday companion.
            </p>
            <p className="text-sm font-sans text-charcoal-muted leading-relaxed">
              Each handle is individually turned from solid reclaimed mahogany and
              teak, hand-polished with beeswax to bring out deep natural grain without
              synthetic polyurethanes.
            </p>
          </div>
        </div>

        {/* Story Section 2: Woven Tapestries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 relative aspect-[4/5] rounded-sm overflow-hidden shadow-elevated border border-sand bg-sand/20">
            <Image
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1000"
              alt="Textile weaving details"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-6 lg:order-1 space-y-4">
            <span className="text-xs uppercase tracking-editorial text-earth font-bold">
              Generational Threads
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Textiles with Tactile Depth
            </h2>
            <p className="text-sm font-sans text-charcoal-muted leading-relaxed">
              In an era dominated by synthetic fast fashion and uniform polyester,
              UPONTIK celebrates the deliberate texture of loomed cotton, heavy canvas,
              and intricate brocade panels.
            </p>
            <p className="text-sm font-sans text-charcoal-muted leading-relaxed">
              Every bag is lined with durable cotton twill and reinforced with
              commercial-grade stitching at all stress joints, ensuring that your
              bag endures as an heirloom piece.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 py-3.5 px-8 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded hover:bg-charcoal-light shadow-elevated transition-colors"
              >
                <span>Discover Collections</span>
                <ArrowRight className="w-4 h-4 text-mustard" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
