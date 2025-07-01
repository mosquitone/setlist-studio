# mosquitone Emotional Setlist Studio

🎵 エモーショナルなセットリスト作成ツール

## 概要

音楽バンド向けの現代的なセットリスト生成アプリケーションです。ユーザー認証、楽曲管理、セットリスト作成機能を提供します。

## 主な機能

### 🎶 楽曲管理
- 楽曲の詳細情報（タイトル、アーティスト、キー、テンポ、演奏時間、ノート）の登録・管理
- データベースに永続保存
- 検索・フィルタリング機能

### 📝 セットリスト作成
- 登録済み楽曲からのセットリスト構築
- ドラッグ&ドロップによる楽曲順序変更
- ライブ・イベント別の管理

### 🔐 ユーザー認証
- 安全なユーザー登録・ログイン
- JWT認証による保護されたAPI
- 個人専用の楽曲・セットリスト管理

## 技術スタック

### フロントエンド・バックエンド統合
- **Next.js 15** - React フレームワーク（App Router使用）
- **TypeScript** - 型安全性
- **Material-UI v5** - モダンなUIコンポーネント
- **Apollo Client** - GraphQL状態管理

### GraphQL API (Vercel Functions)
- **Apollo Server v4** - Next.js API Routesで動作するGraphQL API
- **Type-GraphQL** - スキーマファーストAPI開発
- **Prisma** - データベースORM
- **PostgreSQL** - データベース
- **JWT** - 認証システム

## セットアップ

### 前提条件
- Node.js 20.11.1
- pnpm 10.12.1
- Docker (PostgreSQL用)

### インストール

1. リポジトリをクローン:
```bash
git clone git@github.com:mosquitone/setlist-studio.git
cd setlist-studio
```

2. 依存関係をインストール:
```bash
pnpm install
```

3. 環境変数を設定:
```bash
# .env と .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/setlist_generator"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

4. データベースを起動:
```bash
docker-compose up -d postgres
```

5. データベーススキーマを適用:
```bash
pnpm db:push
```

### 開発サーバー起動

```bash
pnpm dev
```

- アプリケーション: http://localhost:3000
- GraphQL API: http://localhost:3000/api/graphql

## 開発

### よく使用するコマンド

```bash
# 開発
pnpm dev          # 開発サーバー起動（Next.js + GraphQL API）
pnpm build        # プロダクションビルド
pnpm lint         # ESLint実行
pnpm lint:fix     # ESLint自動修正

# データベース
docker-compose up -d postgres  # PostgreSQL起動
pnpm db:studio    # Prisma Studio起動
pnpm db:push      # スキーマ適用
pnpm generate     # Prismaクライアント生成
```

### アーキテクチャ

詳細なアーキテクチャ情報は [CLAUDE.md](./CLAUDE.md) を参照してください。

## ライセンス

MIT License

---

mosquitone
