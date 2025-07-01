import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import MUIProvider from '@/components/providers/MUIProvider'
import ApolloProviderWrapper from '@/components/providers/ApolloProvider'
import CSRFProvider from '@/components/providers/CSRFProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import LoadingFallback from '@/components/common/LoadingFallback'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'セットリストジェネレーター v2',
  description: 'あなたの楽曲を管理して、素敵なセットリストを作成しましょう',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ApolloProviderWrapper>
          <MUIProvider>
            <CSRFProvider>
              <AuthProvider>
                <Header />
                <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
                <Footer />
              </AuthProvider>
            </CSRFProvider>
          </MUIProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  )
}
