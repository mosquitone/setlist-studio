# API Routes詳細

## エンドポイント一覧

| エンドポイント | メソッド | 目的 | 認証要否 |
|---------------|---------|------|----------|
| `/api/auth` | GET, POST, DELETE | JWT認証管理 | GET: 要、POST/DELETE: 不要 |
| `/api/auth/google-sync` | POST | Google認証ユーザーのメール変更・同期 | 要 |
| `/api/csrf` | GET | CSRFトークン生成 | 不要 |
| `/api/graphql` | GET, POST | メインGraphQL API | リゾルバー依存 |
| `/api/security/cleanup` | GET, POST | セキュリティデータクリーンアップ | GET: CRON_SECRET、POST: 開発環境のみ |

## 各エンドポイント詳細

### 1. `/api/auth` - 認証管理
**目的**: JWTトークンをHttpOnly Cookieで管理し、クライアントサイドの認証状態を維持

**メソッド別機能**:
- **GET**: 現在の認証状態を確認
  - レスポンス: `{ authenticated: boolean, user?: { id, email, username } }`
- **POST**: JWTトークンをHttpOnly Cookieに設定
  - リクエスト: `{ token: "JWT_TOKEN" }`
  - レスポンス: `{ success: true, user: { id, email, username } }`
- **DELETE**: ログアウト（Cookie削除）

**セキュリティ機能**:
- HttpOnly Cookie（XSS防御）
- Secure flag（本番環境でHTTPS必須）
- SameSite=strict（CSRF防御）
- 2時間の有効期限
- 無効トークンの自動クリーンアップ

### 2. `/api/auth/google-sync` - Google認証同期
**目的**: Google認証でのログイン処理とメールアドレス同期

**機能**:
- Google OAuth認証後のユーザー作成・ログイン
- 既存ユーザーのGoogle認証によるメールアドレス更新
- 認証プロバイダーの更新:
  - `email` → `google`: メール認証ユーザーがGoogle認証でメールアドレス変更
  - `google` → `google`: Google認証ユーザーがGoogle認証で別のメールアドレスに変更
- 既存メール認証ユーザーとの重複検出・防止

**セキュリティ**:
- NextAuth認証セッション必須
- メールアドレス重複チェック
- 既存アカウント検出時の適切なエラー処理
- 早期returnパターンによるエラーハンドリング

### 3. `/api/csrf` - CSRF保護
**目的**: Cross-Site Request Forgeryを防ぐためのトークン生成

**特徴**:
- 暗号学的に安全なトークン生成
- Double Submit Cookieパターン実装
- GETメソッドのみサポート

### 4. `/api/graphql` - メインAPI
**目的**: アプリケーションの全ビジネスロジックを処理するGraphQLエンドポイント

**機能**:
- Type-GraphQLによるスキーマファースト開発
- Prisma ORMを使用したデータベース操作
- ユーザー、楽曲、セットリスト管理

**セキュリティ機能**:
- **レート制限**: 
  - 一般API: データベースベースの分散対応
  - 認証操作（login/register）: 強化レート制限（より厳格な制限）
- **CSRF保護**: 全POSTリクエストに適用
- **クエリ深度制限**: 最大10レベル（DoS攻撃防御）
- **イントロスペクション**: 本番環境で無効化
- **エラーハンドリング**:
  - 本番: ユーザーフレンドリーなエラー、システムエラーはサニタイズ
  - 開発: 詳細なデバッグ情報
- **リクエストサイズ制限**: 4MB（Next.jsデフォルト）

### 5. `/api/security/cleanup` - セキュリティメンテナンス
**目的**: セキュリティ関連データの定期的なクリーンアップ（Vercel Cron Jobs用）

**機能**:
- 期限切れレート制限エントリの削除
- 古い脅威検知アクティビティの削除
- 古いセキュリティイベントログの削除

**実行方法**:
- **GET**: Vercel Cronジョブ（毎日午前2時）
  - 要Bearer Token: `Authorization: Bearer ${CRON_SECRET}`
- **POST**: 開発環境での手動実行

**レスポンス例**:
```json
{
  "success": true,
  "timestamp": "2025-07-09T02:00:00.000Z",
  "duration": "123ms",
  "cleaned": {
    "rateLimitEntries": 45,
    "threatActivities": 12,
    "securityEvents": 89
  }
}
```

## API セキュリティアーキテクチャ

1. **多層防御**: 認証、CSRF、レート制限の複数セキュリティレイヤー
2. **セキュアバイデフォルト**: HttpOnly Cookie、本番HTTPS、厳格なCORS
3. **パフォーマンス最適化**: データベースベースレート制限、遅延サーバー初期化
4. **本番対応**: 環境別設定、適切なエラーハンドリング
5. **自動メンテナンス**: セキュリティデータの定期クリーンアップ
6. **エンタープライズグレード**: OWASPベストプラクティス準拠