# 🚀 Vercelデプロイメントガイド

## 📝 概要

このガイドでは、mosquitone Emotional Setlist Studio（Setlist Studio）をVercelにデプロイする手順を詳細に説明します。**ハイブリッドアーキテクチャ**による最適化とセキュリティベストプラクティスを含む包括的な内容となっています。

### 🚀 ハイブリッドアーキテクチャによる最適化
- **静的ページ**: ログイン・登録ページが10倍高速化
- **SSRページ**: ホームページが認証状態に応じた動的レンダリング
- **Vercel Functions**: GraphQL APIが自動スケール
- **CDN最適化**: 世界規模での高速コンテンツ配信

## 🎯 前提条件

1. **GitHubアカウント** - 開発用ソースコードのホスティング
2. **GitLabアカウント** - デプロイ用リポジトリ（https://gitlab.com/mosquitone8/setlist-studio）
3. **Vercelアカウント** - デプロイメントプラットフォーム  
4. **データベースサービス** - PostgreSQL互換のマネージドサービス
5. **Node.js 20.11.1以上** - ローカル開発環境
6. **pnpm 10.12.1以上** - パッケージマネージャー

## 📋 ステップ1: Vercelアカウントの作成

1. [https://vercel.com](https://vercel.com) にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitLab」を選択してGitLabアカウントで認証
4. Vercelの利用規約に同意してアカウント作成を完了

> **注意**: デプロイにはGitLabリポジトリ（https://gitlab.com/mosquitone8/setlist-studio）を使用します

## 📋 ステップ2: プロジェクトのインポート

1. Vercelダッシュボードで「Add New」ボタン（画面右上）をクリック
2. ドロップダウンから「Project」を選択
3. GitLabリポジトリ一覧から「setlist-studio」を選択
   - リポジトリURL: https://gitlab.com/mosquitone8/setlist-studio
4. 「Import」をクリックしてプロジェクトをインポート

### 🔧 ビルド設定の確認
プロジェクトのインポート時に、Vercelは自動的に以下を検出します：

1. **Framework Preset**: `Next.js`が自動選択される
2. **Build Command**: `pnpm build`（GraphQLスキーマ自動生成含む）
3. **Output Directory**: `.next`（Next.jsのデフォルト）
4. **Install Command**: `pnpm install`（pnpmのlockfileから自動検出）

⚠️ **重要**: これらの設定は通常自動検出されますが、後で「Settings」→「General」→「Build & Output Settings」から確認・変更可能です。

### 🚀 ハイブリッドアーキテクチャの最適化設定

このアプリケーションは**ハイブリッドレンダリング戦略**を採用しており、Vercelで自動的に以下の最適化が適用されます：

#### 📊 ページタイプ別の最適化
[CLAUDE.md](../../../CLAUDE.md#レンダリング戦略最適化)参照

#### 🔧 自動適用される最適化
- **静的アセット**: CDNから即座に配信
- **画像最適化**: WebP/AVIF形式への自動変換
- **バンドル最適化**: Material-UIコンポーネントの最適化済みインポート
- **エッジキャッシング**: ISRページの世界規模キャッシング
- **GraphQLスキーマ事前生成**: ビルド時スキーマ生成でVercel Functions起動時間短縮

## 📋 ステップ3: 環境変数の設定

### 🔐 環境変数について
アプリケーションの動作に必要な機密情報や設定値を安全に管理するための仕組みです。

### ⚡ Vercelの環境変数のルール
- **大きさの制限**: 全部の環境変数を合わせて64KB（キロバイト）まで
- **1つの変数の制限**: 1つの環境変数は5KBまで
- **暗号化**: Vercelが自動的に暗号化して安全に保存

### 必須環境変数一覧

#### 1️⃣ **DATABASE_URL** （必須）
- **説明**: PostgreSQLデータベースへの接続文字列
- **形式**: `postgresql://user:password@host:5432/database?sslmode=require`
- **設定方法**:
  
  **オプション1: Vercel Postgres（推奨）**
  1. Vercelダッシュボードでプロジェクトを選択
  2. 「Storage」タブを選択
  3. 「Browse Storage」→「Create New」をクリック
  4. 「Postgres」を選択して「Continue」
  5. データベース名を入力（例: `setlist-db`）
  6. リージョンを選択（日本の場合は「Tokyo, Japan」）
  7. 「Create」をクリックすると自動的に環境変数が設定される
  
  **オプション2: 外部データベースサービス**
  - **Supabase**（無料枠あり）:
    1. [supabase.com](https://supabase.com)でプロジェクトを作成
    2. Settings → Database → Connection stringから接続文字列を取得
  - **Neon**（無料枠あり）:
    1. [neon.tech](https://neon.tech)でデータベースを作成
    2. Dashboard から接続文字列をコピー
  - 注意: パスワード部分は別途取得して置き換える必要があります

#### 2️⃣ **JWT_SECRET** （必須）
- **説明**: JWTトークンの署名に使用する秘密鍵
- **要件**: 32文字以上のランダムな文字列
- **生成方法**: 
  ```bash
  openssl rand -base64 32
  ```
- **例**: `kX8Q2mPL3nR5vT7wY9zA1bC4dF6gH8jK0mN2pQ4rS6u8`

#### 3️⃣ **CSRF_SECRET** （必須）
- **説明**: CSRF攻撃を防ぐための秘密鍵
- **要件**: JWT_SECRETとは異なる32文字以上のランダムな文字列
- **生成方法**: JWT_SECRETと同様の方法で別の文字列を生成
- **例**: `aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5yZ7aB9cD`

#### 4️⃣ **IP_HASH_SALT** （必須）
- **説明**: IPアドレスを匿名化するためのソルト値
- **要件**: 16文字以上のランダムな文字列
- **生成方法**: 
  ```bash
  openssl rand -base64 16
  ```
- **例**: `xY9zA2bC4dF6gH8jK1mN3pQ5`
- **用途**: セキュリティログでIPアドレスを安全に記録

#### 5️⃣ **CRON_SECRET** （必須）
- **説明**: 定期実行タスクの認証に使用する秘密鍵
- **要件**: 32文字以上のランダムな文字列
- **生成方法**: JWT_SECRETと同様
- **例**: `qR9sT1uV3wX5yZ7aB9cD1eF3gH5iJ7kL9`
- **用途**: セキュリティログの自動クリーンアップ処理の保護

#### 6️⃣ **NODE_ENV**（自動設定）
- **説明**: アプリケーションの実行環境
- **値**: Vercelが自動的に`production`に設定
- **注意**: 手動設定は不要

#### 7️⃣ **RESEND_API_KEY** （必須）
- **説明**: Resendメール送信サービスのAPIキー
- **要件**: Resendダッシュボードから取得したAPIキー
- **取得方法**:
  1. [resend.com](https://resend.com)でアカウントを作成
  2. ダッシュボードから「API Keys」を選択
  3. 「Create API Key」をクリックして新しいキーを生成
  4. 生成されたキーをコピー
- **例**: `re_1234567890abcdef1234567890abcdef`
- **用途**: ユーザー認証メール、パスワードリセットメールの送信

#### 8️⃣ **RESEND_FROM_EMAIL** （必須）
- **説明**: メール送信時の送信元アドレス
- **要件**: Resendで検証済みのドメイン、または`onboarding@resend.dev`（開発用）
- **設定方法**:
  - **本番環境**: 独自ドメインを使用（例: `noreply@yourdomain.com`）
    1. Resendダッシュボードで「Domains」を選択
    2. 独自ドメインを追加してDNS設定を完了
    3. 検証完了後、そのドメインのメールアドレスを使用
  - **開発環境**: `onboarding@resend.dev`を使用可能
- **例**: `noreply@yourdomain.com`

#### 9️⃣ **EMAIL_VERIFICATION_SECRET** （必須）
- **説明**: メール認証トークンの署名に使用する秘密鍵
- **要件**: 32文字以上のランダムな文字列
- **生成方法**: `openssl rand -base64 32`
- **例**: `eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5yZ7`

#### 🔟 **PASSWORD_RESET_SECRET** （必須）
- **説明**: パスワードリセットトークンの署名に使用する秘密鍵
- **要件**: 32文字以上のランダムな文字列（EMAIL_VERIFICATION_SECRETとは異なる値）
- **生成方法**: `openssl rand -base64 32`
- **例**: `mN5oP7qR9sT1uV3wX5yZ7aB9cD1eF3gH5`

#### 1️⃣1️⃣ **GOOGLE_CLIENT_ID** （必須）
- **説明**: Google OAuth認証のクライアントID
- **取得方法**:
  1. [Google Cloud Console](https://console.cloud.google.com)にアクセス
  2. プロジェクトを作成または選択
  3. 「APIs & Services」→「Credentials」を選択
  4. 「Create Credentials」→「OAuth Client ID」を選択
  5. アプリケーションタイプで「Web application」を選択
  6. 承認済みリダイレクトURIに以下を追加:
     - 本番: `https://yourdomain.com/api/auth/callback/google`
     - 開発: `http://localhost:3000/api/auth/callback/google`
- **例**: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`

#### 1️⃣2️⃣ **GOOGLE_CLIENT_SECRET** （必須）
- **説明**: Google OAuth認証のクライアントシークレット
- **要件**: Google Cloud Consoleで生成されたシークレット
- **取得方法**: GOOGLE_CLIENT_IDと同じ画面で表示されるシークレットをコピー
- **例**: `GOCSPX-1234567890abcdefghijklmno`

#### 1️⃣3️⃣ **NEXTAUTH_URL** （必須）
- **説明**: アプリケーションのベースURL（メール内のリンクとOAuth認証に使用）
- **要件**: 
  - **本番環境**: https://を含む完全なURL（例: `https://yourdomain.com`または`https://www.yourdomain.com`）
  - **開発環境**: `http://localhost:3000`
- **設定方法**:
  - httpsプロトコルを含む完全なURLを設定
  - サブドメインを使用する場合は含める（例: `https://app.yourdomain.com`）
- **例**: 
  - 本番: `https://yourdomain.com`または`https://www.yourdomain.com`
  - 開発: `http://localhost:3000`
- **重要**: この値がメール内のリンクURLの生成に使用されます

#### 1️⃣4️⃣ **NEXTAUTH_SECRET** （必須）
- **説明**: NextAuth.jsの暗号化に使用する秘密鍵
- **要件**: JWT_SECRETと同じ値を推奨（既存のJWT認証と統合するため）
- **設定方法**: JWT_SECRETと同じ値を設定
- **例**: JWT_SECRETと同じ

#### 1️⃣5️⃣ **PNPM_VERSION**（推奨）
- **説明**: pnpmのバージョンを固定（プロジェクトとの互換性確保）
- **値**: `10.12.1`（このプロジェクトで使用しているバージョン）
- **設定理由**: 
  - ローカル開発環境とVercelで同じpnpmバージョンを使用
  - パッケージの互換性問題を防ぐ
  - ビルドエラーを回避
- **設定方法**: 環境変数として設定、またはpackage.jsonに以下を追加：
  ```json
  {
    "packageManager": "pnpm@10.12.1"
  }
  ```

### 🛠️ 環境変数の設定手順

1. Vercelダッシュボードからプロジェクトを選択
2. 「Settings」タブをクリック
3. 左側メニューから「Environment Variables」を選択
4. 各環境変数について以下の手順で設定:
   - 「Key」フィールドに変数名を入力（例: `DATABASE_URL`）
   - 「Value」フィールドに値を入力
   - 「Environment」で適用環境（Development, Preview, Production）を選択
   - 「Add」をクリックして保存

## 🛡️ ステップ4: セキュリティ設定

### 1. カスタムドメインの設定（オプション）
1. プロジェクトの「Settings」タブを選択
2. 左側メニューから「Domains」を選択
3. カスタムドメインを追加（所有している場合）
4. DNS設定を行い、HTTPSが自動的に有効化されることを確認

### 2. Vercel Cron Jobsの設定
セキュリティログの定期クリーンアップを設定:

1. プロジェクトの「Settings」タブを選択
2. 左側メニューから「Cron Jobs」を選択
3. vercel.jsonファイルでCron Jobを設定（手動設定も可能）:
   ```json
   {
     "crons": [{
       "path": "/api/security/cleanup",
       "schedule": "0 2 * * *"
     }]
   }
   ```
4. 設定完了後、ダッシュボードから実行状況を監視可能

### 3. セキュリティヘッダー
`vercel.json`に以下のセキュリティヘッダーが設定済みです:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

### 4. レート制限
アプリケーションレベルでレート制限が実装されています。詳細な制限値と実装については、[CLAUDE.md](../../../CLAUDE.md#セキュリティアーキテクチャ)のセキュリティアーキテクチャセクションを参照してください。

主な特徴:
- 適応的レート制限による正常利用の保護
- スマートブルートフォース検知
- IPアドレスベースの多層防御

### 5. セキュリティイベント監視
以下のセキュリティイベントが自動的に記録されます:
- 認証失敗の試行
- 不審なアクセスパターン
- レート制限違反
- CSRF トークン検証エラー

## 🚀 ステップ5: デプロイの実行

### 初回デプロイ
1. すべての環境変数が正しく設定されていることを確認
2. 「Deploy」ボタンをクリック
3. ビルドログを監視（通常3-5分で完了）
4. デプロイ完了後、「Visit」をクリックしてアプリケーションを確認

### データベースの初期化

#### 方法1: Vercel CLIを使用（推奨）
1. Vercel CLIのインストール:
   ```bash
   npm install -g vercel
   ```

2. Vercelへのログイン:
   ```bash
   vercel login
   ```

3. 環境変数のダウンロード:
   ```bash
   vercel env pull .env.production.local
   ```

4. データベーススキーマの適用:
   ```bash
   pnpm db:push
   ```

#### 方法2: 手動設定
1. Vercelダッシュボードから`DATABASE_URL`をコピー
2. `.env.production.local`ファイルを作成して値を設定
3. `pnpm db:push`を実行してスキーマを適用

## 🔄 ステップ6: 継続的デプロイメント

GitLabとの統合により、以下の自動デプロイが設定されます:

1. **本番環境**: mainブランチへのプッシュで自動デプロイ
2. **プレビュー環境**: その他のブランチへのプッシュでプレビュー環境を作成

### 開発からデプロイまでのワークフロー

1. **開発**: GitHub（このリポジトリ）で機能開発・テスト
2. **同期**: 完成した機能をGitLabリポジトリに同期
3. **デプロイ**: GitLabリポジトリからVercelが自動デプロイ

```bash
# 開発完了後、GitLabリポジトリに同期
git push gitlab main
```

## 📊 ステップ7: 監視とメンテナンス

### ログの確認
1. Vercelダッシュボードでプロジェクトを選択
2. 「Functions」タブを選択
3. 各関数をクリックして詳細ログを確認
4. 「Logs」タブでリアルタイムログを監視
5. エラーや異常なパターンがないか定期的に確認

### アラートの設定
1. プロジェクトの「Settings」タブを選択
2. 左側メニューから「Notifications」を選択
3. 「Add Notification」をクリック
4. 以下の設定を推奨:
   - **Event**: Function Error
   - **Channel**: Email
   - 通知先メールアドレスを設定

### パフォーマンス監視
1. 「Analytics」タブで訪問者数とパフォーマンスメトリクスを確認
2. 「Speed Insights」で Core Web Vitals を監視
3. パフォーマンス低下が見られる場合は最適化を検討

## 🔧 データベースメンテナンス

### 本番データベースのリセット（開発期間中のみ）

開発期間中に本番データベースを完全にリセットする必要がある場合、以下のコマンドを使用できます：

```bash
# 1. 現在のスキーマを確認（オプション）
DATABASE_URL="your_production_database_url_here" npx prisma db pull

# 2. 全データを削除してスキーマを再作成
DATABASE_URL="your_production_database_url_here" npx prisma db push --force-reset

# 3. 初期データを投入（必要に応じて）
DATABASE_URL="your_production_database_url_here" npx prisma db seed
```

⚠️ **警告**: このコマンドは**全てのデータを削除**します。本番運用開始後は絶対に実行しないでください。

## ⚠️ 重要な注意事項

### セキュリティベストプラクティス
- ❌ 環境変数を第三者と共有しない
- ❌ 環境変数をソースコードにハードコーディングしない
- ❌ JWT_SECRETとCSRF_SECRETに同じ値を使用しない
- ✅ 定期的にシークレットをローテーションする
- ✅ アクセスログを定期的に監査する
- ✅ エラーログを監視して迅速に対応する

## 🆘 トラブルシューティング

### よくあるエラーと解決方法

#### 1. Database connection failed
- **原因**: DATABASE_URLが正しく設定されていない
- **解決方法**: 
  - 環境変数の値を再確認
  - SSL接続が有効になっているか確認（`?sslmode=require`）
  - データベースサービスのファイアウォール設定を確認

#### 2. Authentication failed  
- **原因**: JWT_SECRETが設定されていない
- **解決方法**: 環境変数にJWT_SECRETが正しく設定されているか確認

#### 3. CSRF token invalid
- **原因**: CSRF_SECRETが設定されていないか、JWT_SECRETと同じ値
- **解決方法**: CSRF_SECRETに異なる値を設定

#### 4. Build failed
- **原因**: TypeScriptエラーやパッケージの不整合
- **解決方法**: 
  - ローカルで`pnpm build`を実行してエラーを確認
  - `pnpm install`で依存関係を更新

#### 5. Module not found
- **原因**: 依存関係が正しくインストールされていない
- **解決方法**: 
  - `package.json`の依存関係を確認
  - ローカルで問題が再現するか確認

#### 6. Environment variable not found
- **原因**: 必要な環境変数が不足
- **解決方法**: すべての必須環境変数が設定されているか確認

#### 7. pnpm: command not found / pnpm version mismatch
- **原因**: Vercelがpnpmを認識できない、またはバージョンが不一致
- **解決方法**:
  - 方法1: 環境変数に`PNPM_VERSION=10.12.1`を追加
  - 方法2: package.jsonに以下を追加:
    ```json
    {
      "packageManager": "pnpm@10.12.1"
    }
    ```
  - 方法3: Build Settingsで`Install Command`を`npm install -g pnpm@10.12.1 && pnpm install`に変更

#### 8. Prisma generate error
- **原因**: Prismaクライアントの生成に失敗
- **解決方法**:
  - package.jsonのpostinstallスクリプトに`prisma generate`が含まれているか確認
  - ビルドコマンドを`pnpm generate && pnpm build`に変更

## 🎉 デプロイ完了後の確認

### 動作確認チェックリスト
- [ ] アプリケーションのURLにアクセス可能
- [ ] ユーザー登録機能が正常に動作
- [ ] ログイン/ログアウトが正常に動作
- [ ] セットリストの作成・編集・削除が可能
- [ ] 画像生成とダウンロードが機能
- [ ] レスポンシブデザインが正しく表示

## 📚 参考リソース

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Vercel環境変数ガイド](https://vercel.com/docs/environment-variables)
- [Vercel Functions](https://vercel.com/docs/functions)

---

💡 **サポート**: 問題が発生した場合は、Vercelのビルドログとランタイムログを確認し、エラーメッセージを元に解決策を探してください。