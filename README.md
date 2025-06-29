# セットリストジェネレーター v2

🎵 プロフェッショナルなセットリスト作成ツール

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

### フロントエンド
- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全性
- **Material-UI v7** - モダンなUIコンポーネント
- **Apollo Client** - GraphQL状態管理

### バックエンド
- **Apollo Server Express** - GraphQL API
- **Type-GraphQL** - スキーマファーストAPI
- **Prisma** - データベースORM
- **PostgreSQL** - データベース
- **JWT** - 認証

## セットアップ

### 前提条件
- Node.js 20.11.1
- pnpm 10.12.1
- Docker (PostgreSQL用)

### インストール

1. リポジトリをクローン:
```bash
git clone git@github.com:chikarautsumi/setlist-generator-next.git
cd setlist-generator-next
```

2. 依存関係をインストール:
```bash
pnpm install
cd graphql-server && pnpm install
```

3. 環境変数を設定:
```bash
# graphql-server/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/setlist_generator"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

4. データベースを起動:
```bash
docker-compose up -d postgres
```

5. データベーススキーマを適用:
```bash
cd graphql-server && pnpm db:push
```

### 開発サーバー起動

1. GraphQLサーバーを起動:
```bash
cd graphql-server && pnpm dev
```

2. フロントエンドを起動:
```bash
pnpm dev
```

- フロントエンド: http://localhost:3000
- GraphQL Playground: http://localhost:4000/graphql

## 開発

### よく使用するコマンド

```bash
# フロントエンド開発
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm lint         # ESLint実行

# データベース
docker-compose up -d postgres  # PostgreSQL起動
cd graphql-server && pnpm db:studio  # Prisma Studio起動
cd graphql-server && pnpm db:push    # スキーマ適用

# GraphQLサーバー
cd graphql-server && pnpm dev     # 開発サーバー起動
cd graphql-server && pnpm build   # ビルド
```

### アーキテクチャ

詳細なアーキテクチャ情報は [CLAUDE.md](./CLAUDE.md) を参照してください。

## ライセンス

MIT License

---

mosquitone
