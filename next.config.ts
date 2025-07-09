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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' 'unsafe-eval'`,
              "style-src 'self' 'unsafe-inline'", // Material-UIのため一時的に保持
              "img-src 'self' data: https: blob:", // 画像生成とQRコードのため
              "font-src 'self' data:",
              "connect-src 'self'", // API通信を自身のドメインに制限
              "object-src 'none'", // プラグイン無効化
              "base-uri 'self'", // base要素制限
              "form-action 'self'", // フォーム送信先制限
              "frame-ancestors 'none'", // クリックジャッキング対策
              // Production環境でのみHTTPS強制を適用
              ...(process.env.NODE_ENV === 'production'
                ? [
                    'block-all-mixed-content', // HTTPS強制
                    'upgrade-insecure-requests', // HTTP→HTTPS自動アップグレード
                  ]
                : []),
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
