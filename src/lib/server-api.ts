import {
  DEFAULT_HOMEPAGE_CMS,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
} from "./seed-data";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchHomepageData() {
  try {
    const res = await fetch(`${BACKEND_URL}/homepage`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {
    // Backend offline / build pre-render fallback
  }

  return {
    cms: DEFAULT_HOMEPAGE_CMS,
    categories: SEED_CATEGORIES,
    featuredProducts: SEED_PRODUCTS.slice(0, 8),
  };
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${BACKEND_URL}/categories`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {}

  return SEED_CATEGORIES;
}

export async function fetchCategoryBySlug(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/categories/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {}

  return SEED_CATEGORIES.find((c) => c.slug === slug) || null;
}

export async function fetchProducts(params: {
  categorySlug?: string;
  sort?: string;
  search?: string;
  inStock?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const q = new URLSearchParams();
    if (params.categorySlug) q.set("category", params.categorySlug);
    if (params.sort) q.set("sort", params.sort);
    if (params.search) q.set("search", params.search);
    if (params.inStock) q.set("inStock", "true");
    if (params.featured) q.set("featured", "true");
    if (params.minPrice) q.set("minPrice", String(params.minPrice));
    if (params.maxPrice) q.set("maxPrice", String(params.maxPrice));
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));

    const res = await fetch(`${BACKEND_URL}/products?${q.toString()}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return {
          products: json.data,
          total: json.meta?.total || json.data.length,
          totalPages: json.meta?.totalPages || 1,
        };
      }
    }
  } catch {}

  let items = [...SEED_PRODUCTS];
  if (params.categorySlug) {
    items = items.filter((p) => p.categorySlug === params.categorySlug);
  }
  if (params.featured) {
    items = items.filter((p) => p.featured);
  }
  return {
    products: items,
    total: items.length,
    totalPages: 1,
  };
}

export async function fetchProductBySlug(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/products/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          product: json.data.product || json.data,
          relatedProducts: json.data.relatedProducts || [],
          reviews: json.data.reviews || [],
        };
      }
    }
  } catch {}

  const prod = SEED_PRODUCTS.find((p) => p.slug === slug);
  if (!prod) return null;

  const related = SEED_PRODUCTS.filter(
    (p) => p.categorySlug === prod.categorySlug && p.slug !== prod.slug
  ).slice(0, 4);

  return {
    product: prod,
    relatedProducts: related,
    reviews: [],
  };
}

export async function fetchOrderById(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/orders/${id}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {}

  return null;
}
