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

# メール配信システム（必須）
RESEND_API_KEY="your-resend-api-key-here"
RESEND_FROM_EMAIL="onboarding@resend.dev"

# メール認証用シークレット（32文字以上）
EMAIL_VERIFICATION_SECRET="your-email-verification-secret-here"
PASSWORD_RESET_SECRET="your-password-reset-secret-here"

# Google OAuth設定（必須）
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NextAuth設定
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-same-as-jwt-secret"
```

> **セキュリティ注意**: 
> - 本番環境では必ず強力で異なる秘密鍵を設定してください
> - 全てのシークレットは異なる値にしてください
> - シークレット生成方法: `openssl rand -base64 32` (IP_HASH_SALTは`openssl rand -base64 16`)
> - Google OAuth設定はGoogle Cloud Consoleで取得してください
> - Resend APIキーはResendダッシュボードで取得してください

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

**GraphQLアーキテクチャの詳細解説**: [GraphQL-Architecture-Guide.md](./docs/api/graphql/GraphQL-Architecture-Guide.md) でレストラン比喩を使った分かりやすい解説を提供しています。

### ドキュメント構造

```
docs/
├── api/                    # API関連ドキュメント
│   ├── API_ROUTES.md      # REST APIエンドポイント詳細
│   └── graphql/           # GraphQL専門ドキュメント
│       ├── GraphQL-Architecture-Guide.md    # アーキテクチャガイド
│       ├── GraphQL-Beginner-Guide.md        # 初心者向けガイド
│       └── GraphQL-Libraries-Guide.md       # ライブラリ詳細
├── deployment/            # デプロイ・運用関連
│   ├── VERCEL_DEPLOYMENT_GUIDE.md          # Vercelデプロイガイド
│   ├── SUPABASE_OPTIMIZATION_CHECKLIST.md  # Supabase最適化
│   └── SUPABASE_RLS_SETUP_FINAL.sql        # RLS設定
├── development/           # 開発関連
│   └── PRISMA_OPTIMIZATION_GUIDE.md        # Prisma最適化
├── security/              # セキュリティ関連
│   ├── SECURITY.md                         # セキュリティアーキテクチャ
│   └── SECURITY_TEST_PLAN.md               # セキュリティテストプラン
└── project/               # プロジェクト管理
    └── HISTORY.md                          # 更新履歴
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

詳細なセキュリティ仕様は [SECURITY.md](./docs/security/SECURITY.md) を参照してください。

## 本番デプロイ（Vercel）

### デプロイ手順

詳細なデプロイ手順は [VERCEL_DEPLOYMENT_GUIDE.md](./docs/deployment/VERCEL_DEPLOYMENT_GUIDE.md) を参照してください。

### 必要な環境変数

| 環境変数名 | 説明 | 必須 | 有効期限 | 生成方法 |
|-----------|------|------|----------|----------|
| `DATABASE_URL` | PostgreSQL接続文字列 | ✅ | 永続 | データベースプロバイダーから取得 |
| `JWT_SECRET` | JWT認証用シークレット (HMAC-SHA256署名) | ✅ | 2時間 | `openssl rand -base64 32` |
| `CSRF_SECRET` | CSRF保護用シークレット (JWT_SECRETと異なる値) | ✅ | リクエスト毎 | `openssl rand -base64 32` |
| `IP_HASH_SALT` | IPアドレス匿名化用ソルト (ログ保護) | ✅ | 永続 | `openssl rand -base64 16` |
| `CRON_SECRET` | Cronジョブ認証用シークレット (自動削除) | ✅ | 永続 | `openssl rand -base64 32` |
| `NODE_ENV` | 実行環境 | ❌ | 永続 | Vercelが自動設定 |

#### 🔒 トークンセキュリティ要件

**必須事項**:
- 全てのシークレットは**32文字以上**の強力なランダム文字列
- `JWT_SECRET`と`CSRF_SECRET`は**必ず異なる値**を使用
- 本番環境では`.env.example`の値を**絶対に使用しない**

**トークン利用シーン**:
- **JWT_SECRET**: ユーザーログイン時のトークン署名・検証
- **CSRF_SECRET**: フォーム送信・データ変更時の攻撃防御
- **IP_HASH_SALT**: セキュリティログでのプライバシー保護
- **CRON_SECRET**: 自動メンテナンス処理の認証

**推奨ローテーション**:
- JWT/CSRF シークレット: 3-6ヶ月毎
- その他: 年次または侵害発生時

### データベース選択肢
- **Vercel Postgres**: Vercel統合が最も簡単（推奨）
- **Supabase**: 無料枠が充実
- **Neon**: サーバーレスPostgreSQL
- **Railway**: シンプルな管理画面

### セキュリティチェックリスト
- [ ] 全てのシークレット環境変数が異なる値に設定されている
- [ ] シークレットが32文字以上（IP_HASH_SALTは16文字以上）
- [ ] データベース接続がSSL/TLSを使用している
- [ ] Google OAuth設定が正しく構成されている
- [ ] Resendメール設定が正しく構成されている
- [ ] Vercel Cron Jobsが設定されている（`/api/cron/cleanup`）

### 注意事項
- `docker-compose.yml`はローカル開発専用
- 本番環境ではマネージドデータベースサービスを使用
- セキュリティ設定は全てデータベースベースで動作
- Google OAuthとResendメール機能は必須設定
- 環境変数の合計サイズは64KB以下に収める
## ライセンス

MIT License

---

mosquitone
