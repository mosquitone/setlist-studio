# セキュリティアーキテクチャ

## 包括的セキュリティ実装
このアプリケーションは企業レベルのセキュリティ要件を満たすよう設計されています：

### 認証・認可
- **HttpOnly Cookie認証**: XSS攻撃を防ぐセキュアなトークン管理
- **JWTトークン検証**: 改ざん防止のためのデジタル署名
- **自動移行**: localStorage → HttpOnly Cookie自動移行
- **アクセス制御**: プライベート/パブリックセットリストの厳格なアクセス制御

### セキュリティモニタリング・ログ
- **データベースベースセキュリティログ**: Vercel Functions互換の永続ログシステム
- **脅威検出エンジン**: ブルートフォースと認証情報詰込み攻撃の検出
- **リアルタイムセキュリティイベント**: 不正アクセス試行の即座記録と解析
- **自動クリーンアップ**: Vercelクロン経由での古いセキュリティデータ自動削除

### 攻撃防御
- **CSRF保護**: タイミング攻撃耐性のDouble Submit Cookie + HMAC
- **レート制限**: IPスプーフィング防止付きデータベースベース分散レート制限
- **ログインジェクション保護**: 改行文字、制御文字、特殊文字のサニタイゼーション
- **IPスプーフィング防止**: 信頼できるプロキシ検証と安全なIP抽出

### データ保護
- **入力サニタイゼーション**: DOMPurify + カスタムバリデーション
- **SQLインジェクション防止**: Prisma ORM + パラメータ化クエリ
- **パスワードセキュリティ**: bcrypt 12ラウンド + 複雑性要件
- **機密データマスキング**: ログ出力での機密情報保護

### インフラストラクチャセキュリティ
- **Docker強化**: 非特権ユーザー、読み取り専用ルートFS、SCRAM-SHA-256認証
- **環境分離**: 本番/開発環境の完全分離
- **セキュリティヘッダー**: CSP、X-Frame-Optionsを含むセキュリティヘッダー
- **ネットワークセキュリティ**: localhost専用バインド、カスタムネットワーク分離

## セキュリティテーブル（データベーススキーマ）
```sql
-- レート制限追跡
RateLimitEntry: key, count, resetTime

-- セキュリティイベントログ
SecurityEvent: type, severity, timestamp, userId, ipAddress, details

-- 脅威活動解析
ThreatActivity: ipAddress, activityType, userId, timestamp, metadata
```

## トークンアーキテクチャ・実装詳細

### 1. JWT認証トークン
**目的**: ユーザー認証とセッション管理

**保存方法**: HttpOnly Cookie
```javascript
Cookie Name: 'auth_token'
HttpOnly: true          // XSS攻撃保護
Secure: production      // 本番でHTTPS専用
SameSite: 'strict'      // CSRF攻撃保護
Path: '/'               // 全パス
MaxAge: 86400           // 24時間（秒）
```

**JWTペイロード構造**:
```json
{
  "userId": "cuid_user_id",
  "email": "user@example.com", 
  "username": "username",
  "iat": 1704067200,
  "exp": 1704153600
}
```

**署名アルゴリズム**: `JWT_SECRET`によるHMAC SHA-256

**認証フロー**:
1. GraphQLログイン → JWTトークン生成
2. `POST /api/auth` → トークン検証 → HttpOnly Cookie設定
3. 後続リクエスト → 自動Cookie送信 → GraphQL認証
4. `DELETE /api/auth` → Cookie削除 → ログアウト

### 2. CSRF保護トークン
**目的**: クロスサイトリクエストフォージェリ攻撃保護

**実装**: Double Submit Cookie + HMACパターン

**トークン形式**:
```
形式: timestamp.randomValue.hmacSignature
例: 1704067200000.a1b2c3d4e5f6789.8f7e6d5c4b3a2190
```

**生成プロセス**:
```javascript
const timestamp = Date.now().toString()
const randomValue = randomBytes(16).toString('hex')
const payload = `${timestamp}.${randomValue}`
const signature = createHmac('sha256', CSRF_SECRET).update(payload).digest('hex')
const token = `${payload}.${signature}`
```

**配布方法**:
- **Cookie**: `csrf_token`（HttpOnly、一時的）
- **ヘッダー**: `x-csrf-token`（JavaScript読み取り可能）

**検証プロセス**:
1. リクエストヘッダーからCSRFトークンを抽出
2. Cookieから対応するトークンを取得
3. HMAC署名検証（`timingSafeEqual`使用）
4. タイムスタンプ有効性チェック
5. マッチ確認 → リクエスト承認

### 3. セキュリティシークレット管理

| シークレット | 目的 | 要件 | 保存 | ローテーション |
|--------|---------|--------------|---------|----------|
| `JWT_SECRET` | JWT署名・検証 | 32文字以上 | 環境変数 | 定期 |
| `CSRF_SECRET` | CSRF HMAC署名 | 32文字以上、JWT≠ | 環境変数 | 定期 |
| `IP_HASH_SALT` | IP匿名化ソルト | 16文字以上 | 環境変数 | 稀 |
| `CRON_SECRET` | クロン認証 | 32文字以上 | 環境変数 | 稀 |

### 4. トークンセキュリティ機能

**タイミング攻撃耐性**:
```javascript
// CSRFトークン検証
const isValid = timingSafeEqual(
  Buffer.from(receivedToken, 'hex'),
  Buffer.from(expectedToken, 'hex')
)
```

**XSS保護**:
- JWTトークン: HttpOnly Cookie → JavaScriptアクセス不可
- CSRFトークン: ヘッダー配布 → 限定アクセスのみ

**CSRF保護**:
- Double Submitパターン: Cookie + ヘッダー両方必須
- HMAC署名: サーバーサイド検証
- SameSite Cookie: ブラウザレベル保護

**改ざん保護**:
- JWT: 整合性保証のためのデジタル署名
- CSRF: 改ざん検出のためのHMAC-SHA256

### 5. トークンライフサイクル・管理

**JWTトークンライフサイクル**:
```
ログイン → 生成 → HttpOnly Cookieに保存 → 自動更新（24時間） → ログアウト/期限切れ
```

**CSRFトークンライフサイクル**:  
```
リクエスト → 生成 → 保存（Cookie+ヘッダー） → 検証 → 破棄
```

**自動クリーンアップ**:
- 期限切れレート制限エントリ: 自動削除
- セキュリティログ: Vercelクロン経由の定期削除
- 無効Cookie消去: 認証失敗時の自動実行

### 6. 開発環境 vs 本番環境設定

**開発環境**:
- Cookie Secure: false（HTTP許可）
- レート制限: 実質無制限（認証1000回/5分、API60回/分）
- 詳細ログ: 有効

**本番環境**:
- Cookie Secure: true（HTTPS必須）
- レート制限: 最適化済み（認証15回/15分、API300回/10分）
- セキュリティログ: データベース永続化

この実装はOWASP Top 10準拠と企業レベルセキュリティ要件を満たします。

## 本番セキュリティチェックリスト
- ✅ 全重要脆弱性修正
- ✅ CSRFタイミング攻撃緩和
- ✅ IPスプーフィング防止  
- ✅ localStorage XSS脆弱性排除
- ✅ レート制限での競合状態防止
- ✅ 脅威検出ロジックエラー修正
- ✅ ログインジェクション攻撃防止
- ✅ 包括的セキュリティイベント監視
- ✅ セキュリティデータ自動クリーンアップ
- ✅ Vercel Functions互換性