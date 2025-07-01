# 🚀 Vercelデプロイメントガイド

## 📝 概要

このガイドでは、mosquitone Emotional Setlist StudioをVercelにデプロイする手順を詳細に説明します。セキュリティベストプラクティスを含む包括的な内容となっています。

## 🎯 前提条件

1. **GitHubアカウント** - ソースコードのホスティング
2. **Vercelアカウント** - デプロイメントプラットフォーム  
3. **データベースサービス** - PostgreSQL互換のマネージドサービス
4. **Node.js 20.11.1以上** - ローカル開発環境
5. **pnpm 10.12.1以上** - パッケージマネージャー

## 📋 ステップ1: Vercelアカウントの作成

1. [https://vercel.com](https://vercel.com) にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択してGitHubアカウントで認証
4. Vercelの利用規約に同意してアカウント作成を完了

## 📋 ステップ2: プロジェクトのインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリ一覧から「setlist-studio」を選択
3. 「Import」をクリックしてプロジェクトをインポート

## 📋 ステップ3: 環境変数の設定

### 🔐 環境変数について
アプリケーションの動作に必要な機密情報や設定値を安全に管理するための仕組みです。

### 必須環境変数一覧

#### 1️⃣ **DATABASE_URL**
- **説明**: PostgreSQLデータベースへの接続文字列
- **形式**: `postgresql://user:password@host:5432/database?sslmode=require`
- **設定方法**:
  
  **オプション1: Vercel Postgres（推奨）**
  1. Vercelダッシュボードで「Storage」タブを選択
  2. 「Browse Storage」→「Create New」をクリック
  3. 「Postgres」を選択して「Continue」
  4. データベース名を入力（例: `setlist-db`）
  5. リージョンを選択（日本の場合は「Tokyo, Japan」）
  6. 「Create」をクリックすると自動的に環境変数が設定される
  
  **オプション2: 外部データベースサービス**
  - **Supabase**（無料枠あり）:
    1. [supabase.com](https://supabase.com)でプロジェクトを作成
    2. Settings → Database → Connection stringから接続文字列を取得
  - **Neon**（無料枠あり）:
    1. [neon.tech](https://neon.tech)でデータベースを作成
    2. Dashboard から接続文字列をコピー
  - 注意: パスワード部分は別途取得して置き換える必要があります

#### 2️⃣ **JWT_SECRET**
- **説明**: JWTトークンの署名に使用する秘密鍵
- **要件**: 32文字以上のランダムな文字列
- **生成方法**: 
  ```bash
  openssl rand -base64 32
  ```
- **例**: `kX8Q2mPL3nR5vT7wY9zA1bC4dF6gH8jK0mN2pQ4rS6u8`

#### 3️⃣ **CSRF_SECRET**
- **説明**: CSRF攻撃を防ぐための秘密鍵
- **要件**: JWT_SECRETとは異なる32文字以上のランダムな文字列
- **生成方法**: JWT_SECRETと同様の方法で別の文字列を生成
- **例**: `aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5yZ7aB9cD`

#### 4️⃣ **IP_HASH_SALT**
- **説明**: IPアドレスを匿名化するためのソルト値
- **要件**: 16文字以上のランダムな文字列
- **生成方法**: 
  ```bash
  openssl rand -base64 16
  ```
- **例**: `xY9zA2bC4dF6gH8jK1mN3pQ5`
- **用途**: セキュリティログでIPアドレスを安全に記録

#### 5️⃣ **CRON_SECRET**
- **説明**: 定期実行タスクの認証に使用する秘密鍵
- **要件**: 32文字以上のランダムな文字列
- **生成方法**: JWT_SECRETと同様
- **例**: `qR9sT1uV3wX5yZ7aB9cD1eF3gH5iJ7kL9`
- **用途**: セキュリティログの自動クリーンアップ処理の保護

#### 6️⃣ **NODE_ENV**（自動設定）
- **説明**: アプリケーションの実行環境
- **値**: Vercelが自動的に`production`に設定
- **注意**: 手動設定は不要

### 🛠️ 環境変数の設定手順

1. Vercelプロジェクトページで「Settings」タブを選択
2. 左側メニューから「Environment Variables」を選択
3. 各環境変数について以下の手順で設定:
   - 「Key」フィールドに変数名を入力（例: `DATABASE_URL`）
   - 「Value」フィールドに値を入力
   - 「Environment」で全環境（Development, Preview, Production）を選択
   - 「Add」をクリックして保存

## 🛡️ ステップ4: セキュリティ設定

### 1. カスタムドメインの設定（オプション）
1. 「Settings」→「Domains」を選択
2. カスタムドメインを追加（所有している場合）
3. DNS設定を行い、HTTPSが自動的に有効化されることを確認

### 2. Vercel Cron Jobsの設定
セキュリティログの定期クリーンアップを設定:

1. 「Settings」→「Functions」→「Cron Jobs」を選択
2. 「Add Cron Job」をクリック
3. 以下の設定を入力:
   - **Function**: `/api/cron/cleanup`
   - **Schedule**: `0 2 * * *` （毎日午前2時に実行）
   - **Environment**: Production

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
        }
      ]
    }
  ]
}
```

### 4. レート制限
アプリケーションレベルで以下のレート制限が実装されています:
- 通常のリクエスト: 1分間に60回まで
- 認証試行: 5分間に5回まで
- IPアドレスベースの制限により、分散攻撃にも対応

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

GitHubとの統合により、以下の自動デプロイが設定されます:

1. **本番環境**: mainブランチへのプッシュで自動デプロイ
2. **プレビュー環境**: その他のブランチへのプッシュでプレビュー環境を作成

## 📊 ステップ7: 監視とメンテナンス

### ログの確認
1. Vercelダッシュボードで「Functions」タブを選択
2. 各関数をクリックして詳細ログを確認
3. 「Logs」タブでリアルタイムログを監視
4. エラーや異常なパターンがないか定期的に確認

### アラートの設定
1. 「Settings」→「Notifications」を選択
2. 「Add Notification」をクリック
3. 以下の設定を推奨:
   - **Event**: Function Error
   - **Channel**: Email
   - 通知先メールアドレスを設定

### パフォーマンス監視
1. 「Analytics」タブで訪問者数とパフォーマンスメトリクスを確認
2. 「Speed Insights」で Core Web Vitals を監視
3. パフォーマンス低下が見られる場合は最適化を検討

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