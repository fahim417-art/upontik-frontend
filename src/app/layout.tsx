import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/shop/SearchModal";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UPONTIK — Premium Handcrafted Bags & Textile Accessories",
  description:
    "Discover UPONTIK's handcrafted bags, weaving cultural heritage, tactile textile patterns, and contemporary silhouette design together. Featuring our signature Dhol Bag, Side Bag, Pouch, Phone, and Tote bags.",
  keywords: [
    "UPONTIK",
    "Handcrafted Bags",
    "Dhol Bag",
    "Side Bag",
    "Pouch Bag",
    "Phone Bag",
    "Tote Bag",
    "Textile Accessories",
    "Artisan Bags Bangladesh",
    "Wooden Handle Bag",
  ],
  authors: [{ name: "UPONTIK Studio" }],
  openGraph: {
    title: "UPONTIK — Tradition, Woven Into Modern Living",
    description:
      "Handcrafted bags and textile accessories bringing cultural heritage and contemporary silhouette design together.",
    siteName: "UPONTIK",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-ivory text-charcoal min-h-screen flex flex-col font-sans antialiased">
        <StoreProvider>
          {children}
          <ToastContainer />
          <CartDrawer />
          <SearchModal />
        </StoreProvider>
      </body>
    </html>
  );
}
