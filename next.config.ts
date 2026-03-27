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
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'shreeradhemarbles.in',
          },
        ],
        destination: 'https://www.shreeradhemarbles.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
