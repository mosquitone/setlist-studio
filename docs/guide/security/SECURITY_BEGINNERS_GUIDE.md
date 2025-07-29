# セキュリティ初心者ガイド

このドキュメントでは、Setlist Studioのセキュリティ機能について、初心者にも分かりやすく解説します。技術的な詳細については[React XSS対策ガイド](./REACT_XSS_PROTECTION_GUIDE.md)も参照してください。

## 目次

1. [CSP（コンテンツセキュリティポリシー）](#cspコンテンツセキュリティポリシー)
2. [XSS（クロスサイトスクリプティング）対策](#xssクロスサイトスクリプティング対策)
3. [認証とセッション管理](#認証とセッション管理)
4. [CSRF（クロスサイトリクエストフォージェリ）対策](#csrfクロスサイトリクエストフォージェリ対策)
5. [レート制限と脅威検出](#レート制限と脅威検出)
6. [データ保護](#データ保護)

## CSP（コンテンツセキュリティポリシー）

### CSPとは？

CSP（Content Security Policy）は、Webサイトの「警備員」のような役割を果たすセキュリティ機能です。どのリソース（スクリプト、画像、スタイルなど）を読み込んでよいか、どこから読み込んでよいかを厳格にチェックします。

### なぜCSPが必要か？

主にXSS（クロスサイトスクリプティング）攻撃を防ぐために使用されます。XSSは、悪意のあるスクリプトをWebサイトに注入する攻撃手法で、以下のような被害をもたらす可能性があります：

- ユーザーのCookie情報の盗難
- セッション情報の漏洩
- 偽のログインフォームの表示
- 個人情報の不正取得

### Setlist StudioのCSP実装

```typescript
// middleware.ts
const cspHeader = [
  "default-src 'self'",                                          // 基本的に自サイトのリソースのみ許可
  `script-src 'self' 'wasm-unsafe-eval' 'nonce-${nonce}' https://accounts.google.com`, // スクリプトは自サイト+nonce付き+Google認証
  "style-src 'self' 'unsafe-inline'",                           // スタイルは自サイト+インライン許可（Material-UI用）
  "img-src 'self' data: https: blob:",                          // 画像は複数ソースから許可（画像生成・QRコード用）
  "font-src 'self' data:",                                      // フォントは自サイトとdata URIから許可
  "connect-src 'self' https://accounts.google.com",             // Ajax通信は自サイトとGoogle認証
  "frame-src https://accounts.google.com",                      // Google認証ポップアップ用
  "object-src 'none'",                                          // プラグイン無効化
  "base-uri 'self'",                                            // base要素制限
  "form-action 'self'",                                         // フォーム送信先は自サイトのみ
  "frame-ancestors 'none'",                                     // クリックジャッキング対策
].join('; ');
```

### nonce（ノンス）の仕組み

**nonce**は「Number used once（一度だけ使われる数値）」の略で、各リクエストごとに生成される一意のトークンです。

```typescript
// 各リクエストでランダムなnonceを生成
const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
```

#### nonceの使用例

```html
<!-- CSPで許可されたnonceを持つスクリプトのみ実行される -->
<script nonce="ABC123XYZ">
  console.log("このスクリプトは安全に実行されます");
</script>

<!-- nonceがないスクリプトはブロックされる -->
<script>
  alert("このスクリプトは実行されません！");
</script>
```

## XSS（クロスサイトスクリプティング）対策

### XSSとは？

XSSは、悪意のあるスクリプトをWebサイトに注入する攻撃手法です。簡単に言うと、「他人のブラウザで勝手にJavaScriptを実行させる攻撃」です。

#### 身近な例で理解するXSS

例えば、SNSのコメント欄を想像してください：

1. 攻撃者が悪意のあるコメントを投稿
2. 他のユーザーがそのページを開く
3. 悪意のあるスクリプトが実行される
4. ユーザーの情報が盗まれる

### CSPによるXSS防御

1. **インラインスクリプトの無効化**
   ```http
   Content-Security-Policy: script-src 'self'
   ```
   - `<script>alert('XSS')</script>` のようなインラインスクリプトをブロック

2. **外部スクリプトの制限**
   ```http
   Content-Security-Policy: script-src 'self' https://trusted.com
   ```
   - 許可されたドメインからのスクリプトのみ実行

3. **eval()の無効化**
   - 文字列からコードを実行する危険な関数を禁止

### 追加のXSS対策

#### 入力値のサニタイゼーション

```typescript
// src/lib/security/security-utils.ts
export const validateAndSanitizeInput = (
  input: string,
  maxLength: number = 1000
): string => {
  const trimmed = input.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`Input too long (max ${maxLength} characters)`);
  }
  return sanitizeText(trimmed); // DOMPurifyを使用してHTMLタグを除去
};
```

#### Reactの自動エスケープ（基本）

Reactは標準で安全な仕組みを提供しています：

```jsx
// ユーザーが入力した内容
const userComment = '<script>alert("攻撃！")</script>';

// Reactが自動的に無害化
<div>{userComment}</div>
// 画面には「<script>alert("攻撃！")</script>」と文字として表示される
```

詳しい技術的な解説は[React XSS対策ガイド](./REACT_XSS_PROTECTION_GUIDE.md)を参照してください。

## 認証とセッション管理

### HttpOnly Cookie + JWT

Setlist Studioでは、セキュアな認証システムを実装しています：

1. **HttpOnly Cookie**
   - JavaScriptからアクセスできないCookie
   - XSS攻撃によるトークン盗難を防止

2. **JWT（JSON Web Token）**
   - ユーザー情報を安全に保存
   - サーバー側で検証可能

```typescript
// Cookieの設定
response.cookies.set('auth_token', token, {
  httpOnly: true,     // JavaScriptからアクセス不可
  secure: true,       // HTTPS通信のみ（本番環境）
  sameSite: 'strict', // CSRF攻撃対策
  maxAge: 2 * 60 * 60, // 2時間有効（Google認証は30日）
});
```

### メール認証の必須化

- 新規登録時はメール認証が完了するまで機能を利用不可
- なりすまし登録を防止

### Google OAuth統合

- 既存のGoogleアカウントで安全にログイン
- パスワード管理が不要

## CSRF（クロスサイトリクエストフォージェリ）対策

### CSRFとは？

CSRFは、ユーザーが意図しない操作を実行させる攻撃手法です。

#### CSRF攻撃の例

```html
<!-- 悪意のあるサイト -->
<img src="https://example.com/delete-account?id=123">
```

ログイン中のユーザーがこのページを開くと、意図せずアカウントが削除される可能性があります。

### CSRF対策の実装

1. **CSRFトークン**
   ```typescript
   // トークンの生成
   const csrfToken = crypto.randomBytes(32).toString('hex');
   
   // GraphQLリクエストに含める
   headers: {
     'X-CSRF-Token': csrfToken
   }
   ```

2. **SameSite Cookie**
   ```typescript
   sameSite: 'strict'  // 他サイトからのリクエストでCookieを送信しない
   ```

## レート制限と脅威検出

### 適応的レート制限

正常な利用は妨げず、攻撃のみをブロックする仕組み：

```typescript
// レート制限の設定（本番環境）
const limits = {
  auth: {
    maxAttempts: 150,    // 1時間あたりの最大試行回数
    windowMs: 3600000,   // 1時間
  },
  api: {
    maxRequests: 400,    // 5分あたりの最大リクエスト数
    windowMs: 300000,    // 5分
  }
};
```

### ブルートフォース攻撃の検出

1. **IPベースの検出**
   - 同一IPから25回失敗で1時間ブロック

2. **分散攻撃の検出**
   - 30分で8ユーザーへの20試行でブロック

3. **正当なユーザーの保護**
   - 複数デバイスからのアクセスは許可
   - 一時的なネットワーク問題は考慮

### 監査ログ

```typescript
// 重要な操作をログに記録
await auditLogger.log({
  userId,
  action: 'LOGIN_ATTEMPT',
  ipAddress: hashedIp,
  userAgent,
  success: true,
  metadata: { provider: 'google' }
});
```

## データ保護

### 入力検証

すべての入力値を検証：

```typescript
// Yupによるスキーマ検証
const schema = Yup.object({
  title: Yup.string()
    .required('タイトルは必須です')
    .max(30, 'タイトルは30文字以内で入力してください'),
  artist: Yup.string()
    .required('アーティスト名は必須です')
    .max(20, 'アーティスト名は20文字以内で入力してください'),
});
```

### SQLインジェクション対策

Prismaを使用した安全なクエリ：

```typescript
// ✅ 安全：パラメータ化されたクエリ
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// ❌ 危険：文字列結合によるクエリ
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
```

### パスワードのハッシュ化

```typescript
// bcryptによる安全なハッシュ化
const hashedPassword = await bcrypt.hash(password, 10);

// パスワードの検証
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

## セキュリティのベストプラクティス

### 開発者向けのチェックリスト

- [ ] すべての入力値を検証・サニタイゼーション
- [ ] 出力時は適切にエスケープ
- [ ] HTTPSを使用（本番環境）
- [ ] セキュリティヘッダーを設定
- [ ] 定期的な依存関係の更新
- [ ] エラーメッセージに機密情報を含めない
- [ ] 最小権限の原則を適用

### ユーザー向けの推奨事項

1. **強力なパスワードの使用**
   - 8文字以上
   - 大文字・小文字・数字・記号を含む
   - 他のサービスと異なるパスワード

2. **定期的なパスワード変更**
   - 3-6ヶ月ごとの変更を推奨

3. **不審なメールに注意**
   - Setlist Studioからのメールは必ず公式ドメインから送信

4. **公共のWi-Fiでの注意**
   - 可能な限りVPNを使用

## まとめ

Setlist Studioは、複数のセキュリティレイヤーを実装することで、ユーザーのデータと体験を保護しています：

- **CSP**: XSS攻撃からの保護
- **CSRF対策**: 意図しない操作の防止
- **認証システム**: 安全なユーザー管理
- **レート制限**: 攻撃の検出とブロック
- **データ保護**: 入力検証とハッシュ化

これらの機能により、安心してサービスをご利用いただけます。

## 関連ドキュメント

### 初心者向け
- **現在のドキュメント** - セキュリティの基本概念
- [React XSS対策ガイド](./REACT_XSS_PROTECTION_GUIDE.md) - Reactの安全機能の詳細

### 上級者向け
- [SECURITY.md](../../SECURITY.md) - 詳細な技術仕様
- [SECURITY_TEST_PLAN.md](./SECURITY_TEST_PLAN.md) - セキュリティテスト計画