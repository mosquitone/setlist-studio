# Prismaマイグレーション初期セットアップガイド

このガイドでは、既存のデータベースにPrismaマイグレーションシステムを導入する方法を説明します。

## 📋 前提条件

- Node.js がインストールされていること
- pnpm がインストールされていること（`npm install -g pnpm`）
- PostgreSQL データベースが稼働していること
- `.env.local`（ローカル用）と `.env.vercel`（本番用）が設定されていること

## 🎯 なぜマイグレーションが必要か？

現在、`prisma db push`を使用してデータベースを管理していますが、これには以下の問題があります：

- **履歴が残らない**: どのような変更をいつ行ったか分からない
- **チーム開発が困難**: 他の開発者がDBの変更を追跡できない
- **ロールバックできない**: 問題が発生しても前の状態に戻せない

マイグレーションシステムを使うことで、これらの問題を解決できます。

## 🚀 セットアップ手順

### ステップ1: 環境変数の確認

**`.env.local`の確認**
```bash
# 以下の2つが設定されているか確認
DATABASE_URL="postgresql://postgres:postgres_dev_secure@localhost:5432/setlist_generator"
SHADOW_DATABASE_URL="postgresql://postgres:postgres_dev_secure@localhost:5432/setlist_generator_shadow"
```

**`.env.vercel`の作成**（まだない場合）
```bash
# .env.localをコピーして作成
cp .env.local .env.vercel

# .env.vercelを編集して本番DBのURLに変更
DATABASE_URL="postgres://your-production-database-url"
# Shadow DBは本番環境では不要
```

### ステップ2: Shadow Database のセットアップ（ローカルのみ）

Shadow Databaseは、Prismaがマイグレーションを検証するために使用する一時的なデータベースです。

```bash
# Shadow DBを作成
pnpm db:setup:shadow

# 成功メッセージが表示されることを確認
# ✅ Shadow database 'setlist_generator_shadow' created successfully
```

### ステップ3: 現在のデータベース状態の確認

**ローカル環境の確認**
```bash
# 現在のマイグレーション状態を確認
pnpm db:migrate:status
```

**本番環境の確認**（慎重に！）
```bash
# 本番DBの状態を確認（読み取りのみ）
pnpm db:prod:migrate:status
```

### ステップ4: ベースライン化の実行

#### 🔴 ローカル環境の場合

**方法A: クリーンスタート（推奨）**
```bash
# 1. 既存のマイグレーションファイルをバックアップ
mv prisma/migrations prisma/migrations_backup

# 2. 新しいマイグレーションディレクトリを作成
mkdir -p prisma/migrations

# 3. 現在のスキーマから初回マイグレーションを作成
pnpm db:migrate:create --name init

# 4. 生成されたSQLを確認
cat prisma/migrations/*_init/migration.sql

# 5. マイグレーションを適用済みとしてマーク
pnpm prisma migrate resolve --applied "*_init"
```

**方法B: 既存のマイグレーションを活用**
```bash
# 既存のマイグレーションを順番に適用済みとしてマーク
pnpm prisma migrate resolve --applied "20250701120235_add_security_tables"
pnpm prisma migrate resolve --applied "20250718000000_add_audit_logs"
pnpm prisma migrate resolve --applied "20250727193129_add_token_unique_constraints"
```

#### 🔵 本番環境の場合（要注意！）

本番環境では、データ損失を避けるため、より慎重に作業する必要があります。

```bash
# 1. まず本番DBのバックアップを取る（重要！）
# Supabaseの場合: ダッシュボードからバックアップ
# その他: pg_dump等を使用

# 2. 本番環境の状態を確認
pnpm db:prod:migrate:status

# 3. ローカルと同じマイグレーションを適用済みとしてマーク
# 注意: 本番環境で実行するコマンドは慎重に！
NODE_ENV=production pnpm prisma migrate resolve --applied "20250701120235_add_security_tables" --schema ./prisma/schema.prisma
NODE_ENV=production pnpm prisma migrate resolve --applied "20250718000000_add_audit_logs" --schema ./prisma/schema.prisma
NODE_ENV=production pnpm prisma migrate resolve --applied "20250727193129_add_token_unique_constraints" --schema ./prisma/schema.prisma
```

### ステップ5: 動作確認

```bash
# ローカル環境の確認
pnpm db:migrate:status

# 出力例:
# Database schema is up to date!
# 
# Applied migrations:
# - 20250701120235_add_security_tables
# - 20250718000000_add_audit_logs
# - 20250727193129_add_token_unique_constraints
```

## 📝 今後の開発フロー

### 新しい機能を追加する場合

```bash
# 1. schema.prismaを編集
# 例: model NewFeature { ... } を追加

# 2. マイグレーションを作成
pnpm db:migrate:create --name add_new_feature

# 3. 生成されたSQLを確認
cat prisma/migrations/*_add_new_feature/migration.sql

# 4. 問題なければ適用
pnpm db:migrate

# 5. チームメンバーは以下を実行
git pull
pnpm db:migrate:deploy
```

### 本番環境への適用

```bash
# 1. マイグレーションファイルがGitにコミットされていることを確認
git status

# 2. 本番環境でマイグレーションを適用
pnpm db:prod:migrate:deploy

# または、Vercelの場合はビルドコマンドに含める
# package.jsonのbuildスクリプト:
# "build": "prisma migrate deploy && next build"
```

## 🆘 トラブルシューティング

### Shadow DBエラーが出る場合

```bash
# エラー: Shadow database error
# 解決法:
pnpm db:setup:shadow
# それでもダメなら、PostgreSQLに直接接続して作成
psql -U postgres -c "CREATE DATABASE setlist_generator_shadow;"
```

### マイグレーションが失敗する場合

```bash
# ローカル環境をリセット（データが消えるので注意！）
pnpm db:migrate:reset

# 特定のマイグレーションだけやり直す
pnpm prisma migrate resolve --rolled-back "migration_name"
pnpm db:migrate
```

### 本番環境でエラーが出た場合

```bash
# 1. 絶対にパニックにならない
# 2. エラーメッセージを記録
# 3. バックアップから復元できることを確認
# 4. 必要に応じて専門家に相談
```

## 📚 コマンドリファレンス

### ローカル環境用コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm db:migrate` | 新しいマイグレーションを作成・適用 |
| `pnpm db:migrate:create` | マイグレーションを作成（適用しない） |
| `pnpm db:migrate:deploy` | 既存のマイグレーションを適用 |
| `pnpm db:migrate:status` | 現在の状態を確認 |
| `pnpm db:migrate:reset` | DBをリセット（危険！） |

### 本番環境用コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm db:prod:migrate:deploy` | 本番環境にマイグレーションを適用 |
| `pnpm db:prod:migrate:status` | 本番環境の状態を確認 |
| `pnpm db:prod:push` | 緊急時のみ：schema.prismaを直接適用 |
| `pnpm db:prod:studio` | 本番DBをGUIで確認（読み取り推奨） |

## ✅ チェックリスト

- [ ] `.env.local`に`SHADOW_DATABASE_URL`が設定されている
- [ ] `.env.vercel`が作成され、本番DB情報が設定されている
- [ ] Shadow Databaseが作成されている（ローカル）
- [ ] 既存のマイグレーションがベースライン化されている
- [ ] `pnpm db:migrate:status`でエラーが出ない
- [ ] チームメンバーに変更を共有した

## 🎉 完了！

これで、Prismaマイグレーションシステムのセットアップが完了しました。
今後はデータベースの変更履歴が記録され、チーム開発がより安全になります。

質問や問題がある場合は、遠慮なくチームリーダーに相談してください。