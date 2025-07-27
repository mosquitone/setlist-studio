# データベースマイグレーション完全ガイド

## 概要

このガイドでは、Prismaを使用したデータベースマイグレーションの開発から本番デプロイまでの流れを説明します。

## Shadow DBとは？

Shadow DBは**開発環境専用の安全装置**です。

```
メインDB (setlist_generator)         → 実際のデータが入っているDB
Shadow DB (setlist_generator_shadow) → マイグレーション検証用の空のDB
```

### なぜShadow DBが必要？

`prisma migrate dev`実行時の動作：

1. Shadow DBを**完全リセット**
2. 全マイグレーションを最初から適用
3. schema.prismaと比較して問題をチェック
4. 問題なければメインDBに適用

これにより、**破壊的な変更から本番データを守ります**。

## 環境設定

### 1. 環境変数ファイル

```bash
# .env.local (ローカル開発用)
DATABASE_URL="postgresql://postgres:password@localhost:5432/setlist_generator"
SHADOW_DATABASE_URL="postgresql://postgres:password@localhost:5432/setlist_generator_shadow"

# .env.vercel (本番デプロイ用) ※gitignoreに追加
DATABASE_URL="postgresql://user:password@production-host:5432/database"
# 本番環境にSHADOW_DATABASE_URLは不要
```

### 2. 初期セットアップ

```bash
# ローカルDBとShadow DBを作成
pnpm db:setup
pnpm db:setup:shadow

# Prismaクライアント生成
pnpm generate
```

## 開発フロー

### 1. スキーマ変更

```prisma
// prisma/schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String? // ← 新しいフィールドを追加
}
```

### 2. マイグレーション作成

```bash
# 開発環境でマイグレーションを作成
pnpm db:migrate:create --name add_user_name

# 自動的に以下が実行される：
# 1. Shadow DBでテスト
# 2. マイグレーションファイル生成
# 3. メインDBに適用
```

### 3. 確認

```bash
# マイグレーション状態を確認
pnpm db:migrate:status

# Prisma Studioで確認
pnpm db:studio
```

## 本番デプロイフロー

### 1. マイグレーションファイルをコミット

```bash
git add prisma/migrations/
git commit -m "feat: ユーザー名フィールドを追加"
git push
```

### 2. 本番環境の状態確認

```bash
# 本番DBの状態を確認
pnpm db:prod:migrate:status
```

### 3. 本番環境に適用

```bash
# 本番環境にマイグレーションを適用
pnpm db:prod:migrate:deploy

# 注意: 本番環境では以下は実行されません
# - Shadow DBの使用
# - スキーマのリセット
# - 自動的な変更検出
```

## コマンド一覧

### ローカル開発用

| コマンド | 説明 |
|---------|------|
| `pnpm db:migrate:create --name xxx` | 新しいマイグレーションを作成 |
| `pnpm db:migrate` | マイグレーションを適用 |
| `pnpm db:migrate:status` | 適用状態を確認 |
| `pnpm db:push` | スキーマを直接反映（マイグレーション履歴なし） |
| `pnpm db:studio` | Prisma Studioを起動 |

### 本番環境用

| コマンド | 説明 |
|---------|------|
| `pnpm db:prod:migrate:status` | 本番の適用状態を確認 |
| `pnpm db:prod:migrate:deploy` | 本番にマイグレーションを適用 |
| `pnpm db:prod:push` | 本番スキーマを直接反映（緊急時のみ） |

## ベストプラクティス

### ✅ やるべきこと

1. **開発環境で必ずテスト**
   ```bash
   pnpm db:migrate:create --name feature_name
   ```

2. **本番適用前に状態確認**
   ```bash
   pnpm db:prod:migrate:status
   ```

3. **破壊的変更は段階的に**
   ```prisma
   // Step 1: 新フィールドを追加（nullable）
   newField String?
   
   // Step 2: データ移行
   // Step 3: 必須化
   newField String
   ```

### ❌ やってはいけないこと

1. **本番環境で`db:push`を使わない**
   - マイグレーション履歴が残らない
   - ロールバックが困難

2. **未テストのマイグレーションを本番適用しない**
   - 必ずローカルでテスト

3. **Shadow DBを本番で使わない**
   - 開発専用の機能

## トラブルシューティング

### マイグレーションエラー

```bash
# リセットして最初から（開発環境のみ）
pnpm db:migrate:reset

# 特定のマイグレーションを修正
pnpm db:migrate:resolve --applied "20250728000000_xxx"
```

### 本番環境での緊急対応

```bash
# 1. バックアップを取る
pg_dump $DATABASE_URL > backup.sql

# 2. 問題のあるマイグレーションをロールバック
# （手動でSQLを実行）

# 3. マイグレーション履歴を修正
UPDATE _prisma_migrations SET rolled_back_at = NOW() WHERE id = 'xxx';
```

## まとめ

1. **開発**: Shadow DBで安全にテスト → メインDBに適用
2. **本番**: 検証済みマイグレーションのみを慎重に適用
3. **Shadow DBは開発の安全装置**として重要な役割を果たす

これにより、データベースの変更を安全かつ確実に管理できます。