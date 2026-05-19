import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1GB"
    }
  },
  compress: false,
  output: 'export'
};

export default nextConfig;
