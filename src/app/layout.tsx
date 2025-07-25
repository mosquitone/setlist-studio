import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';

import Footer from '@/components/common/layout/Footer';
import Header from '@/components/common/layout/Header';
import LoadingFallback from '@/components/common/ui/LoadingFallback';
import ApolloProviderWrapper from '@/components/providers/ApolloProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import CSRFProvider from '@/components/providers/CSRFProvider';
import { I18nProvider } from '@/components/providers/I18nProvider';
import MUIProvider from '@/components/providers/MUIProvider';
import NextAuthProvider from '@/components/providers/NextAuthProvider';
import { SnackbarProvider } from '@/components/providers/SnackbarProvider';
import { getPublicUrl } from '@/lib/config/url';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/metadata/pageSchemas';

const inter = Inter({ subsets: ['latin'] });

// Dynamic metadata will be handled by individual pages
// This is the fallback metadata
export const metadata: Metadata = {
  title: {
    template: '%s | Setlist Studio',
    default: 'Setlist Studio - アーティスト向けセットリスト管理ツール',
  },
  description:
    'ステージで利用できるアーティスト向けのセットリスト作成アプリです。エクセルや手書きの時代はもう終わりです。楽曲管理から高品質なセットリスト生成まで。',
  keywords: [
    'セットリスト',
    'バンド',
    '楽曲管理',
    'ライブ',
    'コンサート',
    'ミュージシャン',
    '音楽',
    'パフォーマンス',
    'セットリスト作成',
    'mosquitone',
  ],
  authors: [{ name: 'mosquitone' }],
  creator: 'mosquitone',
  publisher: 'mosquitone',
  metadataBase: new URL(getPublicUrl()),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Setlist Studio - アーティスト向けセットリスト管理ツール',
    description:
      'ステージで利用できるアーティスト向けのセットリスト作成アプリです。エクセルや手書きの時代はもう終わりです。楽曲管理から高品質なセットリスト生成まで。',
    url: getPublicUrl(),
    siteName: 'Setlist Studio',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/setlist-studio-logo.png',
        width: 1200,
        height: 630,
        alt: 'Setlist Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Setlist Studio - アーティスト向けセットリスト管理ツール',
    description:
      'ステージで利用できるアーティスト向けのセットリスト作成アプリです。エクセルや手書きの時代はもう終わりです。楽曲管理から高品質なセットリスト生成まで。',
    images: ['/setlist-studio-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();

  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="manifest" href="/manifest.json" />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <I18nProvider>
            <ApolloProviderWrapper>
              <MUIProvider>
                <SnackbarProvider>
                  <CSRFProvider>
                    <AuthProvider>
                      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Header />
                        <main style={{ flex: 1 }}>
                          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
                        </main>
                        <Footer />
                      </div>
                    </AuthProvider>
                  </CSRFProvider>
                </SnackbarProvider>
              </MUIProvider>
            </ApolloProviderWrapper>
          </I18nProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
