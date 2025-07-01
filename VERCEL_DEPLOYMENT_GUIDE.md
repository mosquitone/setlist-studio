# 🚀 Vercelデプロイ完全ガイド

## 📝 はじめに

このガイドでは、mosquitone Emotional Setlist StudioをVercel（バーセル）というサービスに公開する方法を、初めての方でも分かるように詳しく説明します。

## 🎯 必要なもの

1. **GitHubアカウント** - コードを保存する場所
2. **Vercelアカウント** - アプリを公開する場所  
3. **データベース** - 情報を保存する場所（Vercel Postgres、Supabase、Neonなど）
4. **Node.js 20.11.1以上** - お使いのパソコンに必要なソフトウェア
5. **pnpm 10.12.1以上** - パッケージを管理するツール

## 📋 ステップ1: Vercelアカウントを作る

1. [https://vercel.com](https://vercel.com) にアクセス
2. 「Sign Up」（サインアップ）をクリック
3. 「Continue with GitHub」（GitHubで続ける）を選ぶ
4. GitHubアカウントでログインして、利用規約に同意

## 📋 ステップ2: プロジェクトをインポート

1. Vercelのダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリから「setlist-studio」を選ぶ
3. 「Import」（インポート）をクリック

## 📋 ステップ3: 環境変数の設定

### 🔐 環境変数とは？
アプリが動くために必要な「秘密の設定」のことです。パスワードのようなものだと考えてください。

### ⚡ Vercelの環境変数のルール
- **大きさの制限**: 全部の環境変数を合わせて64KB（キロバイト）まで
- **1つの変数の制限**: 1つの環境変数は5KBまで
- **暗号化**: Vercelが自動的に暗号化して安全に保存してくれます

### 設定する環境変数一覧

#### 1️⃣ **DATABASE_URL** （必須）
- **説明**: データベースに接続するための住所
- **例**: `postgresql://user:password@host:5432/database?sslmode=require`
- **設定方法**:
  
  **🌟 オプション1: Vercel Postgresを使う場合（簡単！）**
  1. Vercelダッシュボードで「Storage」タブをクリック
  2. 「Browse Storage」→「Create New」をクリック
  3. 「Postgres」を選択して「Continue」
  4. データベースの名前を決める（例: `setlist-db`）
  5. 地域を選ぶ（日本なら「Tokyo, Japan」）
  6. 「Create」をクリック
  7. DATABASE_URLが**自動的に設定される！**
  
  **🔧 オプション2: 外部データベースを使う場合**
  - **Supabase**（無料枠あり）:
    1. [supabase.com](https://supabase.com)でプロジェクト作成
    2. Settings → Database → Connection stringをコピー
  - **Neon**（無料枠あり）:
    1. [neon.tech](https://neon.tech)でデータベース作成
    2. Connection stringをコピー
  - **注意**: パスワードは別途コピーして`[YOUR-PASSWORD]`の部分と置き換える

#### 2️⃣ **JWT_SECRET** （必須）
- **説明**: ログイン情報を守るための秘密の鍵
- **設定値**: 32文字以上のランダムな文字列
- **作り方**: 
  ```bash
  # ターミナルで実行
  openssl rand -base64 32
  ```
- **例**: `kX8Q2mPL3nR5vT7wY9zA1bC4dF6gH8jK0mN2pQ4rS6u8`

#### 3️⃣ **CSRF_SECRET** （必須）
- **説明**: 悪意のある攻撃からアプリを守るための秘密の鍵
- **設定値**: JWT_SECRETとは**違う**32文字以上のランダムな文字列
- **作り方**: JWT_SECRETと同じ方法で別の文字列を生成
- **例**: `aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5yZ7aB9cD`

#### 4️⃣ **IP_HASH_SALT** （必須）
- **説明**: IPアドレス（インターネット上の住所）を安全に保存するための塩
- **設定値**: 16文字以上のランダムな文字列
- **作り方**: 
  ```bash
  # ターミナルで実行
  openssl rand -base64 16
  ```
- **例**: `xY9zA2bC4dF6gH8jK1mN3pQ5`
- **なぜ必要？**: セキュリティログを安全に記録するため

#### 5️⃣ **CRON_SECRET** （必須）
- **説明**: 定期的なお掃除作業を安全に実行するための鍵
- **設定値**: 32文字以上のランダムな文字列
- **作り方**: JWT_SECRETと同じ方法で生成
- **例**: `qR9sT1uV3wX5yZ7aB9cD1eF3gH5iJ7kL9`
- **なぜ必要？**: 古いデータを自動で削除する作業を守るため

#### 6️⃣ **NODE_ENV** （自動設定）
- **説明**: アプリの動作モード
- **設定値**: Vercelが自動的に`production`に設定
- **注意**: 手動で設定する必要はありません！

### 🛠️ 環境変数の設定方法

1. Vercelプロジェクトページで「Settings」タブをクリック
2. 左メニューから「Environment Variables」を選択
3. 各変数について:
   - 「Key」欄に変数名を入力（例: `DATABASE_URL`）
   - 「Value」欄に値を入力
   - 「Environment」は全部チェック（Development, Preview, Production）
   - 「Add」をクリック

## 🛡️ ステップ4: セキュリティ設定

### 1. ドメイン設定
1. 「Settings」→「Domains」
2. カスタムドメインを追加（持っている場合）
3. HTTPSが自動的に有効になる！

### 2. Vercel Cron Jobsの設定
定期的なお掃除作業（古いデータの削除）を設定:

1. 「Settings」→「Functions」→「Cron Jobs」
2. 「Add Cron Job」をクリック
3. 以下を設定:
   - **Function**: `/api/cron/cleanup`
   - **Schedule**: `0 2 * * *` （毎日午前2時に実行）
   - **Environment**: Production

### 3. セキュリティヘッダー
`vercel.json`ファイルに以下を追加（すでに設定済み）:

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

### 4. レート制限（自動で動く！）
アプリケーションレベルで実装済み:
- 1分間に60回までのリクエスト制限
- ログイン試行は5分間に5回まで（総当たり攻撃を防ぐ）
- IPアドレスごとに制限（1人1人を見分ける）

### 5. セキュリティイベントの監視
アプリが自動的に以下を記録:
- 不正なログイン試行
- 怪しいアクセスパターン
- セキュリティ違反の検知

## 🚀 ステップ5: デプロイ実行

### 初回デプロイ
1. 環境変数をすべて設定したら
2. 「Deploy」ボタンをクリック
3. 3〜5分待つ
4. 「Visit」をクリックしてアプリを確認！

### データベースの初期化

#### 方法1: Vercel CLIを使う方法（推奨）
1. まず、Vercel CLIをインストール:
   ```bash
   npm install -g vercel
   ```

2. Vercelにログイン:
   ```bash
   vercel login
   ```

3. 環境変数をダウンロード:
   ```bash
   vercel env pull .env.production.local
   ```

4. データベースを初期化:
   ```bash
   pnpm db:push
   ```

#### 方法2: 手動で環境変数を設定する方法
1. Vercelダッシュボードから環境変数をコピー
2. `.env.production.local`ファイルを作成
3. DATABASE_URLを貼り付け
4. `pnpm db:push`を実行

## 🔄 ステップ6: 自動デプロイの設定

GitHubにコードをプッシュすると自動的にデプロイされます！

1. mainブランチへのプッシュ → 本番環境へデプロイ
2. その他のブランチ → プレビュー環境へデプロイ

## 📊 ステップ7: 監視とメンテナンス

### ログの確認
1. Vercelダッシュボードで「Functions」タブ
2. 各API関数をクリックして詳細を見る
3. 「Logs」でリアルタイムログを確認
4. エラーが出ていないかチェック！

### アラートの設定
1. 「Settings」→「Notifications」
2. 「Add Notification」をクリック
3. 以下を設定:
   - **Event**: Function Error（関数エラー）
   - **Channel**: Email（メール）
   - 通知先メールアドレスを入力

### パフォーマンスの確認
1. 「Analytics」タブで訪問者数を確認
2. 「Speed Insights」で表示速度をチェック
3. 遅い場合は画像を小さくするなど最適化を検討

## ⚠️ 注意事項

### してはいけないこと
- ❌ 環境変数を他の人に教える
- ❌ 環境変数をGitHubにアップロードする
- ❌ JWT_SECRETとCSRF_SECRETを同じにする

### した方がいいこと
- ✅ 定期的にパスワードを変更
- ✅ アクセスログを確認
- ✅ エラーが出たらすぐに確認

## 🆘 困ったときは

### よくあるエラーと解決方法

#### 1. 「Database connection failed」
- **原因**: DATABASE_URLが間違っている
- **解決**: 環境変数を確認し、正しい値を設定

#### 2. 「Authentication failed」  
- **原因**: JWT_SECRETが設定されていない
- **解決**: 環境変数にJWT_SECRETを追加

#### 3. 「CSRF token invalid」
- **原因**: CSRF_SECRETが設定されていない
- **解決**: 環境変数にCSRF_SECRETを追加

#### 4. ビルドエラー
- **原因**: コードにエラーがある
- **解決**: ローカルで`pnpm build`を実行してエラーを確認

#### 5. 「Module not found」エラー
- **原因**: パッケージがインストールされていない
- **解決**: `pnpm install`を実行してから再度デプロイ

#### 6. 「Environment variable not found」
- **原因**: 必要な環境変数が設定されていない
- **解決**: すべての必須環境変数（DATABASE_URL、JWT_SECRET、CSRF_SECRET、IP_HASH_SALT、CRON_SECRET）を確認

## 🎉 完成！

おめでとうございます！アプリがインターネットに公開されました！

### 確認項目チェックリスト
- [ ] アプリのURLにアクセスできる
- [ ] ユーザー登録ができる
- [ ] ログインができる
- [ ] セットリストが作成できる
- [ ] 画像のダウンロードができる

## 📚 もっと詳しく知りたい人へ

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [環境変数について](https://vercel.com/docs/environment-variables)

---

💡 **ヒント**: わからないことがあったら、エラーメッセージをよく読んで、1つずつ解決していきましょう！