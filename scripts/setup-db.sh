#!/bin/bash
# PostgreSQL初回セットアップスクリプト
# SCRAM-SHA-256認証に対応した安全な初期化

echo "🔧 PostgreSQL初回セットアップを開始します..."

# 1. セキュリティ設定を一時的に無効化
echo "📝 セキュリティ設定を一時的に無効化..."
sed -i.bak 's/user: "999:999"/# user: "999:999"/' docker-compose.yml
sed -i.bak 's/read_only: true/# read_only: true/' docker-compose.yml

# 2. 既存のコンテナとボリュームをクリーンアップ
echo "🧹 既存のコンテナとボリュームをクリーンアップ..."
docker-compose down -v

# 3. PostgreSQLを起動して初期化
echo "🚀 PostgreSQLを起動して初期化..."
docker-compose up -d postgres

# 4. 初期化完了を待つ
echo "⏳ 初期化完了を待っています..."
sleep 10

# 5. データベーススキーマを適用
echo "📊 データベーススキーマを適用..."
pnpm db:push

# 6. セキュリティ設定を再度有効化
echo "🔒 セキュリティ設定を再度有効化..."
sed -i.bak 's/# user: "999:999"/user: "999:999"/' docker-compose.yml
sed -i.bak 's/# read_only: true/read_only: true/' docker-compose.yml

# 7. セキュアな設定でコンテナを再起動
echo "🔐 セキュアな設定でコンテナを再起動..."
docker-compose up -d postgres

# 8. バックアップファイルを削除
rm -f docker-compose.yml.bak

echo "✅ PostgreSQL初回セットアップが完了しました！"
echo "🎉 開発サーバーを起動するには 'pnpm dev' を実行してください"