# UPONTIK — Premium Artisan Bag E-Commerce (Frontend)

Artisan handcrafted luxury bag e-commerce web application designed with editorial aesthetics, live order tracking, and high performance.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS keyframes
- **State Management**: React Context (`StoreContext`)

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your backend API URL:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

## Key Features
- **Editorial Brand Experience**: Artisan-themed warm aesthetic with interactive hero carousel and editorial collections.
- **Shop & Filtering**: Real-time filtering by category (Side Bag, Pouch Bag, Dhol Bag, Phone Bag, Tote Bag), sorting, and search.
- **Cart & Instant Checkout**: Real-time stock verification, coupon code deduction, and delivery fee calculation.
- **Live Order Tracking**: 5-stage visual progress milestone tracker with courier tracking and WhatsApp support.
- **Admin Management Portal**: Orders, product catalog, categories, inventory, and CMS management.
