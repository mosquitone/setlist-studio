# CLAUDE.md

このファイルは、Claude Code（claude.ai/code）がこのリポジトリでコード作業を行う際のガイダンスを提供します。

## プロジェクト概要

mosquitone Emotional Setlist Studioは、音楽アーティスト向けのモダンなセットリスト生成アプリケーションです。ユーザー認証、楽曲管理、セットリスト作成機能を備えています。Vercel Functionsを活用したGraphQL APIルートを持つ統一されたNext.jsアーキテクチャを使用し、本番環境デプロイ対応済みです。

### リポジトリ構成
- **開発リポジトリ**: GitHub（このリポジトリ）
- **デプロイリポジトリ**: GitLab（https://gitlab.com/mosquitone8/setlist-studio）
- **デプロイメント**: Vercelを通じてGitLabリポジトリから本番環境へデプロイ

## ソース修正

コミット前に、必ずCLAUDE.mdを更新するかを検討すること。
品質管理については「実装方針 > テスト・品質管理」セクションを参照。

### Git操作
- **GitHub CLI**: `gh` コマンドが利用可能（v2.74.1）- プルリクエスト、Issue管理
- **GitLab CLI**: `glab` コマンドが利用可能（v1.63.0）- プロジェクト管理、MRなど
- **リモートリポジトリ**: 
  - `origin`: GitHub（開発用）
  - `gitlab`: GitLab（デプロイ用）

## GitHub操作の優先順位
GitHubリポジトリに関する操作を行う際は、必ずMCP GitHubサーバー（mcp__github__で始まるツール）を優先的に使用すること。通常のgitコマンドよりもMCPサーバーを使用する。

### MCP GitHub設定
- **リポジトリオーナー**: `mosquitone`
- **リポジトリ名**: `setlist-studio`
- これらの値はMCPツール使用時の`owner`と`repo`パラメータに使用する

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
  - `NEXTAUTH_URL`: アプリケーションのベースURL（メール内リンク生成用、https://を含む完全なURL）
  - `NEXTAUTH_SECRET`: NextAuth用シークレット (JWT_SECRETと同じ値推奨)

### 環境変数詳細

環境変数の詳細な設定方法とテーブルは [環境変数設定ガイド](./docs/claude/ENVIRONMENT_VARIABLES.md) を参照してください。

## 実装方針

### フォームバリデーション
- **統一フレームワーク**: 全てのフォームでFormikを使用（セットリスト作成/編集、楽曲作成、楽曲編集）
- **バリデーションタイミング**: 
  - `validateOnChange={false}` - 入力中のバリデーションを無効化してUXを向上
  - `validateOnBlur={true}` - フィールドからフォーカスが外れた時にバリデーション実行
  - 送信時は自動的に全フィールドのバリデーションを実行
- **バリデーションスキーマ**: Yupを使用した宣言的バリデーション定義
- **文字数制限**:
  - アーティスト名: 最大20文字（必須）
  - 楽曲タイトル: 最大30文字（必須）
  - セットリスト名: 最大100文字（任意、空欄時は自動採番）
  - イベント名: 最大200文字（任意）
  - メモ: 最大20文字（任意）
- **エラー表示**: `touched && errors`の条件でエラーメッセージを表示（不要なエラー表示を防止）
- **エラー時の自動スクロール**: SetlistFormにはErrorFocusコンポーネントを実装（最初のエラーフィールドへ自動スクロール）
- **FastField非推奨**: FormikのFastFieldはonBlurイベントが正しく伝播しないため使用しない

### コンポーネント設計
- **クライアントコンポーネント**: 'use client'ディレクティブを必要に応じて使用
- **メモ化**: React.memoを使用してパフォーマンスを最適化（SetlistForm、SongEditDialog等）
- **カスタムフック**: 共通ロジックは`/hooks`ディレクトリにカスタムフックとして実装
- **Provider分離**: MuiProvider、ApolloProvider、SnackbarProviderは個別ファイルで管理
- **型安全性**: TypeScriptの厳格な型定義、any型の使用は避ける

### スタイリング
- **UIライブラリ**: Material-UI v5を基本とし、カスタムコンポーネントで拡張
- **レスポンシブ対応**: モバイルファーストで実装、breakpointsを活用
- **テーマ**: MUIカスタムテーマ（青/赤カラースキーム、Interフォント）
- **スナックバー位置**: デスクトップは右下、モバイルは上部中央

### 状態管理
- **認証状態**: secureAuthClientによるクライアントサイド認証状態管理
- **フォーム状態**: Formikによる統一的なフォーム状態管理
- **グローバル通知**: SnackbarProviderによる統一通知システム
- **Apollo Client**: GraphQL状態はApollo Clientのキャッシュで管理

### API通信
- **GraphQL優先**: データ取得・更新はGraphQL APIを使用
- **エラーハンドリング**: Apollo ClientのonError、onCompletedで一貫したエラー処理
- **Mutation通知**: 全てのmutation操作（作成、更新、削除）の成功・失敗はスナックバーで通知
  - 成功時: showSuccess()で操作完了メッセージを表示
  - エラー時: showError()でエラーメッセージを表示
  - 一貫したユーザーフィードバックを提供
- **楽観的更新**: 必要に応じてoptimisticResponseを使用
- **キャッシュ戦略**: fetchPolicy: 'cache-first'を基本とし、必要に応じて調整

### セキュリティ
- **認証**: HttpOnly Cookie + JWTトークン
- **CSRF保護**: 全てのmutationにCSRFトークンを自動付与
- **入力検証**: クライアント側（Formik/Yup）とサーバー側（class-validator）の二重検証
- **サニタイゼーション**: validateAndSanitizeInputによる入力値の検証

