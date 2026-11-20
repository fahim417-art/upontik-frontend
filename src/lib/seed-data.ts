export interface SeedCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface SeedProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  categorySlug: string;
  images: Array<{ url: string; alt: string; isMain: boolean }>;
  price: number;
  salePrice?: number;
  currency: string;
  stock: number;
  lowStockThreshold: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  status: "published" | "draft" | "archived";
  dimensions: { length: string; width: string; height: string };
  materials: string;
  careInstructions: string;
  variants?: Array<{ name: string; options: string[] }>;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    id: "cat_side_bag",
    name: "Side Bag",
    slug: "side-bag",
    description:
      "Sculptural crossbody and side silhouettes featuring intricate hand-woven geometric textiles and refined leatherette strap accents.",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=1000",
    displayOrder: 1,
    isActive: true,
    seoTitle: "Handcrafted Artisan Side Bags | UPONTIK",
    seoDescription:
      "Explore UPONTIK's handcrafted side bags, weaving traditional motifs into contemporary crossbody silhouettes.",
  },
  {
    id: "cat_pouch_bag",
    name: "Pouch Bag",
    slug: "pouch-bag",
    description:
      "Tactile artisanal pouches adorned with subtle tassel details, tailored zip closures, and heritage embroidery.",
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=85&w=1000",
    displayOrder: 2,
    isActive: true,
    seoTitle: "Embroidered Artisan Pouch Bags | UPONTIK",
    seoDescription:
      "Discover handcrafted textile pouches with traditional stitchwork, designed for evening elegance and daily essentials.",
  },
  {
    id: "cat_dhol_bag",
    name: "Dhol Bag",
    slug: "dhol-bag",
    description:
      "Our signature cylindrical silhouette inspired by classic folk instruments, finished with solid turned-wood handles and rich textured jacquards.",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1000",
    displayOrder: 3,
    isActive: true,
    seoTitle: "Authentic Dhol Bags with Handcrafted Wooden Handles | UPONTIK",
    seoDescription:
      "The signature UPONTIK Dhol Bag. A distinctive cylindrical architectural silhouette crafted with artisan textile weaves and turned wooden accents.",
  },
  {
    id: "cat_phone_bag",
    name: "Phone Bag",
    slug: "phone-bag",
    description:
      "Compact vertical crossbody slings engineered for effortless modern movement with card partitions and magnetic snap closures.",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=85&w=1000",
    displayOrder: 4,
    isActive: true,
    seoTitle: "Artisanal Compact Phone Bags | UPONTIK",
    seoDescription:
      "Slim, elegant phone bags handcrafted with textured weaves and discreet compartments for daily essentials.",
  },
  {
    id: "cat_tote_bag",
    name: "Tote Bag",
    slug: "tote-bag",
    description:
      "Spacious everyday carryalls blending durable natural canvas with intricate panel weaves, reinforced double straps, and interior security pockets.",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1000",
    displayOrder: 5,
    isActive: true,
    seoTitle: "Woven Textile Heritage Tote Bags | UPONTIK",
    seoDescription:
      "Spacious, enduring tote bags showcasing generational craftsmanship, reinforced structure, and modern interior organization.",
  },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  // 1. Dhol Bags
  {
    id: "prod_dhol_01",
    name: "Ochre Heritage Dhol Bag with Hand-Carved Wooden Handles",
    slug: "ochre-heritage-dhol-bag",
    sku: "UPK-DHOL-001",
    description:
      "The definitive UPONTIK signature. The Ochre Heritage Dhol Bag showcases a sculptural cylindrical silhouette framed by hand-turned mahogany wooden grab handles. The body is woven from heavyweight natural cotton threads dyed with earth-toned ochre and mustard pigments. Features dual polished brass zip pulls, a detachable woven shoulder strap, and an interior slip pocket tailored for phone and lipstick.",
    shortDescription:
      "Signature cylindrical silhouette with hand-carved mahogany wooden handles and ochre woven jacquard.",
    categorySlug: "dhol-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1000",
        alt: "Ochre Heritage Dhol Bag - Front Angle",
        isMain: true,
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=85&w=1000",
        alt: "Ochre Heritage Dhol Bag - Detail View",
        isMain: false,
      },
      {
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=1000",
        alt: "Ochre Heritage Dhol Bag - In-Hand Perspective",
        isMain: false,
      },
    ],
    price: 3450,
    salePrice: 2950,
    currency: "BDT",
    stock: 14,
    lowStockThreshold: 4,
    featured: true,
    bestSeller: true,
    newArrival: false,
    status: "published",
    dimensions: { length: "26 cm", width: "14 cm", height: "14 cm" },
    materials: "Hand-loomed cotton weave, reclaimed polished mahogany wood, brass alloy hardware",
    careInstructions:
      "Gently spot clean with a soft damp cloth. Avoid submerging wooden handles in water. Store in provided dust bag.",
    variants: [
      {
        name: "Colorway",
        options: ["Warm Ochre & Sand", "Indigo Midnight", "Terracotta Clay"],
      },
    ],
  },
  {
    id: "prod_dhol_02",
    name: "Midnight Indigo Cylindrical Dhol Bag",
    slug: "midnight-indigo-cylindrical-dhol-bag",
    sku: "UPK-DHOL-002",
    description:
      "Deep indigo textile patterns contrast against smooth natural teak ring handles. Crafted with balanced geometric loomed fabric, this Dhol Bag pairs effortlessly with contemporary evening wear or relaxed cultural ensembles.",
    shortDescription:
      "Deep indigo textured jacquard with polished round teak handles and brass accents.",
    categorySlug: "dhol-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=85&w=1000",
        alt: "Midnight Indigo Cylindrical Dhol Bag",
        isMain: true,
      },
      {
        url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1000",
        alt: "Midnight Indigo Dhol Bag - Side Profile",
        isMain: false,
      },
    ],
    price: 3600,
    currency: "BDT",
    stock: 9,
    lowStockThreshold: 3,
    featured: true,
    bestSeller: false,
    newArrival: true,
    status: "published",
    dimensions: { length: "28 cm", width: "15 cm", height: "15 cm" },
    materials: "100% Indigo-dyed artisanal cotton, hand-finished teak wood",
    careInstructions: "Spot clean only with cold water. Keep away from direct high heat.",
  },

  // 2. Side Bags
  {
    id: "prod_side_01",
    name: "Artisan Flap Crossbody Side Bag",
    slug: "artisan-flap-crossbody-side-bag",
    sku: "UPK-SIDE-001",
    description:
      "Designed for modern urban rhythms, this structured side bag integrates an intricately loomed textile front flap with magnetic brass snap fastening. An adjustable cotton webbing strap allows both shoulder drape and crossbody styling.",
    shortDescription:
      "Structured flap crossbody bag featuring heritage weave front panel and adjustable strap.",
    categorySlug: "side-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=1000",
        alt: "Artisan Flap Crossbody Side Bag",
        isMain: true,
      },
      {
        url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1000",
        alt: "Side Bag - Detail Stitching",
        isMain: false,
      },
    ],
    price: 2450,
    salePrice: 2150,
    currency: "BDT",
    stock: 18,
    lowStockThreshold: 5,
    featured: true,
    bestSeller: true,
    newArrival: false,
    status: "published",
    dimensions: { length: "22 cm", width: "7 cm", height: "18 cm" },
    materials: "Hand-spun textile canvas, reinforced cotton lining, metal magnetic hardware",
    careInstructions: "Wipe with damp cloth; do not machine wash.",
  },
  {
    id: "prod_side_02",
    name: "Terracotta Geometric Saddle Side Bag",
    slug: "terracotta-geometric-saddle-side-bag",
    sku: "UPK-SIDE-002",
    description:
      "Curved saddle silhouette adorned with earth-toned terracotta and sand diamond patterns. Features a zipped main compartment and external back quick-access pocket.",
    shortDescription:
      "Curved silhouette in warm terracotta hues with secure zip and external slip pocket.",
    categorySlug: "side-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&q=85&w=1000",
        alt: "Terracotta Geometric Saddle Side Bag",
        isMain: true,
      },
      {
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=1000",
        alt: "Saddle Bag Profile",
        isMain: false,
      },
    ],
    price: 2650,
    currency: "BDT",
    stock: 12,
    lowStockThreshold: 4,
    featured: false,
    bestSeller: false,
    newArrival: true,
    status: "published",
    dimensions: { length: "24 cm", width: "8 cm", height: "19 cm" },
    materials: "Artisan jacquard textile, brass hardware, cotton twill lining",
    careInstructions: "Spot clean gently with mild detergent solution.",
  },

  // 3. Pouch Bags
  {
    id: "prod_pouch_01",
    name: "Embroidered Tassel Wristlet Pouch",
    slug: "embroidered-tassel-wristlet-pouch",
    sku: "UPK-POUCH-001",
    description:
      "A tactile clutch and wristlet pouch with intricate hand-embroidered floral-geometric motifs, finished with a handmade thread tassel and leatherette wrist loop. Perfect for keys, cards, cosmetics, and phone.",
    shortDescription:
      "Handcrafted wristlet clutch with artisanal tassel accents and delicate embroidery.",
    categorySlug: "pouch-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=85&w=1000",
        alt: "Embroidered Tassel Wristlet Pouch",
        isMain: true,
      },
      {
        url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1000",
        alt: "Pouch Bag Close-Up",
        isMain: false,
      },
    ],
    price: 1650,
    salePrice: 1390,
    currency: "BDT",
    stock: 22,
    lowStockThreshold: 6,
    featured: true,
    bestSeller: true,
    newArrival: false,
    status: "published",
    dimensions: { length: "21 cm", width: "3 cm", height: "14 cm" },
    materials: "Fine cotton twill with thread embroidery, silky cotton tassel, YKK zipper",
    careInstructions: "Dry brush gently. Spot clean only.",
  },
  {
    id: "prod_pouch_02",
    name: "Woven Drawstring Potli Pouch",
    slug: "woven-drawstring-potli-pouch",
    sku: "UPK-POUCH-002",
    description:
      "A celebration of traditional gathering pouches. Soft gathered top with braided cords and ornamental bell tassels, crafted from heritage brocade weave.",
    shortDescription:
      "Traditional drawstring potli pouch with braided cords and bell tassels.",
    categorySlug: "pouch-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1000",
        alt: "Woven Drawstring Potli Pouch",
        isMain: true,
      },
    ],
    price: 1850,
    currency: "BDT",
    stock: 8,
    lowStockThreshold: 3,
    featured: false,
    bestSeller: false,
    newArrival: true,
    status: "published",
    dimensions: { length: "18 cm", width: "12 cm", height: "20 cm" },
    materials: "Artisanal brocade weave, cotton braided cord, metallic bell charms",
    careInstructions: "Dry clean or gentle spot wipe.",
  },

  // 4. Phone Bags
  {
    id: "prod_phone_01",
    name: "Minimalist Vertical Loomed Phone Sling",
    slug: "minimalist-vertical-loomed-phone-sling",
    sku: "UPK-PHONE-001",
    description:
      "A featherweight vertical sling tailor-fitted for modern smartphones of any screen size. Features a rear dual-card organizer sleeve, soft microfiber interior lining to protect screens, and an ultra-soft cord strap.",
    shortDescription:
      "Vertical smartphone sling with rear card slots and screen-protecting lining.",
    categorySlug: "phone-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=85&w=1000",
        alt: "Minimalist Vertical Loomed Phone Sling",
        isMain: true,
      },
      {
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=1000",
        alt: "Phone Sling Detail",
        isMain: false,
      },
    ],
    price: 1450,
    salePrice: 1250,
    currency: "BDT",
    stock: 25,
    lowStockThreshold: 5,
    featured: true,
    bestSeller: false,
    newArrival: true,
    status: "published",
    dimensions: { length: "12 cm", width: "2.5 cm", height: "19 cm" },
    materials: "Hand-loomed cotton jacquard, microfiber lining, magnetic snap",
    careInstructions: "Wipe with slightly moist cloth.",
  },
  {
    id: "prod_phone_02",
    name: "Charcoal & Ochre Dual-Pocket Phone Bag",
    slug: "charcoal-ochre-dual-pocket-phone-bag",
    sku: "UPK-PHONE-002",
    description:
      "Dual zip compartments allow separate storage for phone, passport, AirPods, and keys. Structured with reinforced sides for lasting shape retention.",
    shortDescription:
      "Dual zippered vertical compartment phone bag with structured piping.",
    categorySlug: "phone-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=85&w=1000",
        alt: "Charcoal & Ochre Dual-Pocket Phone Bag",
        isMain: true,
      },
    ],
    price: 1750,
    currency: "BDT",
    stock: 15,
    lowStockThreshold: 4,
    featured: false,
    bestSeller: true,
    newArrival: false,
    status: "published",
    dimensions: { length: "13 cm", width: "4 cm", height: "20 cm" },
    materials: "Dyed cotton canvas, antique brass zippers, webbing shoulder strap",
    careInstructions: "Spot clean only.",
  },

  // 5. Tote Bags
  {
    id: "prod_tote_01",
    name: "Heritage Inset Woven Everyday Tote",
    slug: "heritage-inset-woven-everyday-tote",
    sku: "UPK-TOTE-001",
    description:
      "Generously proportioned and masterfully engineered. Built from heavy 16oz unbleached natural canvas paired with a central inset panel of traditional multi-hued loom work. Generous drop handles sit comfortably over coats or summer attire, while the interior features a 14-inch padded laptop partition and zippered security pocket.",
    shortDescription:
      "Spacious canvas tote with handcrafted central textile panel and 14-inch laptop partition.",
    categorySlug: "tote-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1000",
        alt: "Heritage Inset Woven Everyday Tote",
        isMain: true,
      },
      {
        url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1000",
        alt: "Tote Bag Interior & Handle Detail",
        isMain: false,
      },
    ],
    price: 3850,
    salePrice: 3400,
    currency: "BDT",
    stock: 16,
    lowStockThreshold: 4,
    featured: true,
    bestSeller: true,
    newArrival: false,
    status: "published",
    dimensions: { length: "38 cm", width: "13 cm", height: "34 cm" },
    materials: "16oz raw natural cotton canvas, hand-woven tribal pattern insert, reinforced handles",
    careInstructions: "Spot clean canvas with cool water and mild soap. Air dry in shade.",
  },
  {
    id: "prod_tote_02",
    name: "Nordic Sand All-Over Jacquard Carryall",
    slug: "nordic-sand-all-over-jacquard-carryall",
    sku: "UPK-TOTE-002",
    description:
      "Full-body artisan weave with warm sand, ivory, and earth brown tones. Solid flat base allows the tote to stand upright on tables or floors.",
    shortDescription:
      "Full textured weave carryall with structured flat base and double shoulder drop.",
    categorySlug: "tote-bag",
    images: [
      {
        url: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&q=85&w=1000",
        alt: "Nordic Sand All-Over Jacquard Carryall",
        isMain: true,
      },
    ],
    price: 4200,
    currency: "BDT",
    stock: 11,
    lowStockThreshold: 3,
    featured: true,
    bestSeller: false,
    newArrival: true,
    status: "published",
    dimensions: { length: "42 cm", width: "15 cm", height: "36 cm" },
    materials: "Premium woven textile, heavy cotton webbing straps, magnetic clasp",
    careInstructions: "Spot clean only.",
  },
];

