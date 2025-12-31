import type { NextConfig } from "next";

const isProd = process.env.NODE_SETTING === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/pindou', // Use repository name
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
