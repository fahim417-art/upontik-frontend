import {
  fetchHomepageData,
  fetchCategories,
  fetchProducts,
} from "@/lib/server-api";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopCatalogClient } from "@/components/shop/ShopCatalogClient";

interface ShopPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    featured?: string;
    page?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [homepageData, categories] = await Promise.all([
    fetchHomepageData(),
    fetchCategories(),
  ]);

  const cms = homepageData.cms;

  const categorySlug = searchParams.category;
  const sort = searchParams.sort;
  const search = searchParams.search;
  const inStock = searchParams.inStock === "true";
  const featured = searchParams.featured === "true";
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const { products, total, totalPages } = await fetchProducts({
    categorySlug,
    sort,
    search,
    inStock: inStock || undefined,
    featured: featured || undefined,
    minPrice,
    maxPrice,
    page,
    limit: 12,
  });

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar
        text={cms?.announcementBar?.text}
        link={cms?.announcementBar?.link}
        isActive={cms?.announcementBar?.isActive}
      />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <ShopCatalogClient
          initialProducts={products}
          categories={categories}
          total={total}
          totalPages={totalPages}
          currentPage={page}
        />
      </div>

      <Footer />
    </main>
  );
}
