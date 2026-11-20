"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sku: string;
  quantity: number;
  categorySlug?: string;
  selectedVariant?: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  addresses?: any[];
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface StoreContextType {
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;

  // Auth
  user: UserProfile | null;
  isLoadingUser: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;

  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Day & Night Mode Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Theme State (Day / Night Mode)
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("upontik_theme") as "light" | "dark" | null;
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setThemeState("dark");
        document.documentElement.classList.add("dark");
      }
    } catch {}
  }, []);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("upontik_theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {}
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    showToast(nextTheme === "dark" ? "Night Mode Activated • রাতের মোড চালু" : "Day Mode Activated • দিনের মোড চালু", "info");
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load cart & wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("upontik_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem("upontik_wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch {
      // Local storage unreadable in strict privacy mode
    }
    refreshUser();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("upontik_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("upontik_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const refreshUser = async () => {
    try {
      setIsLoadingUser(true);
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setUser(null);
      showToast("You have been signed out.", "info");
    } catch {
      showToast("Failed to sign out.", "error");
    }
  };

  // Cart Handlers
  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.selectedVariant === newItem.selectedVariant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    showToast(`Added "${newItem.name}" to your shopping bag.`);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.selectedVariant === variant)
      )
    );
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    variant?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedVariant === variant) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Handlers
  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = async (productId: string) => {
    const isPresent = wishlist.includes(productId);
    let nextWishlist: string[];

    if (isPresent) {
      nextWishlist = wishlist.filter((id) => id !== productId);
      showToast("Removed piece from your wishlist.", "info");
    } else {
      nextWishlist = [...wishlist, productId];
      showToast("Saved piece to your wishlist.", "success");
    }

    setWishlist(nextWishlist);

    // If user is authenticated, sync with server
    if (user) {
      try {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId }),
        });
      } catch {}
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        user,
        isLoadingUser,
        setUser,
        logout,
        refreshUser,
        toasts,
        showToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
