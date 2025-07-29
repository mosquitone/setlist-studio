# 環境変数設定ガイド

このドキュメントでは、Setlist Studioで使用する環境変数の詳細について説明します。

## 必須環境変数

`.env.local`ファイルに以下の環境変数を設定する必要があります：

### 環境変数一覧

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
| `NEXTAUTH_URL` | アプリケーションベースURL | `http://localhost:3000` | `https://yourdomain.com` | https://を含む完全URL |
| `NEXTAUTH_SECRET` | NextAuth署名 | JWT_SECRETと同じ値 | JWT_SECRETと同じ値 | N/A (JWT_SECRET流用) |
| `NEXT_PUBLIC_SITE_URL` | 公開サイトURL | `http://localhost:3000` | `https://yourdomain.com` | robots.txt/sitemap.xml用 |
| `SHADOW_DATABASE_URL` | Prismaマイグレーション用 | `postgresql://postgres:postgres@localhost:5432/shadow_db` | 未使用 | 開発環境のみ |
| `NODE_ENV` | 環境モード | `development` | Vercelで自動設定 | N/A |

## セットアップ手順

### ローカル開発環境

1. `.env.example`をコピーして`.env.local`を作成：
   ```bash
   cp .env.example .env.local
   ```

2. 各環境変数を設定：
   - データベース関連は`docker-compose.yml`のデフォルト値を使用
   - シークレット類は開発用の値を設定（本番とは異なる値を使用）
   - `SHADOW_DATABASE_URL`はPrismaマイグレーション開発時に必要（本番環境では不要）

### 本番環境（Vercel）

1. Vercelダッシュボードで環境変数を設定
2. 各シークレットは強力なランダム文字列を生成して使用
3. データベースURLは本番用のマネージドサービスの接続文字列を使用

## セキュリティに関する注意事項

- **JWT_SECRET**と**CSRF_SECRET**は必ず異なる値を使用
- 本番環境のシークレットは定期的に更新を推奨
- 環境変数は絶対にGitリポジトリにコミットしない
- `.env.local`は`.gitignore`に含まれていることを確認

## 関連ドキュメント

- [Vercelデプロイ設定](./VERCEL_DEPLOYMENT.md)
- [セキュリティアーキテクチャ](../SECURITY.md)