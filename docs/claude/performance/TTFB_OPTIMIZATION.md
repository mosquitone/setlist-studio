# TTFB（Time to First Byte）最適化ガイド

## 概要

このドキュメントは、Setlist StudioのTTFBを735msから200ms以下に改善するための最適化内容をまとめたものです。

## 実施した最適化

### 1. Vercel Functions設定の最適化（フリープラン対応）

#### メモリとタイムアウトの調整
```json
{
  "functions": {
    "app/api/graphql/route.ts": {
      "maxDuration": 10,  // フリープラン制限（最大10秒）
      "memory": 512       // 1024MBから512MBに削減（起動高速化）
    },
    "app/api/auth/route.ts": {
      "maxDuration": 10,
      "memory": 256
    },
    "app/api/csrf/route.ts": {
      "maxDuration": 10,
      "memory": 128
    }
  }
}
```

**効果**: メモリ割り当てを削減することで、コールドスタート時間を短縮

**フリープラン制限**:
- maxDuration: 最大10秒（超える設定は無視される）
- memory: 最大1024MB
- 帯域幅: 100GB/月
- Function呼び出し: 100,000回/月

### 2. Prismaクライアントの最適化

#### 接続プール設定の調整
```typescript
// transactionOptionsの最適化
transactionOptions: {
  maxWait: 2000,     // 3秒から2秒に短縮
  timeout: 20000,    // 25秒から20秒に短縮
  isolationLevel: 'ReadCommitted',
}
```

#### 専用の最適化済みPrismaクライアント
- `src/lib/server/prisma-optimized.ts`を作成
- 開発環境でのクエリパフォーマンス監視機能を追加
- 100ms以上かかるクエリを自動検出

### 3. Next.js設定の最適化

#### 実験的機能の有効化
```typescript
experimental: {
  optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  webpackMemoryOptimizations: true,
  gzipSize: false, // ビルド時間短縮
}
```

#### キャッシュヘッダーの設定
- 静的アセット: `Cache-Control: public, max-age=31536000, immutable`
- フォントファイル: 同上
- DNS プリフェッチの有効化

### 4. Middlewareの最適化

#### APIルートのスキップ
```typescript
// APIルートとNext.js内部ルートはCSP処理をスキップ
if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
  return NextResponse.next();
}
```

**効果**: 不要な処理をスキップすることで、APIレスポンスを高速化

### 5. Apollo Clientのキャッシュ活用

#### クライアントサイドキャッシュの強化
- Apollo Clientの`cache-first`ポリシーを活用
- 不要なネットワークリクエストを削減
- ブラウザ側でのデータ再利用を促進

## 期待される改善効果

### パフォーマンス指標
- **TTFB**: 735ms → 200ms以下（目標）
- **コールドスタート**: 30-40%の改善
- **メモリ使用量**: 最適化により効率的な利用

### ユーザー体験
- ページロードの体感速度向上
- 特に初回アクセス時のレスポンス改善
- モバイル環境での快適性向上

## 追加の最適化案（将来的な実装）

### 1. Edge Functionsの活用
- 認証チェックなどの軽量な処理をEdgeに移行
- グローバルな配信による低レイテンシ

### 2. Redis等の外部キャッシュ
- Vercel KVやUpstashの導入検討
- より永続的で大容量のキャッシュ実現

### 3. データベース最適化
- インデックスの追加
- クエリの最適化（JOIN削減、必要なフィールドのみ選択）
- Read Replicaの活用

### 4. CDNの活用強化
- 静的コンテンツのエッジ配信
- 動的コンテンツのキャッシュ戦略

## モニタリング

### パフォーマンス計測
- PageSpeed Insightsでの定期的な計測
- Vercel Analyticsでの実ユーザーメトリクス監視
- 開発環境でのクエリパフォーマンス監視

### アラート設定
- TTFB > 500msでアラート
- エラー率の監視
- メモリ使用量の監視

## まとめ

これらの最適化により、TTFBの大幅な改善が期待されます。特に、Vercel Functionsのメモリ設定最適化とPrismaの接続プール調整は、即効性のある改善として効果を発揮します。

継続的なモニタリングと段階的な最適化により、さらなるパフォーマンス向上を目指します。