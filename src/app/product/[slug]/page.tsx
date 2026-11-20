import { notFound } from "next/navigation";
import {
  fetchProductBySlug,
  fetchCategoryBySlug,
  fetchHomepageData,
} from "@/lib/server-api";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailsClient } from "@/components/product/ProductDetailsClient";

interface ProductPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps) {
  const result = await fetchProductBySlug(params.slug);
  if (!result || !result.product) return { title: "Piece Not Found | UPONTIK" };

  const product = result.product;
  const mainImage =
    product.images?.find((img: any) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    "";

  return {
    title: product.seoTitle || `${product.name} | UPONTIK Artisan Bags`,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: [{ url: mainImage }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const result = await fetchProductBySlug(slug);

  if (!result || !result.product) {
    notFound();
  }

  const { product, relatedProducts, reviews } = result;

  const [homepageData, category] = await Promise.all([
    fetchHomepageData(),
    fetchCategoryBySlug(product.categorySlug || "dhol-bag"),
  ]);

  const cms = homepageData.cms;

  // Product structured data (Schema.org / JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img: any) => img.url),
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "UPONTIK",
    },
    offers: {
      "@type": "Offer",
      url: `https://upontik.com/product/${product.slug}`,
      priceCurrency: product.currency || "BDT",
      price: product.salePrice && product.salePrice > 0 ? product.salePrice : product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AnnouncementBar
        text={cms?.announcementBar?.text}
        link={cms?.announcementBar?.link}
        isActive={cms?.announcementBar?.isActive}
      />
      <Navbar />

      <ProductDetailsClient
        product={product}
        category={category}
        relatedProducts={relatedProducts}
        initialReviews={reviews}
      />

      <Footer />
    </main>
  );
}
