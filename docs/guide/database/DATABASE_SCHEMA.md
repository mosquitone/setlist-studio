# データベーススキーマ定義

このドキュメントは、Setlist Studioのデータベーステーブル構造について説明します。

## 概要

Setlist StudioはPostgreSQLデータベースを使用し、Prisma ORMで管理されています。データベースには以下の主要テーブルが含まれています。

## テーブル一覧

### 1. User (users)

ユーザー情報を管理するテーブルです。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | ユーザー固有ID | PK, CUID |
| email | String | メールアドレス | UNIQUE, NOT NULL |
| username | String | ユーザー名 | NOT NULL |
| password | String | ハッシュ化されたパスワード | NOT NULL |
| emailVerified | Boolean | メール認証完了フラグ | DEFAULT false |
| authProvider | String | 認証プロバイダー（email/google） | DEFAULT "email" |
| pendingEmail | String? | 変更予定のメールアドレス | NULL可 |
| pendingPassword | String? | Google→メール認証移行時の一時パスワード | NULL可 |
| emailVerificationToken | String? | メール認証トークン | UNIQUE, NULL可 |
| emailVerificationExpires | DateTime? | メール認証トークン有効期限 | NULL可 |
| passwordResetToken | String? | パスワードリセットトークン | UNIQUE, NULL可 |
| passwordResetExpires | DateTime? | パスワードリセットトークン有効期限 | NULL可 |
| emailChangeToken | String? | メールアドレス変更トークン | UNIQUE, NULL可 |
| emailChangeExpires | DateTime? | メールアドレス変更トークン有効期限 | NULL可 |
| createdAt | DateTime | 作成日時 | DEFAULT now() |
| updatedAt | DateTime | 更新日時 | 自動更新 |

**リレーション:**
- songs: 1対多（ユーザーが作成した楽曲）
- setlists: 1対多（ユーザーが作成したセットリスト）
- securityEvents: 1対多（セキュリティイベント）
- emailHistories: 1対多（メールアドレス変更履歴）
- usedTokens: 1対多（使用済みトークン）

### 2. Song (songs)

楽曲情報を管理するテーブルです。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | 楽曲固有ID | PK, CUID |
| title | String | 楽曲タイトル | NOT NULL |
| artist | String? | アーティスト名 | NULL可 |
| duration | Int? | 演奏時間（秒） | NULL可 |
| key | String? | キー | NULL可 |
| tempo | Int? | テンポ（BPM） | NULL可 |
| notes | String? | メモ | NULL可 |
| userId | String | 所有者のユーザーID | FK, NOT NULL |
| createdAt | DateTime | 作成日時 | DEFAULT now() |
| updatedAt | DateTime | 更新日時 | 自動更新 |

**リレーション:**
- user: 多対1（楽曲の所有者）

### 3. Setlist (setlists)

セットリスト情報を管理するテーブルです。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | セットリスト固有ID | PK, CUID |
| title | String | セットリストタイトル | NOT NULL |
| eventName | String? | イベント名 | NULL可 |
| eventDate | DateTime? | イベント日 | NULL可 |
| openTime | String? | 開場時間 | NULL可 |
| startTime | String? | 開演時間 | NULL可 |
| theme | String? | テーマ（basic/white） | NULL可 |
| isPublic | Boolean | 公開フラグ | DEFAULT false |
| artistName | String? | アーティスト名 | NULL可 |
| userId | String | 所有者のユーザーID | FK, NOT NULL |
| createdAt | DateTime | 作成日時 | DEFAULT now() |
| updatedAt | DateTime | 更新日時 | 自動更新 |

**リレーション:**
- user: 多対1（セットリストの所有者）
- items: 1対多（セットリスト内の楽曲）

### 4. SetlistItem (setlist_items)

セットリストと楽曲を結ぶ中間テーブルです。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | アイテム固有ID | PK, CUID |
| title | String | 楽曲タイトル | NOT NULL |
| note | String? | 演奏メモ | NULL可 |
| order | Int | 表示順序 | NOT NULL |
| setlistId | String | セットリストID | FK, NOT NULL |

**制約:**
- UNIQUE: [setlistId, order]（同一セットリスト内で順序重複不可）

**リレーション:**
- setlist: 多対1（所属するセットリスト）

### 5. RateLimitEntry (rate_limit_entries)

レート制限情報を管理するテーブルです。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | エントリ固有ID | PK, CUID |
| key | String | レート制限キー（IPアドレス等） | UNIQUE, NOT NULL |
| count | Int | リクエスト回数 | DEFAULT 1 |
| resetTime | DateTime | リセット時刻 | NOT NULL |
| createdAt | DateTime | 作成日時 | DEFAULT now() |
| updatedAt | DateTime | 更新日時 | 自動更新 |

**インデックス:**
- resetTime

### 6. SecurityEvent (security_events)

