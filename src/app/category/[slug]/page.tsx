import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  fetchCategoryBySlug,
  fetchCategories,
  fetchProducts,
  fetchHomepageData,
} from "@/lib/server-api";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { ChevronRight, ArrowLeft, Sparkles, SlidersHorizontal } from "lucide-react";

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { sort?: string };
}

export const dynamic = "force-dynamic";

const CATEGORY_EDITORIAL: Record<
  string,
  {
    kicker: string;
    headline: string;
    heritageNote: string;
    badge: string;
    quote: string;
  }
> = {
  "dhol-bag": {
    kicker: "The UPONTIK Signature Silhouette",
    headline: "Architectural Wood Meets Woven Folk Form",
    heritageNote:
      "Inspired by the cylindrical acoustic resonance of Bengali folk instruments, framed with hand-turned solid mahogany handles and heavyweight jacquard weaves.",
    badge: "Master Atelier Signature",
    quote:
      "“A sculptural cylindrical form that bridges musical folklore and luxury handbag architecture.”",
  },
  "side-bag": {
    kicker: "Versatile Everyday Movement",
    headline: "Loomed Crossbody Geometry",
    heritageNote:
      "Crafted for tactile everyday elegance. Hand-woven front panels paired with reinforced leatherette trims and custom brass alloy hardware.",
    badge: "Crossbody Curation",
    quote:
      "“Balanced proportions designed to accompany the modern woman from studio mornings to evening salons.”",
  },
  "pouch-bag": {
    kicker: "Tactile Embroidery & Evenings",
    headline: "Hand-Knotted Tassels & Fine Needlework",
    heritageNote:
      "Compact artisanal clutches adorned with traditional stitchwork, tailored zip partitions, and silky handmade tassel accents.",
    badge: "Artisan Evening Clutches",
    quote:
      "“Intricate hand-guided embroidery capturing centuries of regional decorative arts in palm-sized elegance.”",
  },
  "phone-bag": {
    kicker: "Urban Mobility & Daily Movement",
    headline: "Vertical Compact Carry",
    heritageNote:
      "Engineered for modern simplicity. Slim vertical silhouettes featuring dedicated card slots, magnetic snap security, and tactile jacquard weaves.",
    badge: "Minimalist Mobility",
    quote:
      "“Essential carry distilled into its most refined, weightless, and artistic expression.”",
  },
  "tote-bag": {
    kicker: "Enduring Volume & Generous Structure",
    headline: "Heavyweight Canvas & Jacquard Panels",
    heritageNote:
      "Spacious carryalls engineered with reinforced double webbing straps, structured base panels, and generous interior organization pockets.",
    badge: "Architectural Carryall",
    quote:
      "“Substantial capacity meets delicate artisan textile insets, enduring through daily urban life.”",
  },
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await fetchCategoryBySlug(params.slug);
  if (!category) return { title: "Category Not Found | UPONTIK" };

  return {
    title: category.seoTitle || `${category.name} Collection | UPONTIK Handcrafted Bags`,
    description:
      category.seoDescription ||
      `Explore UPONTIK's handcrafted ${category.name} collection. Generational craftsmanship woven into modern lifestyle silhouettes.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = params;
  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const editorial = CATEGORY_EDITORIAL[slug] || {
    kicker: `Artisan Collection No. ${category.displayOrder}`,
    headline: category.name,
    heritageNote: category.description,
    badge: "Handcrafted Silhouette",
    quote: "“Crafted with generational loom mastery and contemporary silhouette design.”",
  };

  const [homepageData, allCategories, productData] = await Promise.all([
    fetchHomepageData(),
    fetchCategories(),
    fetchProducts({
      categorySlug: slug,
      sort: searchParams.sort,
      limit: 30,
    }),
  ]);

  const cms = homepageData.cms;
  const products = productData.products;
  const total = productData.total;

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar
        text={cms?.announcementBar?.text}
        link={cms?.announcementBar?.link}
        isActive={cms?.announcementBar?.isActive}
      />
      <Navbar />

      {/* Category Hero Banner with Editorial Narrative */}
      <section className="relative py-20 sm:py-28 bg-charcoal text-ivory overflow-hidden border-b border-charcoal-light">
        <div className="absolute inset-0">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover opacity-25 filter blur-[1px] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Path */}
          <nav className="flex items-center gap-2 text-[11px] font-sans tracking-wideDisplay uppercase text-sand mb-6">
            <Link href="/" className="hover:text-ivory transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-sand/60" />
            <Link href="/shop" className="hover:text-ivory transition-colors">
              Collections
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-sand/60" />
            <span className="text-mustard font-semibold">
              {category.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcoal-light/70 backdrop-blur-md border border-charcoal-muted rounded-full mb-4">
                <Sparkles className="w-3 h-3 text-mustard" />
                <span className="text-[10px] uppercase tracking-wideDisplay text-mustard font-bold">
                  {editorial.badge}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-ivory mb-4 tracking-tight leading-tight">
                {category.name}
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-sand/90 mb-4 font-light">
                {editorial.headline}
              </p>

              <p className="font-sans text-xs sm:text-sm text-sand/80 max-w-2xl leading-relaxed mb-6">
                {editorial.heritageNote}
              </p>

              <div className="inline-flex items-center gap-3 text-xs font-mono text-sand/90 bg-charcoal/60 backdrop-blur-sm px-4 py-2 border border-charcoal-light/70 rounded-xs">
                <span>{total} Handcrafted Pieces</span>
                <span>•</span>
                <span>Small Batch</span>
                <span>•</span>
                <span>Dhaka Atelier</span>
              </div>
            </div>

            {/* Editorial Quote Box (Right Column on desktop) */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="p-6 bg-charcoal-light/60 backdrop-blur-md border border-charcoal-muted/60 rounded-xs">
                <p className="font-serif italic text-sm text-ivory/90 leading-relaxed mb-2">
                  {editorial.quote}
                </p>
                <span className="text-[10px] uppercase tracking-wideDisplay text-mustard font-mono">
                  — UPONTIK Atelier Design Notes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sibling Category Pill Navigation Bar (Sticky) */}
      <div className="border-b border-sand/60 bg-ivory/90 sticky top-[69px] sm:top-[77px] z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none py-3 flex items-center gap-2 sm:gap-3">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs font-sans uppercase tracking-wideDisplay text-charcoal hover:text-mustard py-1.5 px-3.5 border border-sand/70 rounded-xs transition-colors whitespace-nowrap bg-ivory-light font-medium"
          >
            <ArrowLeft className="w-3 h-3" />
            All Pieces
          </Link>
          {allCategories.map((c: any) => {
            const isActive = c.slug === category.slug;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`text-xs font-sans uppercase tracking-wideDisplay py-1.5 px-4 rounded-xs transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-charcoal text-ivory font-semibold shadow-subtle"
                    : "text-charcoal-muted hover:text-charcoal bg-sand/20 hover:bg-sand/40 border border-sand/40"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Category Product Grid */}
      <section className="py-14 sm:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-24 bg-ivory-light border border-dashed border-sand max-w-xl mx-auto rounded-xs p-8 shadow-subtle">
              <span className="text-[10px] uppercase tracking-wideDisplay text-earth font-bold block mb-2">
                Studio Archive
              </span>
              <h2 className="font-serif text-2xl text-charcoal mb-3">
                Next {category.name} edition currently on the loom
              </h2>
              <p className="text-xs text-charcoal-muted mb-6 max-w-sm mx-auto leading-relaxed">
                Our weavers are finishing the next release. Please check back soon or browse our other handcrafted silhouettes.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-charcoal text-ivory text-xs font-sans uppercase tracking-wideDisplay hover:bg-mustard transition-colors rounded-xs shadow-subtle font-semibold"
              >
                Explore Other Silhouettes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
              {products.map((product: any, idx: number) => (
                <ProductCard key={product.slug || product._id || idx} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
