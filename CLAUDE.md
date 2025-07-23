# CLAUDE.md

このファイルは、Claude Code（claude.ai/code）がこのリポジトリでコード作業を行う際のガイダンスを提供します。

## プロジェクト概要

mosquitone Emotional Setlist Studioは、音楽バンド向けのモダンなセットリスト生成アプリケーションです。ユーザー認証、楽曲管理、セットリスト作成機能を備えています。Vercel Functionsを活用したGraphQL APIルートを持つ統一されたNext.jsアーキテクチャを使用し、本番環境デプロイ対応済みです。

### リポジトリ構成
- **開発リポジトリ**: GitHub（このリポジトリ）
- **デプロイリポジトリ**: GitLab（https://gitlab.com/mosquitone8/setlist-studio）
- **デプロイメント**: Vercelを通じてGitLabリポジトリから本番環境へデプロイ

## ソース修正

すべての実装が完了後、必ずlintチェックとコンパイルチェックを行った上で、完了とすること。
コミット前に、必ずClaude.mdを更新するかを検討すること

### Git操作
- **GitHub CLI**: `gh` コマンドが利用可能（v2.74.1）- プルリクエスト、Issue管理
- **GitLab CLI**: `glab` コマンドが利用可能（v1.63.0）- プロジェクト管理、MRなど
- **リモートリポジトリ**: 
  - `origin`: GitHub（開発用）
  - `gitlab`: GitLab（デプロイ用）

## 開発コマンド

