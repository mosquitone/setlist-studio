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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

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
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS for initial render */
              html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif}body{margin:0;padding:0;min-height:100vh}header{position:sticky;top:0;z-index:1100;background-color:#fff;box-shadow:0 2px 4px rgba(0,0,0,.1);height:64px}main{flex:1;display:block}.loading-spinner{display:inline-block;width:40px;height:40px;border:3px solid rgba(0,0,0,.1);border-radius:50%;border-top-color:#1976d2;animation:spin 1s ease-in-out infinite}@keyframes spin{to{transform:rotate(360deg)}}.MuiContainer-root{width:100%;margin-left:auto;margin-right:auto;padding-left:16px;padding-right:16px}h1,h2,h3,h4,h5,h6{margin:0;font-weight:500}a{color:#1976d2;text-decoration:none}
            `,
          }}
        />
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
