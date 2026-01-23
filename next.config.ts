import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.giffywalls.in',
      },
      {
        protocol: 'https',
        hostname: 'rmsstonex.in',
      },
    ],
  },
  experimental: {
    scrollRestoration: false,
  },
};

export default nextConfig;