### 基本開発コマンド
- **開発サーバー起動**: `pnpm dev` (Next.js + GraphQL API を http://localhost:3000 で実行)
- **本番ビルド**: `pnpm build`
- **コードチェック**: `pnpm lint`
- **lint問題の修正**: `pnpm lint:fix`
- **TypeScript型チェック**: `npx tsc --noEmit`

### GraphQL開発
- **GraphQLスキーマ生成**: `pnpm generate:schema` (デバッグ用スキーマファイルを生成)
- **GraphQLスキーマファイル**: `src/lib/server/graphql/schema.graphql`
- **TypeScript生成スキーマ**: `src/lib/server/graphql/generated-schema.ts`

### データベース操作
- **初期セットアップ**: `pnpm db:setup` (セキュリティ対応PostgreSQL初回セットアップ)
- **PostgreSQL起動**: `docker-compose up -d postgres`
- **スキーマ変更適用**: `pnpm db:push`
- **Prismaクライアント生成**: `pnpm generate`
- **データベーススタジオ開く**: `pnpm db:studio`
- **マイグレーション作成**: `pnpm db:migrate`

### 環境セットアップ
- **依存関係インストール**: `pnpm install`
- **環境変数セットアップ**: `cp .env.example .env.local`
- **必須環境変数** (`.env.local`内):
  - `DATABASE_URL`: PostgreSQL接続文字列
  - `JWT_SECRET`: JWTトークン生成用シークレットキー (32文字以上)
  - `CSRF_SECRET`: CSRF保護シークレット、JWT_SECRETとは別 (32文字以上)
  - `IP_HASH_SALT`: IPアドレスハッシュ化用ソルト (16文字以上)
  - `CRON_SECRET`: Vercelクロンジョブ認証用シークレット (32文字以上)
  - `POSTGRES_PASSWORD`: Docker用PostgreSQLパスワード (ローカル開発のみ)
  - `RESEND_API_KEY`: Resendメール送信APIキー
  - `RESEND_FROM_EMAIL`: メール送信元アドレス
  - `EMAIL_VERIFICATION_SECRET`: メール認証用シークレット (32文字以上)
  - `PASSWORD_RESET_SECRET`: パスワードリセット用シークレット (32文字以上)
  - `GOOGLE_CLIENT_ID`: Google OAuthクライアントID
  - `GOOGLE_CLIENT_SECRET`: Google OAuthクライアントシークレット
  - `NEXTAUTH_URL`: NextAuth URL (本番環境では実際のURL)
  - `NEXTAUTH_SECRET`: NextAuth用シークレット (JWT_SECRETと同じ値推奨)

### 環境変数詳細

| 変数 | 用途 | ローカル開発 | 本番環境 (Vercel) | 生成方法 |
|----------|---------|-------------------|---------------------|------------|
| `DATABASE_URL` | データベース接続 | `postgresql://postgres:postgres@localhost:5432/setlist_generator` | マネージドDB接続文字列 | プロバイダから提供 |
| `JWT_SECRET` | JWTトークン署名 | 32文字以上の任意文字列 | 強力なランダム文字列 | `openssl rand -base64 32` |
| `CSRF_SECRET` | CSRFトークン署名 | 32文字以上の任意文字列 | JWT_SECRETとは別の文字列 | `openssl rand -base64 32` |
| `IP_HASH_SALT` | IP匿名化 | 16文字以上の任意文字列 | 強力なランダム文字列 | `openssl rand -base64 16` |
| `CRON_SECRET` | クロンジョブ認証 | 32文字以上の任意文字列 | 強力なランダム文字列 | `openssl rand -base64 32` |
| `POSTGRES_PASSWORD` | Docker PostgreSQL | `postgres` | 未使用 (マネージドDB) | N/A |
| `RESEND_API_KEY` | Resendメール送信 | `re_xxxxxx` | Resendダッシュボードから取得 | Resendアカウント作成 |
| `RESEND_FROM_EMAIL` | メール送信元 | `onboarding@resend.dev` | `noreply@yourdomain.com` | 独自ドメイン設定 |
| `EMAIL_VERIFICATION_SECRET` | メール認証署名 | 32文字以上の任意文字列 | 強力なランダム文字列 | `openssl rand -base64 32` |
| `PASSWORD_RESET_SECRET` | パスワードリセット署名 | 32文字以上の任意文字列 | 強力なランダム文字列 | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | Google Consoleから取得 | 本番用ID | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth秘密鍵 | Google Consoleから取得 | 本番用秘密鍵 | Google Cloud Console |
| `NEXTAUTH_URL` | NextAuth URL | `http://localhost:3000` | `https://yourdomain.com` | 実際のURL |
| `NEXTAUTH_SECRET` | NextAuth署名 | JWT_SECRETと同じ値 | JWT_SECRETと同じ値 | N/A (JWT_SECRET流用) |
| `NODE_ENV` | 環境モード | `development` | Vercelで自動設定 | N/A |

## アーキテクチャ概要

### ハイブリッドNext.jsアーキテクチャ (Static + Serverless)
アプリケーションは、モダンで性能最適化されたハイブリッドアーキテクチャを使用しています：

**フロントエンド & バックエンド (Next.js 15.3.4)**
- Next.js 15.3.4 App Router、TypeScript 5、ハイブリッドレンダリング戦略
- Material-UI v5.17.1（カスタムテーマとパッケージ最適化付き）
- Apollo Client 3.13.8 for GraphQL状態管理
- クライアントサイド認証状態管理
- React 19.0.0（strict mode）

**性能最適化**
- **静的ページ**: ログイン/登録ページは完全静的生成でCDN配信 (10倍高速)
- **SSRページ**: 動的ページ（セットリスト、楽曲）はセキュリティのためサーバーレンダリング
- **画像最適化**: WebP/AVIF形式サポート、1日キャッシュTTL
- **バンドル最適化**: MUIコンポーネント用に最適化されたパッケージインポート

**GraphQL API (Vercel Functions)**
- Apollo Server v4.12.2が`/api/graphql`でNext.js APIルートとして動作
- Type-GraphQL 1.1.1によるスキーマファーストAPI開発
- PostgreSQL用ORM Prisma 6.11.0
- JWTトークンとbcryptjs 3.0.2によるHttpOnly Cookie認証
- セキュリティ強化: クエリ深度制限、リクエストサイズ制限、イントロスペクション制御
- 循環依存なしでリレーションを処理するフィールドリゾルバー

**データベース**
- DockerコンテナでPostgreSQL 15を実行
- User、Song、Setlist、SetlistItemモデルを含むPrismaスキーマ
- 全エンティティでCUIDベースのID

### 主要コンポーネント

**データモデル**
- `User`: 一意のemailによる認証とユーザー管理（username重複許可）
  - `authProvider`: 認証プロバイダー（"email" | "google"）- 登録方法の追跡
  - `pendingPassword`: メール変更時のパスワード一時保存（Googleユーザー→メールユーザー移行用）
- `Song`: メタデータ付き楽曲（タイトル、アーティスト、キー、テンポ、長さ、メモ）
- `Setlist`: バンド/会場情報付きパフォーマンス用楽曲コレクション
- `SetlistItem`: セットリストと楽曲を順序・タイミング付きで結ぶ中間テーブル

**主要機能**
- **セットリスト管理**: ドラッグ&ドロップ楽曲順序付きでセットリストの作成、編集、削除、複製
- **画像生成**: 合理化されたUIでプロフェッショナルなセットリスト画像生成 - テーマ選択 + ワンクリックダウンロード
- **QRコード統合**: セットリストページへのリンク付き自動QRコード
- **テーマシステム**: ドロップダウンセレクター付きBlack/Whiteテーマ
- **複製システム**: URLクエリパラメータによる既存セットリストのクローン
- **認証**: JWTトークンとGoogle OAuth 2.0統合付きHttpOnly Cookieベースユーザーシステム
- **認証プロバイダー管理**: 登録方法追跡とGoogle→メール認証の移行機能

**フロントエンドアーキテクチャ**
- MUIProvider、ApolloProvider、SnackbarProviderを分離したProviderパターン
- 青/赤カラースキーム、Interフォント付きカスタムMUIテーマ
- HttpOnly Cookie認証とCSRF保護が設定されたApollo Client
- NextJS App Routerによるクライアントサイドルーティング
- html2canvasとQRコード統合を使用した高度な画像生成システム
- UX向上のためのBlack/White選択による簡素化テーマシステム
- Material-UIコンポーネントによるレスポンシブデザイン
- 統一スナックバー通知システム（レスポンシブ配置・自動キューイング）

**GraphQL統合**
- Apollo ClientはHttpOnly Cookieによる自動認証を使用
- GraphQL APIはCookieベースJWTトークン検証のAuthMiddlewareを使用
- ミューテーション用トークンベース検証によるCSRF保護
- 統一GraphQLバージョン: v15.8.0（pnpm overrideによる互換性）

### 認証フロー
- **メール認証必須**: メールアドレス登録では認証完了まで一切の機能が利用不可
- **登録フロー**: 登録 → メール認証待ち画面 → メール認証完了 → ログイン可能
- **認証状態ポーリング**: `/auth/check-email`で5秒間隔の自動状態更新
- セキュアなHttpOnly CookieにJWTトークンを保存
- 保護されたGraphQLリゾルバーはCookie検証付きAuthMiddlewareデコレーターを使用
- Cookie管理付きGraphQLミューテーションによるユーザー登録/ログイン
- サブスクリプションパターンのsecureAuthClientによるクライアントサイド認証状態管理
- 状態変更操作の自動CSRF保護

### 認証プロバイダー機能
- **プロバイダー追跡**: ユーザー登録時に認証方法（email/google）を記録
- **Google認証制限**: Google認証ユーザーはパスワード変更不可（Googleアカウント管理を推奨）
- **メール変更時の移行**: Googleユーザーがメールアドレス変更時にパスワード設定可能
- **認証方法変更**: メールアドレス変更完了時に認証プロバイダーを"email"に変更
- **UI条件表示**: プロフィールページで認証方法に応じた機能制限を実装

## 重要な設定ノート

### GraphQLバージョン管理
- pnpm overrideによる統一GraphQLバージョン: v15.8.0
- Apollo Client 3.13.8とType-GraphQL 1.1.1の両方と互換性
- 依存関係管理簡素化のための単一package.json

### パッケージ管理
- Node.js 20.11.1要件でpnpm 10.12.1を使用
- プロジェクトルートの単一統合package.json
- コードフォーマット用ESLint 9.x、TypeScript 5、Prettier 3.6.2
- **ESLint設定**: ignoresプロパティ付きフラット設定形式（eslint.config.mjs）を使用
- **schema-dts 1.1.5**: JSON-LD構造化データの完全型安全実装

### 開発ワークフロー（ローカル）
1. 依存関係インストール: `pnpm install`
2. PostgreSQL起動（初回セットアップ）:
   ```bash
   pnpm db:setup
   ```
   
   または手動で:
   ```bash
   # セキュリティ設定を一時的に無効化
   sed -i.bak 's/user: "999:999"/# user: "999:999"/' docker-compose.yml
   sed -i.bak 's/read_only: true/# read_only: true/' docker-compose.yml
   
   # PostgreSQL起動と初期化
   docker-compose down -v && docker-compose up -d postgres
   sleep 10 && pnpm db:push
   
   # セキュリティ設定を再有効化
   sed -i.bak 's/# user: "999:999"/user: "999:999"/' docker-compose.yml
   sed -i.bak 's/# read_only: true/read_only: true/' docker-compose.yml
   docker-compose up -d postgres
   ```
3. 開発サーバー起動: `pnpm dev`
4. 以降の起動: `docker-compose up -d postgres && pnpm dev`

### 本番デプロイ（Vercel）
- **データベース**: Vercel Postgresまたは外部マネージドDBサービス（Supabase、Neon、Railway）を使用
- **環境変数**: Vercelダッシュボードで設定（全て必須）:
  - `DATABASE_URL`: 本番データベースへの接続文字列（SSL付き）
  - `JWT_SECRET`: 強力な本番シークレット（32文字以上、一意）
  - `CSRF_SECRET`: JWT_SECRETとは別（32文字以上、一意）
  - `IP_HASH_SALT`: IPアドレス匿名化用（16文字以上、一意）
  - `CRON_SECRET`: クロンジョブ認証用（32文字以上、一意）
  - `GOOGLE_CLIENT_ID`: Google OAuthクライアントID（本番用）
  - `GOOGLE_CLIENT_SECRET`: Google OAuthクライアントシークレット（本番用）
  - `NEXTAUTH_URL`: 本番環境URL（例: https://yourdomain.com）
  - `NEXTAUTH_SECRET`: NextAuth署名（JWT_SECRETと同じ値を推奨）
- **クロンジョブ**: Vercelダッシュボードで設定
  - path: `/api/cron/cleanup`
  - スケジュール: `0 2 * * *`（毎日午前2時）
- **セキュリティヘッダー**: vercel.jsonにより自動適用
- **Vercel Functions設定**: 
  - GraphQL API: 最大実行時間60秒、メモリ1024MB
  - リージョン: hnd1（東京）
  - パフォーマンス最適化: メモリ増強によるcold start時間短縮
- **注意**: docker-compose.ymlはローカル開発のみ、Vercelでは未使用

詳細なデプロイ手順は [VERCEL_DEPLOYMENT_GUIDE.md](./docs/deployment/VERCEL_DEPLOYMENT_GUIDE.md) を参照

### プロジェクト構造
```
/                           # Next.jsアプリケーションルート
├── docs/                   # 技術ドキュメント（構造化済み）
│   ├── api/                # API・GraphQL関連ドキュメント
│   │   ├── API_ROUTES.md
│   │   ├── GRAPHQL_BEGINNERS_GUIDE.md
│   │   ├── GRAPHQL_CIRCULAR_DEPS_RESOLUTION.md
│   │   └── GRAPHQL_SCHEMA_TYPES.md
│   ├── database/           # データベース・Prisma関連ドキュメント
│   │   ├── PRISMA_BEGINNERS_GUIDE.md
│   │   ├── PRISMA_OPTIMIZATION_GUIDE.md
│   │   └── PRISMA_GRAPHQL_INTEGRATION.md
│   ├── deployment/         # デプロイ・運用関連ドキュメント
│   │   ├── VERCEL_DEPLOYMENT_GUIDE.md
│   │   └── SUPABASE_SETUP_GUIDE.md
│   ├── security/           # セキュリティ関連ドキュメント
│   │   ├── SECURITY.md
│   │   └── SECURITY_TEST_PLAN.md
│   └── project/            # プロジェクト管理ドキュメント
│       └── HISTORY.md
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # APIルート（Vercel Functions）
│   │   │   ├── auth/       # 認証エンドポイント
│   │   │   │   └── route.ts
│   │   │   ├── csrf/       # CSRF保護
│   │   │   │   └── route.ts
│   │   │   ├── graphql/    # GraphQL API
│   │   │   │   └── route.ts
│   │   │   └── security/   # セキュリティ関連
│   │   │       └── cleanup/
│   │   │           └── route.ts
│   │   ├── (pages)/        # グループルート（利用規約・プライバシーポリシー）
│   │   │   ├── privacy/    # プライバシーポリシー
│   │   │   │   └── page.tsx
│   │   │   └── terms/      # 利用規約
│   │   │       └── page.tsx
│   │   ├── guide/          # ガイドページ
│   │   │   └── page.tsx
│   │   ├── login/          # ログインページ
│   │   │   ├── page.tsx
│   │   │   └── LoginClient.tsx
│   │   ├── auth/           # 認証関連ページ
│   │   │   ├── check-email/ # メール認証ページ
│   │   │   │   ├── page.tsx
│   │   │   │   └── CheckEmailClient.tsx
│   │   │   └── forgot-password/ # パスワードリセット
│   │   │       └── ForgotPasswordClient.tsx
│   │   ├── profile/        # プロフィールページ
│   │   │   └── page.tsx
│   │   ├── register/       # 登録ページ
│   │   │   ├── page.tsx
│   │   │   └── RegisterClient.tsx
│   │   ├── setlists/       # セットリスト管理
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── songs/          # 楽曲管理
│   │   │   ├── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── globals.css     # グローバルスタイル
│   │   ├── layout.tsx      # ルートレイアウト
│   │   ├── page.tsx        # ホームページ
│   │   ├── HomeClient.tsx  # ホームページクライアントコンポーネント
│   │   └── sitemap.ts      # サイトマップ生成
│   ├── components/         # Reactコンポーネント
│   │   ├── auth/           # 認証関連コンポーネント
│   │   │   └── LogoutButton.tsx
│   │   ├── common/         # 共通UIコンポーネント
│   │   │   ├── layout/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Header.tsx
│   │   │   └── ui/
│   │   │       ├── ErrorMessage.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── Snackbar.tsx        # レスポンシブスナックバーコンポーネント
│   │   │       ├── StepIcon.tsx        # 共通ステップアイコン
│   │   │       └── SuccessMessage.tsx
│   │   ├── forms/          # フォーム関連コンポーネント
│   │   │   ├── SetlistForm.tsx
│   │   │   └── SongForm.tsx
│   │   ├── home/           # ホームページ専用コンポーネント
│   │   │   ├── AuthActions.tsx
│   │   │   ├── FeatureSection.tsx
│   │   │   ├── PrimaryAuthSection.tsx    # 認証ボタン専用コンポーネント
│   │   │   ├── SampleSetlistsSection.tsx
│   │   │   ├── SetlistDashboard.tsx
│   │   │   └── WelcomeSection.tsx
│   │   ├── providers/      # コンテキストプロバイダー
│   │   │   ├── Providers.tsx
│   │   │   ├── MuiProvider.tsx
│   │   │   ├── ApolloProvider.tsx
│   │   │   ├── CSRFProvider.tsx
│   │   │   └── SnackbarProvider.tsx
│   │   ├── setlist/        # セットリスト専用コンポーネント
│   │   │   ├── SetlistActions.tsx
│   │   │   ├── SetlistDetail.tsx
│   │   │   ├── SetlistDetails.tsx
│   │   │   ├── SetlistListItem.tsx
│   │   │   ├── SetlistList.tsx
│   │   │   ├── SongListItem.tsx
│   │   │   ├── ImageGenerator.tsx
│   │   │   └── ShareButtons.tsx
│   │   ├── setlist-themes/ # テーマシステム
│   │   │   ├── BasicBlackTheme.tsx
│   │   │   ├── BasicWhiteTheme.tsx
│   │   │   └── themes.ts
│   │   └── songs/          # 楽曲管理コンポーネント
│   │       ├── SongList.tsx
│   │       └── SongListItem.tsx
│   ├── hooks/              # カスタムReactフック
│   │   ├── useAuth.ts
│   │   ├── useCSRF.ts
│   │   ├── useSetlists.ts
│   │   └── useSongs.ts
│   ├── lib/                # 共有ユーティリティ
│   │   ├── client/         # クライアントサイドユーティリティ
│   │   │   ├── apolloClient.ts
│   │   │   ├── authClient.ts
│   │   │   └── queries.ts
│   │   ├── server/         # サーバーサイドユーティリティ
│   │   │   ├── auth/
│   │   │   │   ├── auth.ts
│   │   │   │   └── middleware.ts
│   │   │   ├── email/          # メール配信システム
│   │   │   │   ├── emailService.ts
│   │   │   │   └── emailReliability.ts
│   │   │   ├── graphql/
│   │   │   │   ├── context.ts
│   │   │   │   ├── generated-schema.ts
│   │   │   │   ├── resolvers/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── AuthResolver.ts
│   │   │   │   │   ├── SetlistResolver.ts
│   │   │   │   │   ├── SongResolver.ts
│   │   │   │   │   └── UserResolver.ts
│   │   │   │   ├── schema.graphql
│   │   │   │   └── schema.ts
│   │   │   └── prisma.ts
│   │   ├── security/       # セキュリティ関連ユーティリティ
│   │   │   ├── csrf.ts
│   │   │   ├── headers.ts
│   │   │   ├── rateLimit.ts
│   │   │   ├── threatDetection.ts
│   │   │   ├── simple-audit-logger.ts
│   │   │   └── security-logger-db.ts
│   │   ├── i18n/           # 国際化システム（細分化構造）
│   │   │   ├── index.ts    # 統合エントリーポイント
│   │   │   ├── types.ts    # TypeScript型定義
│   │   │   ├── utils.ts    # ユーティリティ関数
│   │   │   ├── messages.ts # 後方互換レイヤー（非推奨）
│   │   │   └── messages/   # ドメイン別メッセージファイル
│   │   │       ├── auth.ts         # 認証・ユーザー管理
│   │   │       ├── common.ts       # 共通UI要素
│   │   │       ├── pages.ts        # ページ固有メッセージ
│   │   │       ├── features.ts     # 機能説明
│   │   │       ├── errors.ts       # エラーメッセージ
│   │   │       ├── notifications.ts # 通知・確認
│   │   │       ├── validation.ts   # バリデーション
│   │   │       ├── setlists.ts     # セットリスト関連
│   │   │       ├── songs.ts        # 楽曲管理
│   │   │       ├── emails.ts       # メールテンプレート
│   │   │       ├── metadata.ts     # SEO・メタデータ
│   │   │       ├── navigation.ts   # ナビゲーション
│   │   │       ├── footer.ts       # フッター
│   │   │       └── confirmations.ts # 確認メッセージ
│   │   ├── metadata/       # SEO・構造化データ
│   │   │   └── pageSchemas.ts  # JSON-LD構造化データ
│   │   └── shared/         # クライアント/サーバー共有ユーティリティ
│   │       └── types.ts
│   └── types/              # TypeScript型定義
│       ├── graphql.ts
│       └── index.ts
├── prisma/                 # データベース関連
│   ├── migrations/         # マイグレーション
│   └── schema.prisma       # Prismaスキーマ
├── public/                 # 静的アセット
│   └── favicon.ico
├── scripts/                # 開発スクリプト
│   └── generate-schema.ts
├── .env.example            # 環境変数サンプル
├── .gitignore
├── CLAUDE.md               # このファイル
├── docker-compose.yml      # ローカル開発用PostgreSQL
├── eslint.config.mjs       # ESLint設定
├── middleware.ts           # CSP nonce・セキュリティヘッダー
├── next.config.ts          # Next.js設定
├── package.json            # プロジェクト設定
├── pnpm-lock.yaml          # 依存関係ロックファイル
├── README.md               # プロジェクトREADME
├── tsconfig.json           # TypeScript設定
└── vercel.json             # Vercelデプロイ設定
```

### 主要ディレクトリ詳細

**docs/**: 技術ドキュメント（構造化済み）
- `api/`: API Routes・GraphQL関連ドキュメント
- `database/`: Prisma関連ドキュメント（初心者ガイド・最適化・GraphQL統合）
- `deployment/`: Vercelデプロイ・Supabase設定
- `security/`: セキュリティアーキテクチャ・テストプラン
- `project/`: 更新履歴・プロジェクト管理

**src/app/**: Next.js App Router
- `api/`: Vercel Functions（auth、csrf、graphql、security）
- 各ページ: login、register、guide、profile、setlists、songs

**src/components/**: Reactコンポーネント
- `common/`: ui、layout、auth関連の共通コンポーネント
- `forms/`: セットリスト・楽曲フォーム
- `setlist/`: セットリスト表示・画像生成・アクション
- `setlist-themes/`: Black/Whiteテーマシステム

**src/lib/**: 共有ユーティリティ
- `server/graphql/`: GraphQLスキーマ、リゾルバー、型定義
- `server/email/`: メール配信システム（Circuit Breaker・リトライ機構付き信頼性向上）
- `security/`: レート制限、脅威検出、CSRF保護、軽量監査ログ（AuditLog）
- `i18n/`: 国際化システム（細分化済み・14ファイル構造、日本語・英語完全対応）
- `client/`: Apollo Client、認証クライアント

### 現在のステータス

**Setlist Studioは、本番運用可能なフル機能エンタープライズアプリケーションです**

#### **アーキテクチャ & パフォーマンス**
- **ハイブリッドNext.js**: static/SSRレンダリング戦略による最適化済みアーキテクチャ
- **10倍高速化**: ログイン/登録ページの静的生成によるCDN配信
- **セキュリティ重視**: 動的ページ（セットリスト、楽曲）はSSRでデータ保護
- **モバイル対応**: フルレスポンシブデザインとタッチ最適化

#### **機能完成度**
- **認証システム**: Google OAuth 2.0・メール認証必須・パスワードリセット・JWT + HttpOnly Cookie完全実装
- **セットリスト管理**: 作成、編集、削除、複製、公開/非公開設定の完全CRUD
- **楽曲管理**: 個人ライブラリ、バルク操作、セットリスト統合
- **画像生成**: Black/Whiteテーマ、QRコード統合、ワンクリックダウンロード
- **共有機能**: 公開セットリスト、URL共有、匿名アクセス対応
- **プロフィール管理**: ユーザー名変更、メールアドレス変更、パスワード変更、認証プロバイダー表示
- **認証プロバイダー管理**: Google認証ユーザーのメール認証への移行機能

#### **品質 & セキュリティ**
- **エンタープライズ級セキュリティ**: OWASP Top 10準拠、CSRF保護、レート制限、脅威検出
- **国際化完全対応**: 2,200+メッセージの日本語・英語完全翻訳
- **コード品質**: TypeScript完全型安全、ESLint準拠、共通コンポーネント化
- **パフォーマンス**: GraphQL最適化、N+1問題解決、バンドル最適化

#### **ユーザーエクスペリエンス**
- **直感的UI**: Material-UI v5によるモダンでアクセシブルなインターフェース
- **統一通知システム**: レスポンシブスナックバー（デスクトップ右下・モバイル上部中央）による一貫した操作フィードバック
- **包括的ガイド**: 認証手順、機能説明、完全無料利用の強調
- **エラーハンドリング**: 適切なエラーメッセージと回復手順
- **SEO最適化**: 動的サイトマップ、メタデータ、検索エンジン対応

#### **開発 & 運用**
- **本番デプロイ**: Vercel最適化、東京リージョン、自動スケーリング
- **メンテナンス**: 自動セキュリティクリーンアップ、監査ログ
- **開発効率**: ホットリロード、TypeScript、包括的ドキュメント
- **PR #40改善実装**: セキュリティ強化・UX改善・メール信頼性向上完了（2025-07-19）
  - ✅ メール認証UX改善（/auth/check-email、プログレス表示、再送信クールダウン）
  - ✅ セキュリティ強化（軽量監査ログ、Circuit Breaker、リトライ機構）
  - ✅ 本番環境マイグレーション対応（完全ガイド・P3005エラー対応）
  - ✅ Vercelリソース効率化（軽量実装、コスト最適化）
- **i18n(国際化)機能**: 完全実装・細分化完了（2025-07-23）
  - ✅ 保守性向上: 巨大ファイル（2,400行）を14の機能別ファイルに分割
  - ✅ 日本語・英語対応の完全なメッセージシステム（2,200+メッセージ）
  - ✅ TypeScript型安全性・既存コード互換性完全維持
  - ✅ 認証状態メッセージ・フォームバリデーション国際化
  - ✅ メール機能WithDetails版への移行完了
  - ✅ 全UIコンポーネントの多言語対応実装
- **利用ガイド改善**: 包括的ユーザーガイド実装（2025-07-22）
  - ✅ 認証・パスワード関連手順の詳細説明（メール認証・パスワードリセット）
  - ✅ 完全無料利用の強調表示とユーザビリティ向上
  - ✅ StepIconコンポーネント共通化と重複コード削除
  - ✅ 実装済み機能に合わせたプロフィール機能説明更新

## API Routes詳細

詳細なAPI仕様については、[API_ROUTES.md](./docs/api/API_ROUTES.md)を参照してください。

### 主要エンドポイント
- `/api/auth` - JWT認証管理
- `/api/csrf` - CSRF保護トークン生成
- `/api/graphql` - メインGraphQL API
- `/api/security/cleanup` - セキュリティデータクリーンアップ

## パフォーマンス最適化（ハイブリッドアーキテクチャ）

### レンダリング戦略最適化
アプリケーションは最適なパフォーマンスのための戦略的ハイブリッドアプローチを実装：

| ページタイプ | 戦略 | パフォーマンス向上 | キャッシュ |
|-----------|----------|------------------|---------|
| `/login`, `/register` | **静的生成** | **10倍高速** | CDN永続 |
| `/auth/check-email` | **静的生成+ポーリング** | **高速初期ロード** | CDN永続 |
| `/auth/verify-email` | **静的生成** | **高速** | CDN永続 |
| `/auth/forgot-password` | **静的生成** | **高速** | CDN永続 |
| `/auth/reset-password` | **静的生成** | **高速** | CDN永続 |
| `/auth/confirm-email-change` | **静的生成** | **高速** | CDN永続 |
| `/guide` | **クライアントサイド** | **高速** | CDN永続 |
| `/terms`, `/privacy` | **クライアントサイド** | **高速** | CDN永続 |
| `/` (ホーム) | **SSR** | 認証依存 | キャッシュなし |
| `/setlists/[id]`, `/setlists/[id]/edit` | **SSR** | セキュリティ重視 | キャッシュなし |
| `/setlists/new` | **SSR** | 認証必須 | キャッシュなし |
| `/songs`, `/songs/new` | **SSR** | 認証必須 | キャッシュなし |
| `/profile` | **SSR** | 認証必須 | キャッシュなし |

### 技術実装
- **静的ページ**: ビルド時事前構築、CDNから即座に配信
- **静的+ポーリング**: 静的ページ配信後、クライアントサイドでリアルタイムデータ取得
- **SSRページ**: リクエスト毎サーバーレンダリング（保護コンテンツ）
- **APIルート**: 全GraphQL操作用サーバーレス関数

### SEO & パフォーマンス利点
- **Core Web Vitals**: 劇的に向上したローディングスコア
- **検索エンジン最適化**: 静的ページの即座インデックス
- **ユーザーエクスペリエンス**: 認証ページのほぼ瞬時ページロード
- **コスト効率**: 戦略的キャッシュによるサーバー負荷軽減

## 最近のUI/UX改善

### セットリスト詳細ページ (/setlists/[id])
- **簡素化レイアウト**: よりクリーンな単一ページ体験のためタブインターフェースを削除
- **アクションボタン行**: 編集、ダウンロード、共有、複製ボタンの水平レイアウト
- **テーマセレクター**: "Theme: basic/white"形式の右上ドロップダウン
- **成功通知**: 画像ダウンロード成功後の"Setlist Generated !"バナー
- **ワンクリックダウンロード**: プレビュータブなしの直接画像生成・ダウンロード

### 画像生成システム
- **合理化コンポーネント**: ImageGeneratorを単一ダウンロードボタンに簡素化
- **リアルタイムプレビュー**: テーマ変更でローディング状態付きプレビューを即座更新
- **ダウンロード統合**: useRefを使用して自動ダウンロードを防止、ボタンクリック時のみ
- **QRコード統合**: 生成画像に自動QRコードを含める
- **デバッグモード**: DOMプレビューと画像プレビュー間の開発専用トグル
- **統一プレビューサイズ**: 全モードで一貫表示のための700px × 990px（A4比率）

### 複製ワークフロー
- **クエリパラメータシステム**: シームレスクローンのための`/setlists/new?duplicate={id}`
- **自動入力フォーム**: 元セットリストデータが"(コピー)"サフィックス付きでフォームを事前入力
- **構造保持**: 複製で楽曲順序、タイミング、全メタデータを維持

### CSRF & CSP実装 (2025-07-01)
- **CSRFトークンAPI**: セキュアなトークン生成と配布のため`/api/csrf`エンドポイントを追加
- **CSP開発修正**: 開発時のみ`unsafe-inline`と`unsafe-eval`を許可するようContent Security Policyを更新
- **Apollo Client統合**: 全GraphQLミューテーション用の自動CSRFトークン取得とヘッダー注入
- **集約CSRF管理**: 単一CSRFProviderがアプリ全体のトークン初期化を処理、重複useCSRF呼び出しを削除
- **本番セキュリティ**: Next.js開発機能を有効にしながら本番で厳格なCSPを維持

## セキュリティアーキテクチャ

包括的なセキュリティ実装については、[SECURITY.md](./docs/security/SECURITY.md)を参照してください。

### 主要セキュリティ機能
- **HttpOnly Cookie認証**: XSS攻撃防止
- **CSRF保護**: タイミング攻撃耐性
- **Google OAuth重複防止**: 既存メール認証ユーザーとGoogle認証の重複登録防止
- **認証プロバイダー管理**: email/google認証方法の追跡と移行機能
- **適応的レート制限**: 正常利用は許可、攻撃は厳格ブロック
  - 認証試行: 1時間に50回まで（IP単位）
  - API呼び出し: 5分間に200回まで（本番）、500回まで（開発）
- **スマートブルートフォース検知**: IP+ユーザー両方での多層防御
  - IP単位: 1時間に20回失敗でブロック
  - 複数アカウント攻撃: 30分で8ユーザー20試行でブロック
- **同一ユーザー複数IP対応**: 正当なユーザーの複数デバイス・回線利用を完全サポート
- **OAuth認証ログ**: Google認証の成功・失敗・新規ユーザー作成イベントの詳細記録
- **監査ログ**: リスクベース軽量監査システム（AuditLogテーブル）
- **データ保護**: 入力サニタイゼーション + SQLインジェクション防止
- **自動クリーンアップ**: Vercelクロン経由の定期メンテナンス

### セキュリティレベル
**バランス型セキュリティ（OWASP Top 10準拠）**：攻撃防止と利便性の最適化を実現

## 更新履歴と記録

最新の開発履歴と変更記録については、[HISTORY.md](./docs/project/HISTORY.md)を参照してください。

### 最新の主要更新 (2025-07-23)
- **アカウント削除機能実装**: ユーザーによる自己データ管理機能の追加
  - ✅ プロフィールページにアカウント削除セクション追加
  - ✅ 誤操作防止の二重確認フロー（確認ダイアログ＋「削除」入力）
  - ✅ Prismaカスケード削除による関連データ完全削除
  - ✅ 日本語・英語の完全国際化対応
  - ✅ レスポンシブ対応のUI実装
- **IP制限の適正化・利便性大幅向上**: 攻撃防止と正常利用のバランス最適化
  - ✅ 過度なIP制限の撤廃: 同一ユーザーの複数IPアクセス完全対応
  - ✅ 適応的レート制限: 認証1時間50回・API5分200回（本番）/500回（開発）に調整
  - ✅ スマートブルートフォース検知: IP単位1時間20回失敗で制限
  - ✅ 認証情報スタッフィング対策: 30分で8ユーザー20試行で検知
  - ✅ 正当利用の保護: VPN・複数デバイス・地理的移動への完全対応
  - ✅ セキュリティ維持: 悪意ある攻撃は確実に検知・ブロック
- **CSP nonce方式・JSON-LD体系化実装**: セキュリティ最適化とSEO強化の完全実装
  - ✅ middleware.ts実装: CSP nonce方式によるセキュリティとパフォーマンスの両立
  - ✅ next.config.tsのCSP設定削除: 設定一元化とコード簡素化
  - ✅ JSON-LD体系化: ハイブリッドアプローチ（共通+ページ固有スキーマ）実装
  - ✅ pageSchemas.ts作成: Organization/WebSite/SoftwareApplication/Article/WebPage統合管理
  - ✅ 全主要ページのJSON-LD対応: ホーム・ガイド・利用規約・プライバシーポリシー
  - ✅ schema-dts導入: 完全型安全なJSON-LD実装
  - ✅ SEO効果向上: ホーム画面のみから全ページでの構造化データ対応
  - ✅ Next.js Scriptコンポーネント統合: CSP nonceとの自動連携
- **Google OAuth重複アカウント防止機能実装**: セキュリティ向上とユーザー体験改善
  - ✅ 既存メール認証ユーザーとGoogle認証の重複登録防止機能実装
  - ✅ 重複検出時の適切なエラーメッセージ表示とログイン誘導
  - ✅ メールアドレス自動入力によるユーザビリティ向上
  - ✅ 国際化対応エラーメッセージ（日本語・英語）追加
  - ✅ セキュリティログによる重複検出イベント記録強化
  - ✅ 条件分岐堅牢化: 未知認証プロバイダー・null assertion・Cookie解析脆弱性修正
- **スナックバー通知システム完全実装**: UX大幅改善による統一された通知体験
  - ✅ レスポンシブスナックバーコンポーネント実装（デスクトップ右下・モバイル上部中央）
  - ✅ グローバルSnackbarProviderとuseSnackbarフック追加による全体管理
  - ✅ 全認証フォーム（ログイン・登録・パスワードリセット）のAlert表示をスナックバー通知に移行
  - ✅ mutation系処理（セットリスト・楽曲作成）の成功・エラー通知統一
  - ✅ 画像生成の成功通知「Setlist Generated !」追加とUX向上
  - ✅ 既存Alert表示コードの完全削除による200行以上のコード簡素化
  - ✅ 国際化対応の成功メッセージ追加（messages.ts）
  - ✅ 自動キューイング機能による複数メッセージの順次表示
  - ✅ Material-UIスライドトランジション付きアニメーション実装
- **メール認証必須化**: セキュリティ強化によるメール認証の完全必須化
  - ✅ メールアドレス登録時の即座ログイン廃止
  - ✅ 認証完了まで全機能利用不可の厳格な制御
  - ✅ リアルタイム認証状態ポーリング（5秒間隔）実装
  - ✅ RegistrationResponse型による適切なUXフロー
  - ✅ Google認証は引き続き即座利用可能
- **i18nメッセージシステム細分化・リファクタリング**: 保守性・可読性大幅向上
  - ✅ 巨大messages.ts（2,400行）を14の機能別ファイルに分割
  - ✅ ドメイン別責務分離（auth、common、pages、features、forms等）
  - ✅ TypeScript型安全性完全維持・統合エントリーポイント実装
  - ✅ 既存コードとの完全互換性確保（後方互換レイヤー）
  - ✅ 静的インポート採用による型推論・Tree-shaking最適化
  - ✅ ESLint import/order準拠・デフォルト言語統一（日本語）
  - ✅ 新規コードでは個別ファイル直接インポート推奨構造

### その他の最近の主要改善 (2025-07-19〜2025-07-22)
- **認証プロバイダー管理機能**: Google/メール認証の統合管理システム
- **ホーム画面UI大幅改善**: モバイル視認性向上と全体的なUX改善
- **楽曲削除モーダル改善**: UX向上とコンポーネント命名統一
- **利用ガイドページ大幅改善**: ユーザビリティとコード品質の向上
- **i18n(国際化)機能完全実装**: 日本語・英語対応の完全な多言語システム
- **PR #40改善実装完了**: セキュリティ強化・UX改善・メール信頼性向上・本番マイグレーション完了

**注意**: 詳細な更新履歴は [HISTORY.md](./docs/project/HISTORY.md) を参照してください。