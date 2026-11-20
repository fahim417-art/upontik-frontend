/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  poweredByHeader: false,
  async rewrites() {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const cleanUrl = rawUrl.replace(/\/+$/, "");
    const backendUrl = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
