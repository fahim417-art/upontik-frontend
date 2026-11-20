const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string; [key: string]: any }> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Retrieve client token if stored in localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("upontik_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // send/receive HTTP-only session cookies across origins
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { success: false, error: "Network or JSON response error" };
  }

  if (!response.ok && !data.error) {
    data.error = `HTTP error ${response.status}`;
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    me: () => apiClient("/auth/me"),
    login: (credentials: { email: string; password: string }) =>
      apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (payload: { name: string; email: string; password: string; phone?: string }) =>
      apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    logout: () => apiClient("/auth/logout", { method: "POST" }),
  },

  // Categories
  categories: {
    getAll: () => apiClient("/categories"),
    getBySlug: (slug: string) => apiClient(`/categories/${slug}`),
  },

  // Products
  products: {
    getAll: (params?: { category?: string; sort?: string; search?: string; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set("category", params.category);
      if (params?.sort) q.set("sort", params.sort);
      if (params?.search) q.set("search", params.search);
      if (params?.limit) q.set("limit", String(params.limit));
      const queryString = q.toString() ? `?${q.toString()}` : "";
      return apiClient(`/products${queryString}`);
    },
    getBySlug: (slug: string) => apiClient(`/products/${slug}`),
    search: (query: string) => apiClient(`/products/search?q=${encodeURIComponent(query)}`),
  },

  // Homepage Data
  homepage: {
    get: () => apiClient("/homepage"),
  },

  // Store Settings
  settings: {
    get: () => apiClient("/store-settings"),
  },

  // Wishlist
  wishlist: {
    get: () => apiClient("/wishlist"),
    toggle: (productId: string) =>
      apiClient("/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
  },

  // Coupons
  coupons: {
    validate: (code: string, subtotal: number) =>
      apiClient("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({ code, subtotal }),
      }),
  },

  // Checkout & Orders
  checkout: {
    process: (payload: any) =>
      apiClient("/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  orders: {
    getById: (id: string) => apiClient(`/orders/${id}`),
    getCustomerOrders: () => apiClient("/orders"),
    cancel: (id: string, reason?: string) =>
      apiClient(`/orders/${id}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
  },

  // Reviews
  reviews: {
    create: (payload: any) =>
      apiClient("/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // Admin Portal APIs
  admin: {
    getMetrics: () => apiClient("/admin/metrics"),
    getProducts: () => apiClient("/admin/products"),
    createProduct: (data: any) =>
      apiClient("/admin/products", { method: "POST", body: JSON.stringify(data) }),
    updateProduct: (id: string, data: any) =>
      apiClient(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteProduct: (id: string) =>
      apiClient(`/admin/products/${id}`, { method: "DELETE" }),
    getCategories: () => apiClient("/admin/categories"),
    createCategory: (data: any) =>
      apiClient("/admin/categories", { method: "POST", body: JSON.stringify(data) }),
    updateCategory: (id: string, data: any) =>
      apiClient(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    getOrders: () => apiClient("/admin/orders"),
    updateOrderStatus: (id: string, status: string, trackingNumber?: string) =>
      apiClient(`/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, trackingNumber }),
      }),
    getHomepageCMS: () => apiClient("/admin/homepage-cms"),
    updateHomepageCMS: (data: any) =>
      apiClient("/admin/homepage-cms", { method: "PUT", body: JSON.stringify(data) }),
    getCustomers: () => apiClient("/admin/customers"),
    getCoupons: () => apiClient("/admin/coupons"),
    createCoupon: (data: any) =>
      apiClient("/admin/coupons", { method: "POST", body: JSON.stringify(data) }),
    updateSettings: (data: any) =>
      apiClient("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
  },
};