### 国際化（i18n）
- **言語サポート**: 日本語・英語の完全対応
- **メッセージ管理**: `/lib/i18n/messages/`配下にドメイン別で管理
- **動的メタデータ**: generateMetadataで言語別のSEOメタデータを生成
- **デフォルト言語**: 日本語（ja）

### パフォーマンス最適化
- **ハイブリッドレンダリング**: 静的ページとSSRの使い分け
- **画像最適化**: Next.js Imageコンポーネントの活用（画像生成を除く）
- **バンドル最適化**: dynamic importとcode splittingの活用
- **メモ化**: useMemo、useCallbackの適切な使用

### テスト・品質管理
- **Lintチェック**: コミット前に`pnpm lint`を実行
- **型チェック**: `npx tsc --noEmit`でTypeScriptエラーを確認
- **コード整形**: Prettierによる自動整形（`pnpm lint:fix`）

## アーキテクチャ概要

### ハイブリッドNext.jsアーキテクチャ (Static + Serverless)
アプリケーションは、モダンで性能最適化されたハイブリッドアーキテクチャを使用しています：

**フロントエンド & バックエンド (Next.js 15.3.4)**
- Next.js 15.3.4 App Router、TypeScript 5、ハイブリッドレンダリング戦略
- Material-UI v5.17.1（カスタムテーマとパッケージ最適化付き）
- Apollo Client 3.13.8 for GraphQL状態管理
- React 19.0.0（strict mode）

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
- **画像生成**: 合理化されたUIで高品質なセットリスト画像生成 - テーマ選択 + ワンクリックダウンロード
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
- 状態変更操作の自動CSRF保護

### 認証プロバイダー機能
- **プロバイダー追跡**: ユーザー登録時に認証方法（email/google）を記録
- **Google認証制限**: Google認証ユーザーはパスワード変更不可（Googleアカウント管理を推奨）
- **メールアドレス変更時のプロバイダー変更**:
  - **Google認証による変更** (`/api/auth/google-sync`):
    - `email` → `google`: メール認証ユーザーがGoogle認証でメール変更
    - `google` → `google`: Google認証ユーザーがGoogle認証でメール変更
  - **メール認証による変更** (プロフィールページ):
    - `google` → `email`: Google認証ユーザーがメール認証でメール変更（パスワード設定必須）
    - `email` → `email`: メール認証ユーザーがメール認証でメール変更
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

本番環境へのデプロイ手順、環境変数設定、Vercel Functions設定については以下のドキュメントを参照：
- [Vercelデプロイガイド](./docs/claude/VERCEL_DEPLOYMENT_GUIDE.md)
- [環境変数設定ガイド](./docs/claude/ENVIRONMENT_VARIABLES.md)

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
│   │   │   ├── privacy-policy/    # プライバシーポリシー
│   │   │   │   └── page.tsx
│   │   │   └── terms-of-service/      # 利用規約
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

詳細なAPI仕様については、[API_ROUTES.md](./docs/claude/API_ROUTES.md)を参照してください。

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
| `/auth/check-email` | **静的生成+動的メタデータ** | **高速初期ロード** | CDN永続 |
| `/auth/verify-email` | **静的生成+動的メタデータ** | **高速** | CDN永続 |
| `/auth/forgot-password` | **静的生成+動的メタデータ** | **高速** | CDN永続 |
| `/auth/reset-password` | **静的生成+動的メタデータ** | **高速** | CDN永続 |
| `/auth/confirm-email-change` | **静的生成+動的メタデータ** | **高速** | CDN永続 |
| `/guide` | **サーバーコンポーネント+動的メタデータ** | **高速** | デフォルトキャッシュ |
| `/terms-of-service`, `/privacy-policy` | **サーバーコンポーネント+動的メタデータ** | **高速** | デフォルトキャッシュ |
| `/` (ホーム) | **SSR+動的メタデータ** | 認証依存 | キャッシュなし |
| `/setlists/[id]`, `/setlists/[id]/edit` | **SSR** | セキュリティ重視 | キャッシュなし |
| `/setlists/new` | **SSR** | 認証必須 | キャッシュなし |
| `/songs`, `/songs/new` | **SSR** | 認証必須 | キャッシュなし |
| `/profile` | **SSR** | 認証必須 | キャッシュなし |

### 技術実装
- **静的ページ**: ビルド時事前構築、CDNから即座に配信
- **静的+動的メタデータ**: 静的ページ配信とgenerateMetadataによる言語対応メタデータ
- **SSR+動的メタデータ**: サーバーコンポーネントとgenerateMetadataの組み合わせ
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

包括的なセキュリティ実装については、[SECURITY.md](./docs/claude/SECURITY.md)を参照してください。

### 主要セキュリティ機能
- **HttpOnly Cookie認証**: XSS攻撃防止
- **CSRF保護**: タイミング攻撃耐性
- **Google OAuth重複防止**: 既存メール認証ユーザーとGoogle認証の重複登録防止
- **認証プロバイダー管理**: email/google認証方法の追跡と移行機能
- **適応的レート制限**: 正常利用は許可、攻撃は厳格ブロック（GraphQL最適化）
  - 認証試行: 1時間に300回まで（IP単位）
  - API呼び出し: 1分間に300回まで（本番・開発共通）
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

## 更新履歴

最新の開発履歴と変更記録については、[HISTORY.md](./docs/claude/HISTORY.md)を参照してください。