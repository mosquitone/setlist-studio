# mosquitone Emotional Setlist Studio

🎵 エモーショナルなセットリスト作成ツール

**バージョン**: 1.0.0 (2025-07)  
**ステータス**: 正式リリース

## 概要

音楽アーティスト向けの現代的なセットリスト生成アプリケーションです。Next.js + Vercel Functions によるGraphQL API統合アーキテクチャで、ユーザー認証、楽曲管理、セットリスト作成機能を提供します。

### リポジトリ構成
- **開発リポジトリ**: GitHub（このリポジトリ）- 開発・機能追加・テスト
- **デプロイリポジトリ**: GitLab（https://gitlab.com/mosquitone8/setlist-studio）- 本番デプロイ用
- **デプロイメント**: Vercelを通じてGitLabリポジトリから本番環境へ自動デプロイ

### 🛠️ 技術構成

- **フロントエンド**: Next.js 15.3.4, React 19, TypeScript 5, Material-UI v5
- **バックエンド**: GraphQL (Apollo Server 4), Prisma ORM, PostgreSQL 15
- **認証**: JWT + HttpOnly Cookie
- **ホスティング**: Vercel Platform (Static Generation + Serverless Functions)

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

### 📖 利用ガイド
- **認証不要アクセス**: `/guide` ページで登録前でもサイト機能を理解可能
- **機能比較表**: 登録・未登録ユーザーの利用可能機能を一覧表で確認
- **パブリックセットリスト**: 認証不要でのセットリスト閲覧・ダウンロード・QRコード利用
- **使い方ガイド**: 4ステップの分かりやすい使用方法説明
- **各ページ機能詳細**: ホーム、セットリスト、楽曲管理、プロフィールページの詳細説明

### 🔐 セキュリティ・認証
- **HttpOnly Cookie認証**: XSS攻撃に対して安全なJWT token管理
- **CSRF攻撃防御**: Double Submit Cookie + HMAC署名による防御
- **レート制限**: データベースベースの分散対応レート制限（開発環境は緩和設定）
- **脅威検知**: ブルートフォース攻撃・認証情報スタッフィング検知
- **リアルタイム監視**: セキュリティイベントログ・異常検知
- **IP偽装防御**: 信頼できるプロキシバリデーション
- **個人専用管理**: ユーザー別の楽曲・セットリスト管理
- **アクセス制御**: 
  - 認証が必要なページへの自動リダイレクト
  - 公開/非公開セットリストの柔軟なアクセス管理
  - 所有者のみ編集・削除可能

## 技術スタック

### 統合アーキテクチャ（Next.js + Vercel Functions）
- **Next.js 15.3.4** - React フレームワーク（App Router使用）
- **TypeScript 5** - 型安全性とコード品質
- **Material-UI v5.17.1** - モダンなUIコンポーネント + カスタムテーマ
- **Apollo Client 3.13.8** - GraphQL状態管理 + キャッシング

### GraphQL API (Vercel Functions)
- **Apollo Server v4.12.2** - Next.js API Routesで動作するGraphQL API（セキュリティ強化済み）
- **Type-GraphQL 1.1.1** - スキーマファーストAPI開発 + 事前生成スキーマ
- **Prisma 6.11.0** - 型安全データベースORM
- **PostgreSQL 15** - メインデータベース + セキュリティログ
- **HttpOnly Cookie + JWT** - XSS耐性のあるセキュア認証システム
- **Rate Limiting** - データベースベース分散レート制限（本番環境最適化済み）
- **CSRF Protection** - Double Submit Cookie + HMAC パターン
- **Threat Detection** - リアルタイム脅威検知エンジン

## 🚀 はじめに

### 登録前に試せる機能
- 📋 **利用ガイド**: `/guide` ページで全機能の詳細説明を確認
- 🔍 **パブリックセットリスト**: 他のユーザーが公開したセットリストの閲覧・ダウンロード
- 📊 **機能比較表**: 登録・未登録ユーザーで利用できる機能の違いを一覧表で確認
- 📱 **QRコード付き画像**: セットリストページへの簡単アクセス
- 🎨 **テーマ選択**: Black/Whiteテーマでの画像ダウンロード

