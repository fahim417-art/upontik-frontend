import {
  DEFAULT_HOMEPAGE_CMS,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
} from "@/lib/seed-data";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { BrandBenefitsStrip } from "@/components/home/BrandBenefitsStrip";
import { CategoryGridSection } from "@/components/home/CategoryGridSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { SignatureCollectionSection } from "@/components/home/SignatureCollectionSection";
import { BrandStorySection } from "@/components/home/BrandStorySection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 60; // ISR cache revalidation every minute

async function fetchHomepageData() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${backendUrl}/homepage`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch {
    // Graceful fallback to rich seed defaults during initial build
  }

  return {
    cms: DEFAULT_HOMEPAGE_CMS,
    categories: SEED_CATEGORIES,
    featuredProducts: SEED_PRODUCTS.slice(0, 8),
    newArrivals: SEED_PRODUCTS.filter((p) => p.newArrival),
  };
}

export default async function HomePage() {
  const data = await fetchHomepageData();
  const cms = data.cms || DEFAULT_HOMEPAGE_CMS;
  const categories = data.categories || SEED_CATEGORIES;
  const featuredProducts = data.featuredProducts || SEED_PRODUCTS.slice(0, 8);
  const allProducts = SEED_PRODUCTS;

  return (
    <main className="flex-1 flex flex-col bg-ivory dark:bg-[#0E0C0A] text-charcoal dark:text-[#F5EFE8] transition-colors duration-300">
      {/* Global: Top Announcement Bar with Social Links */}
      <AnnouncementBar
        text={cms?.announcementBar?.text}
        link={cms?.announcementBar?.link}
        isActive={cms?.announcementBar?.isActive}
        showSocials={cms?.announcementBar?.showSocials ?? true}
        socialLinks={cms?.socialLinks}
      />

      {/* Global: Main Navigation */}
      <Navbar />

      {/* SECTION 01: Hero Carousel Showcase (3s auto-advance, Lal/Nil/Holud saree campaign) */}
      <HeroSection slides={cms?.heroSlides} cms={cms} />

      {/* SECTION 02: Brand Benefits Strip */}
      <BrandBenefitsStrip benefits={cms?.brandBenefits} />

      {/* SECTION 03: Five Handcrafted Bag Collections */}
      <CategoryGridSection categories={categories} />

      {/* SECTION 04: Customer Favourites & Bestsellers */}
      <FeaturedProductsSection products={featuredProducts} />

      {/* SECTION 05: Signature Collection Spotlight (Turned Mahogany & Woven Jacquard) */}
      <SignatureCollectionSection cms={cms?.signatureCollection} />

      {/* SECTION 06: Behind Every Bag, There Is a Story */}
      <BrandStorySection cms={cms?.brandStory} />

      {/* SECTION 07: Fresh From Our Studio — New Arrivals */}
      <NewArrivalsSection products={allProducts} />

      {/* SECTION 08: Real Stories. Real UPONTIK. (Customer Testimonials) */}
      <TestimonialsSection reviews={data.reviews} />

      {/* SECTION 09: Letters From UPONTIK (Newsletter Sign-up) */}
      <NewsletterSection cms={cms?.newsletter} />

      {/* Global: Luxury Multi-Column Footer */}
      <Footer />
    </main>
  );
}
