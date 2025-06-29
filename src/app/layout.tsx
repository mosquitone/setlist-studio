import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MUIProvider from "@/components/providers/MUIProvider";
import ApolloProviderWrapper from "@/components/providers/ApolloProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "セットリストジェネレーター v2",
  description: "あなたの楽曲を管理して、素敵なセットリストを作成しましょう",
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
            {children}
          </MUIProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