### 使い始める方法
1. **利用ガイドを確認** - `/guide` でアプリケーションの概要を把握
2. **パブリックセットリストを体験** - 認証なしで既存のセットリストを閲覧
3. **アカウント作成** - より多くの機能を利用するため登録
4. **楽曲とセットリストの管理開始** - 個人用の楽曲ライブラリとセットリストを構築

## セットアップ

### 前提条件
- Node.js 20.11.1
- pnpm 10.12.1
- Docker (PostgreSQL用)

### インストール

1. リポジトリをクローン:
```bash
# 開発用（GitHub）
git clone git@github.com:mosquitone/setlist-studio.git
cd setlist-studio

# デプロイ用（GitLab）
git remote add gitlab git@gitlab.com:mosquitone8/setlist-studio.git
```

2. 依存関係をインストール:
```bash
pnpm install
```

3. 環境変数を設定:
```bash
cp .env.example .env.local
```

環境変数の詳細設定については [環境変数設定ガイド](./docs/claude/deployment/ENVIRONMENT_VARIABLES.md) を参照してください。

> **重要**: 
> - 必要な環境変数と設定方法の詳細は上記ガイドに記載されています
> - セキュリティ関連の環境変数は必ず強力なランダム値を使用してください

4. データベースを起動:

**初回セットアップ（推奨）**:
```bash
pnpm db:setup
```

**または手動で実行**:
```bash
docker-compose up -d postgres
```

> **初回起動時の注意**: SCRAM-SHA-256認証の初期化のため、`pnpm db:setup`を使用するか、CLAUDE.mdに記載の手動手順を実行してください。

5. データベーススキーマを適用:
```bash
pnpm db:push
```

> **注**: `pnpm db:setup`を使用した場合、この手順は自動的に実行されます。

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
pnpm build        # プロダクションビルド（GraphQLスキーマ自動生成含む）
pnpm lint         # ESLint実行
pnpm lint:fix     # ESLint自動修正

# GraphQL開発
pnpm generate:schema  # GraphQLスキーマ事前生成（パフォーマンス向上）

# データベース
docker-compose up -d postgres  # PostgreSQL起動
pnpm db:studio    # Prisma Studio起動
pnpm db:push      # スキーマ適用
pnpm generate     # Prismaクライアント生成
```

### アーキテクチャ

詳細なアーキテクチャ情報は [CLAUDE.md](./CLAUDE.md) を参照してください。

**GraphQLアーキテクチャの詳細解説**: [GRAPHQL_ARCHITECTURE.md](./docs/claude/api/GRAPHQL_ARCHITECTURE.md) で技術仕様を確認できます。初心者向けガイドは[GRAPHQL_BEGINNER_GUIDE.md](./docs/guide/api/GRAPHQL_BEGINNER_GUIDE.md)を参照してください。

### ドキュメント構造

```
docs/
├── claude/                # Claude・開発者向け技術仕様
│   ├── HISTORY.md         # プロジェクト履歴
│   ├── SECURITY.md        # セキュリティアーキテクチャ
│   ├── api/               # API関連技術仕様
│   │   ├── API_ROUTES.md
│   │   ├── EMAIL_AUTHENTICATION.md
│   │   └── GRAPHQL_ARCHITECTURE.md
│   ├── database/          # データベース関連技術仕様
│   │   ├── DATABASE_SCHEMA.md
│   │   └── PRISMA_OPTIMIZATION.md
│   ├── deployment/        # デプロイメント関連技術仕様
│   │   ├── ENVIRONMENT_VARIABLES.md
│   │   └── VERCEL_DEPLOYMENT.md
│   └── security/          # セキュリティ関連技術仕様
│       └── SECURITY_LOGGING_SYSTEM.md
└── guide/                 # 人が読むためのガイド
    ├── api/               # API関連ガイド
    │   ├── README.md
    │   ├── GRAPHQL_BEGINNER_GUIDE.md
    │   └── GRAPHQL_LIBRARIES_GUIDE.md
    ├── auth/              # 認証関連ガイド
    │   ├── README.md
    │   ├── GOOGLE_OAUTH_FLOW_GUIDE.md
    │   └── GOOGLE_OAUTH_IMPLEMENTATION_GUIDE.md
    ├── database/          # データベース関連ガイド
    │   ├── README.md
    │   ├── PRISMA_BEGINNER_GUIDE.md
    │   └── PRISMA_GRAPHQL_INTEGRATION_GUIDE.md
    ├── deployment/        # デプロイメント関連ガイド
    │   ├── README.md
    │   ├── DATABASE_MIGRATION_GUIDE.md
    │   ├── SUPABASE_OPTIMIZATION_CHECKLIST.md
    │   └── SUPABASE_RLS_SETUP_FINAL.sql
    └── security/          # セキュリティ関連ガイド
        ├── README.md
        ├── CSP_NONCE_IMPLEMENTATION_GUIDE.md
        ├── REACT_XSS_PROTECTION_GUIDE.md
        ├── SECURITY_BEGINNERS_GUIDE.md
        └── SECURITY_TEST_PLAN.md
