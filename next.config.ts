import type { NextConfig } from 'next';
import TerserPlugin from 'terser-webpack-plugin';

const nextConfig: NextConfig = {
  // Optimize for hybrid approach (static + serverless)
  output: 'standalone',

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 1 day cache
  },
  // Compress assets
  compress: true,
  webpack: (config) => {
    // 既存のminimizerを保持しつつ、TerserPluginを設定
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false,
            passes: 2,
          },
          mangle: {
            keep_classnames: true,
            keep_fnames: true,
          },
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ];
    return config;
  },
};

export default nextConfig;
