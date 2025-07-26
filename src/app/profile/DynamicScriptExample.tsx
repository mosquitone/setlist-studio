import { headers } from 'next/headers';
import Script from 'next/script';

/**
 * 動的ページでnonceを使用するサンプルコンポーネント
 * profileページなど、認証が必要な動的ページで使用
 */
export default async function DynamicScriptExample() {
  // middlewareで設定されたnonceを取得
  const nonce = (await headers()).get('x-nonce');

  return (
    <>
      {/* 外部スクリプトの例 */}
      <Script
        id="analytics-script"
        src="/scripts/analytics.js"
        strategy="afterInteractive"
        nonce={nonce || undefined}
      />

      {/* インラインスクリプトの例 */}
      <Script
        id="custom-script"
        strategy="afterInteractive"
        nonce={nonce || undefined}
        dangerouslySetInnerHTML={{
          __html: `
            // このスクリプトはnonceで保護されています
            console.log('Dynamic page script with nonce protection');
          `,
        }}
      />
    </>
  );
}