```

### セキュリティ

本アプリケーションは包括的なセキュリティ対策を実装しています:

#### トークンベースセキュリティシステム

**🔐 JWT認証トークン**
- **保存場所**: HttpOnly Cookie (JavaScriptからアクセス不可)
- **有効期間**: 2時間（セキュリティ強化済み）
- **内容**: ユーザーID、メール、ユーザー名
- **セキュリティ**: HMAC-SHA256署名、改ざん検知
- **利用**: 全GraphQL APIの認証、自動ログイン維持

**🛡️ CSRF保護トークン**  
- **方式**: Double Submit Cookie + HMAC パターン
- **生成**: リクエスト毎の動的生成
- **配布**: Cookie + HTTPヘッダーの二重送信
- **検証**: タイミング攻撃耐性のある署名検証
- **利用**: 状態変更操作（作成・更新・削除）の保護

**⚙️ セッション管理**
- **自動ログアウト**: 2時間後またはセキュリティ違反時
- **Cookie設定**: Secure (HTTPS), SameSite=Strict, HttpOnly
- **状態同期**: リアルタイム認証状態更新
- **XSS耐性**: HttpOnly Cookieによる完全なXSS防御

#### セキュリティ機能
- **認証**: HttpOnly Cookie + JWT によるXSS耐性認証
- **CSRF保護**: Double Submit Cookie + HMAC署名
- **レート制限**: 分散対応データベースベースレート制限
- **脅威検知**: リアルタイム異常検知・自動ログ
- **監査ログ**: 全セキュリティイベントの永続化
- **Docker強化**: セキュリティ設定済みコンテナ

詳細なセキュリティ仕様は [SECURITY.md](./docs/claude/SECURITY.md) を参照してください。

## 本番デプロイ（Vercel）

### デプロイ手順

詳細なデプロイ手順は [VERCEL_DEPLOYMENT.md](./docs/claude/deployment/VERCEL_DEPLOYMENT.md) を参照してください。

### 必要な環境変数

本番環境で必要な環境変数の詳細については [環境変数設定ガイド](./docs/claude/deployment/ENVIRONMENT_VARIABLES.md) を参照してください。

主要な環境変数：
- `DATABASE_URL` - PostgreSQL接続文字列
- `JWT_SECRET` - JWT認証用シークレット
- `CSRF_SECRET` - CSRF保護用シークレット  
- `RESEND_API_KEY` - メール送信APIキー
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth設定

詳細な設定方法、セキュリティ要件、推奨ローテーション周期は上記ガイドをご確認ください。

### デプロイ時の注意事項

データベース選択、セキュリティチェックリスト、その他の詳細な注意事項については [Vercelデプロイガイド](./docs/claude/deployment/VERCEL_DEPLOYMENT.md) を参照してください。
## ライセンス

MIT License

---

mosquitone
