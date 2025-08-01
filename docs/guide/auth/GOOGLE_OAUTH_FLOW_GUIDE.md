# Google認証フロー 初心者向けガイド

このドキュメントでは、Setlist StudioにおけるGoogle認証の仕組みを初心者にも分かりやすく解説します。

## 📌 Google認証とは？

Google認証（OAuth 2.0）は、ユーザーがGoogleアカウントを使ってアプリケーションにログインできる仕組みです。パスワードを新しく作る必要がなく、Googleのセキュアな認証システムを利用できます。

## 🎯 なぜGoogle認証を使うの？

1. **簡単ログイン**: パスワードを覚える必要がない
2. **高セキュリティ**: Googleの2段階認証などを利用可能
3. **素早い登録**: メールアドレスの確認が不要
4. **信頼性**: Googleの認証基盤を利用

## 🔄 認証フローの全体像

```
ユーザー → Setlist Studio → Google → Setlist Studio → ユーザー
```

詳しい流れを見ていきましょう！

## 📖 Step by Step: Google認証の流れ

### 1️⃣ ユーザーが「Googleでログイン」ボタンをクリック

```
[Googleでログイン] ← ユーザーがクリック
```

- `/login` または `/register` ページにあるボタン
- `GoogleAuthButton` コンポーネントが処理

### 2️⃣ Googleの認証画面へリダイレクト

```
Setlist Studio → accounts.google.com
```

- NextAuth.jsが自動的にGoogleへリダイレクト
- ユーザーはGoogleアカウントを選択
- 必要に応じてGoogleにログイン

### 3️⃣ ユーザーが許可を与える

```
Google: 「Setlist Studioがあなたの情報にアクセスすることを許可しますか？」
ユーザー: [許可する] をクリック
```

- 初回のみ表示される
- メールアドレスと基本情報へのアクセスを許可

### 4️⃣ Googleから認証情報を受け取る

```
Google → Setlist Studio (/api/auth/callback/google)
```

- Googleが認証コードを発行
- NextAuthが自動的に処理
- ユーザー情報（メール、名前）を取得

### 5️⃣ ユーザー情報の同期処理

```
/api/auth/callback/google → /api/auth/google-sync
```

ここで以下の処理が行われます：

#### 新規ユーザーの場合
1. メールアドレスが既に使われていないかチェック
2. 新しいユーザーアカウントを作成
3. ユーザー名を自動生成（例: "user-123456"）
4. 認証プロバイダーを "google" として記録

#### 既存ユーザーの場合
1. 同じGoogleアカウントでの再ログインなら許可
2. メール認証で登録済みの場合はエラー表示

### 6️⃣ JWTトークンの発行

```
サーバー: JWTトークンを生成
↓
HttpOnly Cookieとして設定
```

- ユーザーIDとメールアドレスを含む
- 30日間有効
- JavaScriptからアクセスできない安全なCookie

### 7️⃣ ホーム画面へリダイレクト

```
/api/auth/google-sync → / （ホーム画面）
```

- ログイン成功！
- ユーザーは認証済み状態でアプリを利用開始

## 🔐 セキュリティ機能

### 重複アカウント防止
- 同じメールアドレスで複数の認証方法は使えません
- メール認証済みユーザーがGoogle認証を試みるとエラー

### レート制限
- 1時間に300回までの認証試行制限
- ブルートフォース攻撃を防止

### セキュリティログ
- すべての認証試行を記録
- 成功・失敗・新規作成を追跡

## 🔄 メールアドレス変更フロー

プロフィールページからGoogle認証でメールアドレスを変更する場合：

1. プロフィールページで「Googleで変更」をクリック
2. Googleにリダイレクト（別のアカウント選択可能）
3. 新しいメールアドレスで認証
4. システムがメールアドレスを更新
5. 認証方法も "google" に変更

## 🛠️ 技術的な実装詳細

### 使用ライブラリ
- **NextAuth.js**: Google OAuth統合
- **next-auth/providers/google**: Googleプロバイダー

### 主要ファイル
```
/src/lib/auth/nextauth.ts          # NextAuth設定
/src/app/api/auth/google-sync/     # 同期処理
/src/components/auth/GoogleAuthButton.tsx  # UIコンポーネント
```

### 環境変数
```env
GOOGLE_CLIENT_ID=xxxxx        # Google Cloud Consoleから取得
GOOGLE_CLIENT_SECRET=xxxxx    # Google Cloud Consoleから取得
```

## ❓ よくある質問

### Q: Googleアカウントを持っていない場合は？
A: メールアドレスでの登録をご利用ください。

### Q: 一度Google認証で登録したら、メール認証は使えない？
A: 同じメールアドレスでは一つの認証方法のみ使用可能です。

### Q: Google認証のパスワードは？
A: Google認証ではパスワードは使用しません。Googleアカウントの認証を利用します。

### Q: プライバシーは大丈夫？
A: メールアドレスと名前のみ取得し、他の情報にはアクセスしません。

## 🎯 まとめ

Google認証は、ユーザーにとって簡単で安全なログイン方法です。技術的には複雑な処理が行われていますが、ユーザーは「Googleでログイン」ボタンをクリックするだけで、すべてが自動的に処理されます。

開発者にとっても、NextAuth.jsを使用することで、セキュアな認証システムを簡単に実装できます。