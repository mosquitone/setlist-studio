# CSP Nonce実装ガイド

## 概要

このプロジェクトでは、セキュリティとパフォーマンスのバランスを考慮し、以下の方針でCSP nonceを実装しています：

- **静的ページ**（login、register、guide等）: `'unsafe-inline'` を許可
- **動的ページ**（認証必須ページ）: nonce ベースのCSP

## 実装詳細

### 1. Middleware設定（実装済み）

`middleware.ts` では、ページタイプに応じて異なるCSPポリシーを適用：

```typescript
// 静的ページの判定
const isStaticPage = [
  '/login',
  '/register',
  '/guide',
  '/privacy-policy',
  '/terms-of-service',
  '/auth/',
].some(path => pathname.startsWith(path));

// ページタイプに応じたCSP設定
const scriptSrc = isStaticPage
  ? `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://accounts.google.com`
  : `script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval'" : "'wasm-unsafe-eval'"} https://accounts.google.com`;
```

### 2. 動的ページでのnonce使用方法

#### Server Componentの場合

```typescript
import { headers } from 'next/headers';
import Script from 'next/script';

export default function DynamicPage() {
  const nonce = headers().get('x-nonce');
  
  return (
    <>
      {/* カスタムスクリプトにnonceを適用 */}
      <Script
        id="custom-script"
        nonce={nonce}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `console.log('This script is protected by nonce');`,
        }}
      />
    </>
  );
}
```

#### Client Component（'use client'）の場合

クライアントコンポーネントでは直接headersにアクセスできないため、以下の方法を使用：

1. **親のServer Componentからnonceを渡す**
```typescript
// page.tsx (Server Component)
import { headers } from 'next/headers';
import ClientComponent from './ClientComponent';

export default function Page() {
  const nonce = headers().get('x-nonce');
  return <ClientComponent nonce={nonce} />;
}

// ClientComponent.tsx
'use client';
import Script from 'next/script';

export default function ClientComponent({ nonce }: { nonce: string | null }) {
  return (
    <Script
      id="client-script"
      nonce={nonce || undefined}
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `console.log('Client component script');`,
      }}
    />
  );
}
```

2. **動的インポートを避ける**
インラインスクリプトを使用する必要がある場合は、可能な限り外部ファイルに移動。

### 3. 開発環境での考慮事項

開発環境では `'unsafe-eval'` が自動的に追加され、Next.jsの開発機能（Fast Refresh等）が正常に動作します。

### 4. 注意事項

1. **静的ページではnonceを使用しない**
   - ビルド時に生成されるため、全ユーザーが同じnonceを共有してしまう
   - セキュリティ効果がない

2. **動的レンダリングが必要**
   - nonceを使用するページは必ず動的レンダリングが必要
   - `export const dynamic = 'force-dynamic'` または 'use client' を使用

3. **JSON-LDスクリプト**
   - 現在、layoutのJSON-LDスクリプトは静的ページでも使用されるため、nonceは適用していない
   - 必要に応じて、動的ページ専用のレイアウトを作成することを検討

## セキュリティ効果

この実装により：
- 認証必須の動的ページではXSS攻撃のリスクを大幅に削減
- 静的な公開ページではパフォーマンスを維持
- 開発環境での作業効率を保持