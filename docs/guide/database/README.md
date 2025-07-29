# データベース関連ガイド

このディレクトリには、データベースとPrismaに関するガイドが含まれています。

## ドキュメント一覧

### 基本ガイド
- [Prisma初心者ガイド](./PRISMA_BEGINNER_GUIDE.md) - 魔法使いの比喩で学ぶPrisma
- [PrismaとGraphQL統合ガイド](./PRISMA_GRAPHQL_INTEGRATION_GUIDE.md) - 実践的な統合方法

## 関連する技術仕槕
- [データベーススキーマ定義](../../claude/database/DATABASE_SCHEMA.md) - 全テーブルの詳細説明
- [Prisma接続最適化](../../claude/database/PRISMA_OPTIMIZATION.md) - パフォーマンス最適化

## データベース構成

### 使用技術
- **PostgreSQL 15**: メインデータベース
- **Prisma ORM**: TypeScript向けデータベースツールキット
- **Docker**: ローカル開発環境

### 主要テーブル
1. **User**: ユーザー情報と認証データ
2. **Song**: 楽曲情報（タイトル、アーティスト、キー、テンポ等）
3. **Setlist**: セットリスト情報
4. **SetlistItem**: セットリストと楽曲の関連

### セキュリティ関連テーブル
- **SecurityEvent**: セキュリティイベントログ
- **AuditLog**: 監査ログ
- **RateLimitEntry**: レート制限管理

## 学習の進め方

1. **Prisma初心者**
   - 「Prisma初心者ガイド」で基本概念を理解
   - 技術仕槕「データベーススキーマ定義」で実際の構造を確認

2. **GraphQLとの統合**
   - 「PrismaとGraphQL統合ガイド」で実装方法を学習
   - Type-GraphQLとの連携を理解

3. **パフォーマンス最適化**
   - 基本的な実装ができたら「Prisma接続最適化」へ

## 開発コマンド

```bash
# Prismaクライアント生成
pnpm generate

# データベーススキーマ確認
pnpm db:studio

# マイグレーション作成
pnpm db:migrate

# スキーマ変更を即座に反映（開発用）
pnpm db:push
```