import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      middlewareClientMaxBodySize: "100mb",
    },
  },
};

export default nextConfig;
