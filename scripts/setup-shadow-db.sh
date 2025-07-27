#!/bin/bash
# Shadow Database セットアップスクリプト

echo "Setting up shadow database for Prisma migrations..."

# データベース接続情報
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="postgres_dev_secure"
MAIN_DB="setlist_generator"
SHADOW_DB="setlist_generator_shadow"

# Shadow DBの作成
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $SHADOW_DB;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Shadow database '$SHADOW_DB' created successfully"
else
    echo "ℹ️  Shadow database '$SHADOW_DB' already exists or failed to create"
fi

# 環境変数の設定例を表示
echo ""
echo "Add the following to your .env.local file:"
echo ""
echo "# Shadow database for Prisma migrations"
echo "SHADOW_DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$SHADOW_DB\""
echo ""
echo "Or run migrations with inline environment variable:"
echo "SHADOW_DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$SHADOW_DB\" pnpm prisma migrate dev"