import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import MUIProvider from '@/components/providers/MUIProvider';
import ApolloProviderWrapper from '@/components/providers/ApolloProvider';
import CSRFProvider from '@/components/providers/CSRFProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Header from '@/components/common/layout/Header';
import Footer from '@/components/common/layout/Footer';
import LoadingFallback from '@/components/common/ui/LoadingFallback';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Setlist Studio',
    default: 'Setlist Studio - バンド向けセットリスト管理ツール',
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
  metadataBase: new URL('https://setlist-studio.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Setlist Studio - バンド向けセットリスト管理ツール',
    description:
      'ステージで利用できるアーティスト向けのセットリスト作成アプリです。エクセルや手書きの時代はもう終わりです。楽曲管理から高品質なセットリスト生成まで。',
    url: 'https://setlist-studio.vercel.app',
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
    title: 'Setlist Studio - バンド向けセットリスト管理ツール',
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
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ApolloProviderWrapper>
          <MUIProvider>
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
          </MUIProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