セキュリティイベントを記録するテーブルです。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | イベント固有ID | PK, CUID |
| type | String | イベントタイプ | NOT NULL |
| severity | String | 重要度 | NOT NULL |
| timestamp | DateTime | 発生日時 | DEFAULT now() |
| userId | String? | 関連ユーザーID | FK, NULL可 |
| ipAddress | String? | IPアドレス | NULL可 |
| userAgent | String? | ユーザーエージェント | NULL可 |
| resource | String? | 対象リソース | NULL可 |
| details | Json? | 詳細情報 | NULL可 |

**インデックス:**
- timestamp
- ipAddress
- type
- severity
- [userId, type, timestamp]（複合インデックス）

**リレーション:**
- user: 多対1（関連ユーザー、NULL可）

### 7. ThreatActivity (threat_activities)

脅威アクティビティを記録するテーブルです。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | アクティビティ固有ID | PK, CUID |
| ipAddress | String | IPアドレス | NOT NULL |
| activityType | String | アクティビティタイプ | NOT NULL |
| userId | String? | 関連ユーザーID | NULL可 |
| userAgent | String? | ユーザーエージェント | NULL可 |
| timestamp | DateTime | 発生日時 | DEFAULT now() |
| metadata | Json? | メタデータ | NULL可 |

**インデックス:**
- [ipAddress, timestamp]（複合インデックス）
- activityType
- timestamp

### 8. AuditLog (audit_logs)

監査ログを記録するテーブルです。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | ログ固有ID | PK, CUID |
| eventType | String | イベントタイプ | NOT NULL |
| outcome | String | 結果（success/failure） | NOT NULL |
| timestamp | DateTime | 発生日時 | DEFAULT now() |
| userId | String? | 関連ユーザーID | NULL可 |
| ipAddress | String? | IPアドレス | NULL可 |
| userAgent | String? | ユーザーエージェント | NULL可 |
| riskLevel | String | リスクレベル | NOT NULL |
| details | Json? | 詳細情報 | NULL可 |

**インデックス:**
- timestamp
- eventType
- riskLevel
- userId
- ipAddress

### 9. EmailHistory (email_histories)

メールアドレス変更履歴を記録するテーブルです。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | 履歴固有ID | PK, CUID |
| userId | String | ユーザーID | FK, NOT NULL |
| oldEmail | String | 変更前メールアドレス | NOT NULL |
| newEmail | String | 変更後メールアドレス | NOT NULL |
| changeMethod | String | 変更方法（email/google） | NOT NULL |
| changedAt | DateTime | 変更日時 | DEFAULT now() |
| ipAddress | String? | IPアドレス | NULL可 |
| userAgent | String? | ユーザーエージェント | NULL可 |
| authProvider | String? | 認証プロバイダー | NULL可 |
| lastUsedAt | DateTime? | 最終使用日時 | NULL可 |
| verificationSent | Boolean | 認証メール送信済みフラグ | DEFAULT false |

**インデックス:**
- userId
- oldEmail
- newEmail
- changedAt

**リレーション:**
- user: 多対1（メールアドレスを変更したユーザー）

### 10. UsedToken (used_tokens)

使用済みトークンを記録するテーブルです（90日間保持）。

| カラム名 | 型 | 説明 | 制約 |
|---------|---|------|-----|
| id | String | トークン固有ID | PK, CUID |
| token | String | トークン値 | NOT NULL |
| tokenType | String | トークンタイプ（emailChange/passwordReset/emailVerification） | NOT NULL |
| userId | String? | 関連ユーザーID | FK, NULL可 |
| usedAt | DateTime | 使用日時 | DEFAULT now() |
| ipAddress | String? | IPアドレス | NULL可 |
| userAgent | String? | ユーザーエージェント | NULL可 |
| success | Boolean | 成功フラグ | DEFAULT false |
| reason | String? | 使用結果の理由（expired/invalid/already_used等） | NULL可 |
| expiresAt | DateTime | 削除予定日（90日後） | NOT NULL |

**インデックス:**
- token
- userId
- tokenType
- usedAt
- expiresAt

**リレーション:**
- user: 多対1（トークンを使用したユーザー、NULL可）

## データ削除ポリシー

### カスケード削除
- ユーザー削除時：関連する楽曲、セットリスト、メール履歴が自動削除されます
- セットリスト削除時：関連するSetlistItemが自動削除されます

### SetNull削除
- ユーザー削除時：関連するSecurityEvent、UsedTokenのuserIdがNULLに設定されます（ログは保持）

### 定期クリーンアップ
- RateLimitEntry: 期限切れエントリーを定期削除
- SecurityEvent/ThreatActivity/AuditLog: 古いログを定期削除
- UsedToken: 90日経過後に自動削除

## 更新履歴

- 2025-07-29: 初版作成（全10テーブルの詳細定義）