export const SEED_COUPONS = [
  {
    code: "HERITAGE10",
    discountType: "percentage" as const,
    discountValue: 10,
    minOrderValue: 2000,
    maxDiscount: 500,
    startDate: new Date("2026-01-01"),
    expiryDate: new Date("2027-12-31"),
    usageLimit: 1000,
    usedCount: 14,
    isActive: true,
  },
  {
    code: "WELCOME300",
    discountType: "fixed" as const,
    discountValue: 300,
    minOrderValue: 2500,
    startDate: new Date("2026-01-01"),
    expiryDate: new Date("2027-12-31"),
    usageLimit: 500,
    usedCount: 28,
    isActive: true,
  },
];

export const DEFAULT_HOMEPAGE_CMS = {
  announcementBar: {
    text: "Free Shipping across Bangladesh • Handmade with Love",
    link: "/shop",
    isActive: true,
    showSocials: true,
  },
  hero: {
    title: "Made By Us.\nLoved By You.",
    subtitle:
      "From our creative hands to your everyday style. Discover thoughtfully designed bags created with care and a passion for craftsmanship.",
    ctaText: "Explore Our Collection",
    ctaLink: "/shop",
    secondaryCtaText: "Watch Our Story",
    secondaryCtaLink: "/story",
    desktopImage: "/images/hero/hero-slide-red.jpg",
    mobileImage: "/images/hero/hero-slide-red.jpg",
  },
  heroSlides: [
    {
      id: "slide_1",
      eyebrow: "ARTISAN BAGS • TIMELESS HERITAGE",
      title: "Made By Us.\nLoved By You.",
      subtitle:
        "From our creative hands to your everyday style. Discover handcrafted bags woven with traditional care and modern grace.",
      ctaText: "Explore Our Collection",
      ctaLink: "/shop",
      secondaryCtaText: "Watch Our Story",
      secondaryCtaLink: "/story",
      desktopImage: "/images/hero/hero-slide-red.jpg",
      mobileImage: "/images/hero/hero-slide-red.jpg",
      isActive: true,
    },
    {
      id: "slide_2",
      eyebrow: "CRAFTED WITH HERITAGE • MODERN LIVING",
      title: "Tradition Woven\nInto Modern Living.",
      subtitle:
        "Deep indigo tones paired with artisanal mustard textures. Thoughtfully shaped for contemporary elegance and meaningful presence.",
      ctaText: "Discover Handbags",
      ctaLink: "/category/side-bag",
      secondaryCtaText: "View Collections",
      secondaryCtaLink: "/shop",
      desktopImage: "/images/hero/hero-slide-blue.jpg",
      mobileImage: "/images/hero/hero-slide-blue.jpg",
      isActive: true,
    },
    {
      id: "slide_3",
      eyebrow: "ARCHITECTURAL WOOD • NATURAL JACQUARD",
      title: "Woven Elegance.\nNaturally Inspired.",
      subtitle:
        "Artisan Dhol Bags framed by hand-turned mahogany handles and golden cotton jacquard. Crafted with devotion for everyday luxury.",
      ctaText: "Signature Collection",
      ctaLink: "/category/dhol-bag",
      secondaryCtaText: "Our Craft Story",
      secondaryCtaLink: "/story",
      desktopImage: "/images/hero/hero-slide-yellow.jpg",
      mobileImage: "/images/hero/hero-slide-yellow.jpg",
      isActive: true,
    },
  ],
  brandBenefits: [
    {
      id: "b1",
      title: "Handcrafted with Care",
      description: "Each piece shaped by skilled artisan hands",
      icon: "Hand",
    },
    {
      id: "b2",
      title: "Distinctive Designs",
      description: "Architectural shapes and heritage geometry",
      icon: "Diamond",
    },
    {
      id: "b3",
      title: "Sustainable Choice",
      description: "Natural loomed cotton & reclaimed woods",
      icon: "Leaf",
    },
    {
      id: "b4",
      title: "Dedicated Support",
      description: "Direct studio concierge across all 64 districts",
      icon: "Headphones",
    },
  ],
  brandStory: {
    eyebrow: "THE ARTISAN NARRATIVE",
    title: "Behind Every Bag, There Is a Story.",
    subtitle: "Discover the thought, creativity, and care behind our collections.",
    content:
      "At UPONTIK, each piece is born from a deep dialogue between generational artisan heritage and contemporary silhouette design. Our textile bags weave intricate patterns, natural textures, and structural wooden elements into enduring fashion statements.",
    ctaText: "Learn Our Story",
    ctaLink: "/story",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=1200",
    videoUrl: "https://www.facebook.com/share/r/1A4gbDNKhE/",
  },
  brandJourney: [
    {
      stepNumber: "01",
      title: "Designed",
      description:
        "Conceived in our studio with architectural proportions and ergonomic carry in mind.",
      icon: "Compass",
    },
    {
      stepNumber: "02",
      title: "Crafted",
      description:
        "Woven on heritage looms and paired with individually turned teak and mahogany handles.",
      icon: "Scissors",
    },
    {
      stepNumber: "03",
      title: "Quality Checked",
      description:
        "Every seam, brass zipper, and lining receives careful artisan inspection.",
      icon: "CheckCircle2",
    },
    {
      stepNumber: "04",
      title: "Ready for You",
      description:
        "Encased in an unbleached protective cotton dust bag with authenticity card.",
      icon: "Package",
    },
    {
      stepNumber: "05",
      title: "Delivered",
      description:
        "Swift, tracked dispatch directly to your hands anywhere across Bangladesh.",
      icon: "Truck",
    },
  ],
  bagFinder: {
    title: "Find Your Perfect Bag.",
    subtitle: "Not sure which bag suits your style? Let us help you discover.",
    isActive: true,
  },
  signatureCollection: {
    eyebrow: "HERITAGE ARCHITECTURE",
    title: "The UPONTIK Signature Collection",
    subtitle: "Sculptural silhouettes carved from solid teak and woven on heritage looms.",
    description:
      "Our signature Dhol Bag embodies acoustic symmetry and generational woodwork, paired with rich loomed cotton weave.",
    ctaText: "Discover Signature Pieces",
    ctaLink: "/category/dhol-bag",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1400",
    isActive: true,
  },
  lifestyleCollections: [
    {
      title: "Everyday Essentials",
      description: "Lightweight, tactile silhouettes crafted for daily movement.",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800",
      link: "/shop?collection=essentials",
    },
    {
      title: "Work & Study",
      description: "Spacious jacquard totes with reinforced double straps.",
      image:
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=800",
      link: "/shop?category=tote-bag",
    },
    {
      title: "Casual Outings",
      description: "Crossbody side bags that effortlessly carry essentials.",
      image:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=85&w=800",
      link: "/shop?category=side-bag",
    },
    {
      title: "Special Occasions",
      description: "Intricately embroidered evening pouches and architectural Dhol shapes.",
      image:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=85&w=800",
      link: "/shop?category=pouch-bag",
    },
    {
      title: "Thoughtful Gifts",
      description: "Curated heirloom bags wrapped in bespoke cotton gift parcels.",
      image:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=800",
      link: "/shop?collection=gifts",
    },
  ],
  teamStory: {
    eyebrow: "THE ATELIER",
    title: "Meet the People Behind the Brand.",
    subtitle: "Generational weavers, wood carvers, and modern textile designers.",
    content:
      "UPONTIK brings together master craftspeople who have spent decades perfecting the art of loom weaving and wood turning with contemporary accessories designers who understand modern daily needs.",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=85&w=1200",
    isActive: true,
  },
  videos: [
    {
      id: "v1",
      title: "Turning Solid Mahogany Handles on the Lathe",
      description: "Witness the craft behind our signature Dhol Bag handles.",
      category: "Making Process",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=800",
      isFeatured: true,
    },
    {
      id: "v2",
      title: "Autumn / Winter Textile Weaving in the Studio",
      description: "Generational loom techniques woven into contemporary fashion.",
      category: "Behind the Scenes",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=800",
      isFeatured: false,
    },
    {
      id: "v3",
      title: "The Signature Dhol Bag: Styling & Proportion",
      description: "How to carry our most iconic silhouette from dawn to evening.",
      category: "Product Showcase",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800",
      isFeatured: false,
    },
  ],
  careGuides: [
    {
      material: "Hand-Loomed Cotton",
      title: "Caring for Woven Cotton Textiles",
      tips: [
        "Spot clean immediately with a damp cotton cloth and mild cold water.",
        "Do not machine wash or tumble dry to preserve weave tension.",
        "Store in the provided breathable dust bag when not in use.",
      ],
    },
    {
      material: "Reclaimed Teak & Mahogany",
      title: "Preserving Hand-Turned Wooden Handles",
      tips: [
        "Keep handles away from prolonged exposure to intense heat or rain.",
        "Gently massage with a drop of organic beeswax or coconut oil annually to restore natural wood sheen.",
        "Avoid chemical cleansers or alcohol-based wipes on wooden accents.",
      ],
    },
    {
      material: "Brass Alloy Hardware",
      title: "Maintaining Lustrous Metallic Fittings",
      tips: [
        "Wipe zippers and strap D-rings with a dry microfiber cloth.",
        "Avoid spraying perfume or alcohol-based sanitizers directly onto metal parts.",
      ],
    },
  ],
  giftSection: {
    eyebrow: "BESPOKE GIFTING",
    title: "A Thoughtful Gift, Made Special.",
    subtitle: "Present the timeless beauty of handcrafted art to those you cherish.",
    description:
      "Every gift order is packaged in our signature cotton dust bag with an artisan certificate of authenticity and optional handwritten calligraphy note.",
    ctaText: "Explore Gift Collection",
    ctaLink: "/shop?collection=gifts",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=1200",
    isActive: true,
  },
  socialLinks: {
    facebook: "https://www.facebook.com/share/1CYhYuFu83/",
    instagram: "https://instagram.com/upontik",
    youtube: "https://youtube.com/@upontik",
    whatsapp: "https://wa.me/8801917720875",
    whatsappNumber: "+8801917720875",
    defaultMessage: "Hello UPONTIK! I would like to inquire about your handcrafted bag collection.",
  },
  finalCta: {
    title: "Your Next Favourite Bag Is Waiting.",
    description:
      "Explore the UPONTIK collection and find a design that becomes part of your everyday story.",
    ctaText: "Explore the Collection",
    ctaLink: "/shop",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1600",
    isActive: true,
  },
  campaign: {
    title: "The Heritage Edit",
    subtitle: "Artisan Autumn / Winter Series",
    description:
      "A master curation of cylindrical Dhol Bags, loomed saddle bags, and tactile clutches featuring hand-carved mahogany wood and earth-derived dye palettes.",
    ctaText: "Shop The Heritage Edit",
    ctaLink: "/shop",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1600",
    isActive: true,
  },
  brandValues: [
    {
      title: "Thoughtful Craftsmanship",
      description: "Every stitch, handle, and tassel is meticulously assembled by skilled artisan hands.",
      icon: "Sparkles",
    },
    {
      title: "Distinctive Designs",
      description: "Unique silhouettes like our signature Dhol Bag celebrate cultural geometry.",
      icon: "Layers",
    },
    {
      title: "Made With Care",
      description: "Small-batch production ensuring uncompromising attention to every woven thread.",
      icon: "ShieldCheck",
    },
    {
      title: "Customer Experience",
      description: "From luxurious packaging to personal assistance, your satisfaction is paramount.",
      icon: "HeartHandshake",
    },
  ],
  instagramGallery: [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=600",
      caption: "The Ochre Dhol Bag in morning light.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=600",
      caption: "Urban afternoon styling with our Side Crossbody.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=85&w=600",
      caption: "Details that matter: hand-knotted tassel accents.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=600",
      caption: "Generous capacity, timeless aesthetic: The Heritage Tote.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=85&w=600",
      caption: "Compact simplicity for everyday movement.",
      permalink: "https://instagram.com/upontik",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=85&w=600",
      caption: "Behind the design table: wood meets woven textile.",
      permalink: "https://instagram.com/upontik",
    },
  ],
  newsletter: {
    title: "Stay Inspired. Stay Connected.",
    subtitle:
      "Join our inner circle for previews of limited artisan releases, cultural textile stories, and exclusive studio invitations.",
  },
};
