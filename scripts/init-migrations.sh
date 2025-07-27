#!/bin/bash
# 既存のマイグレーションを「適用済み」としてマークするスクリプト

echo "Initializing Prisma migration history..."

# _prisma_migrationsテーブルを作成
pnpm prisma migrate deploy

# 既存のマイグレーションを適用済みとしてマーク
echo "Marking existing migrations as applied..."

prisma migrate resolve --applied "20250701120235_add_security_tables"
prisma migrate resolve --applied "20250718000000_add_audit_logs"
prisma migrate resolve --applied "20250727193129_add_token_unique_constraints"

echo "✅ Migration history initialized successfully"
echo ""
echo "You can now use 'pnpm db:migrate' for future schema changes"