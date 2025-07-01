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
- 画像生成機能（黒・白テーマ対応）
- QRコード付きセットリスト画像
- セットリスト複製機能

### 🔐 セキュリティ・認証
- **マルチレイヤー認証**: JWT + HttpOnly Cookie によるセキュアな認証
- **CSRF攻撃防御**: Double Submit Cookie + HMAC署名による防御
- **レート制限**: データベースベースの分散対応レート制限
- **脅威検知**: ブルートフォース攻撃・認証情報スタッフィング検知
- **リアルタイム監視**: セキュリティイベントログ・異常検知
- **IP偽装防御**: 信頼できるプロキシバリデーション
- **個人専用管理**: ユーザー別の楽曲・セットリスト管理

## 技術スタック

### フロントエンド・バックエンド統合
- **Next.js 15** - React フレームワーク（App Router使用）
- **TypeScript** - 型安全性
- **Material-UI v5** - モダンなUIコンポーネント
- **Apollo Client** - GraphQL状態管理

### GraphQL API (Vercel Functions)
- **Apollo Server v4** - Next.js API Routesで動作するGraphQL API（セキュリティ強化済み）
- **Type-GraphQL** - スキーマファーストAPI開発
- **Prisma** - データベースORM
- **PostgreSQL** - メインデータベース + セキュリティログ
- **JWT + HttpOnly Cookie** - 多層認証システム
- **Rate Limiting** - データベースベース分散レート制限
- **CSRF Protection** - Double Submit Cookie パターン
- **Threat Detection** - リアルタイム脅威検知エンジン

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
cp .env.example .env.local
```

環境変数ファイル（`.env.local`）を編集:
```bash
# データベース接続
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/setlist_generator"

# 認証用シークレット（32文字以上の強力なランダム文字列に変更）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# セキュリティ用シークレット（全て異なる値に設定）
CSRF_SECRET="your-csrf-secret-key-different-from-jwt"
IP_HASH_SALT="unique-salt-for-ip-address-hashing"
CRON_SECRET="secret-for-vercel-cron-job-authentication"

# Docker PostgreSQL パスワード（ローカル開発用）
POSTGRES_PASSWORD="postgres"
```

> **セキュリティ注意**: 
> - 本番環境では必ず強力で異なる秘密鍵を設定してください
> - JWT_SECRET、CSRF_SECRET、IP_HASH_SALT、CRON_SECRETは全て異なる値にしてください
> - シークレット生成方法: `openssl rand -base64 32`

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

### セキュリティ

本アプリケーションは包括的なセキュリティ対策を実装しています:

- **認証**: JWT + HttpOnly Cookie による多層認証
- **CSRF保護**: Double Submit Cookie + HMAC署名
- **レート制限**: 分散対応データベースベースレート制限
- **脅威検知**: リアルタイム異常検知・自動ログ
- **監査ログ**: 全セキュリティイベントの永続化
- **Docker強化**: セキュリティ設定済みコンテナ

詳細なセキュリティ仕様は [CLAUDE.md](./CLAUDE.md#security-architecture-2025-07-01) を参照してください。

## 本番デプロイ（Vercel）

### デプロイ手順

詳細なデプロイ手順は [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) を参照してください。

### 必要な環境変数

| 環境変数名 | 説明 | 必須 | 生成方法 |
|-----------|------|------|----------|
| `DATABASE_URL` | PostgreSQL接続文字列 | ✅ | データベースプロバイダーから取得 |
| `JWT_SECRET` | JWT認証用シークレット | ✅ | `openssl rand -base64 32` |
| `CSRF_SECRET` | CSRF保護用シークレット | ✅ | `openssl rand -base64 32` |
| `IP_HASH_SALT` | IPアドレスハッシュ用ソルト | ✅ | `openssl rand -base64 16` |
| `CRON_SECRET` | Cronジョブ認証用シークレット | ✅ | `openssl rand -base64 32` |
| `NODE_ENV` | 実行環境 | ❌ | Vercelが自動設定 |

### データベース選択肢
- **Vercel Postgres**: Vercel統合が最も簡単（推奨）
- **Supabase**: 無料枠が充実
- **Neon**: サーバーレスPostgreSQL
- **Railway**: シンプルな管理画面

### セキュリティチェックリスト
- [ ] 全ての環境変数が異なる値に設定されている
- [ ] シークレットが32文字以上（IP_HASH_SALTは16文字以上）
- [ ] データベース接続がSSL/TLSを使用している
- [ ] Vercel Cron Jobsが設定されている（`/api/cron/cleanup`）

### 注意事項
- `docker-compose.yml`はローカル開発専用
- 本番環境ではマネージドデータベースサービスを使用
- セキュリティ設定は全てデータベースベースで動作
- 環境変数の合計サイズは64KB以下に収める
## ライセンス

MIT License

---

mosquitone
