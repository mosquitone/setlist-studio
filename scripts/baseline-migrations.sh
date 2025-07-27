#!/bin/bash
# Prismaマイグレーションのベースライン化スクリプト

echo "🚀 Prismaマイグレーションのベースライン化を開始します"
echo ""

# 環境変数の確認
if [ ! -f ".env.local" ]; then
    echo "❌ エラー: .env.local が見つかりません"
    exit 1
fi

# Shadow DBの確認
echo "1️⃣ Shadow Database の確認..."
if grep -q "SHADOW_DATABASE_URL" .env.local; then
    echo "✅ SHADOW_DATABASE_URL が設定されています"
else
    echo "⚠️  SHADOW_DATABASE_URL が設定されていません"
    echo "   実行: pnpm db:setup:shadow"
    exit 1
fi

# 現在の状態を確認
echo ""
echo "2️⃣ 現在のマイグレーション状態を確認..."
pnpm db:migrate:status

# ユーザーに確認
echo ""
echo "3️⃣ ベースライン化の方法を選択してください:"
echo "   1) クリーンスタート（既存のマイグレーションを削除して作り直す）"
echo "   2) 既存のマイグレーションを使用（推奨）"
echo "   3) キャンセル"
echo ""
read -p "選択 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "⚠️  警告: この操作により既存のマイグレーションファイルが削除されます"
        read -p "続行しますか？ (y/N): " confirm
        if [ "$confirm" = "y" ]; then
            # バックアップ作成
            if [ -d "prisma/migrations" ]; then
                mv prisma/migrations prisma/migrations_backup_$(date +%Y%m%d_%H%M%S)
                echo "✅ 既存のマイグレーションをバックアップしました"
            fi
            
            # 新しいマイグレーションを作成
            mkdir -p prisma/migrations
            pnpm db:migrate:create --name init
            
            # 適用済みとしてマーク
            MIGRATION_NAME=$(ls prisma/migrations | grep "_init$" | head -1)
            if [ -n "$MIGRATION_NAME" ]; then
                pnpm prisma migrate resolve --applied "$MIGRATION_NAME"
                echo "✅ 初回マイグレーションを作成し、適用済みとしてマークしました"
            fi
        else
            echo "❌ キャンセルしました"
            exit 0
        fi
        ;;
    2)
        echo ""
        echo "4️⃣ 既存のマイグレーションを適用済みとしてマークします..."
        
        # マイグレーションリスト
        migrations=(
            "20250701120235_add_security_tables"
            "20250718000000_add_audit_logs"
            "20250727193129_add_token_unique_constraints"
        )
        
        for migration in "${migrations[@]}"; do
            echo "   処理中: $migration"
            pnpm prisma migrate resolve --applied "$migration" 2>/dev/null
            if [ $? -eq 0 ]; then
                echo "   ✅ $migration を適用済みとしてマークしました"
            else
                echo "   ℹ️  $migration は既に処理済みまたは存在しません"
            fi
        done
        ;;
    3)
        echo "❌ キャンセルしました"
        exit 0
        ;;
    *)
        echo "❌ 無効な選択です"
        exit 1
        ;;
esac

# 最終確認
echo ""
echo "5️⃣ 最終確認..."
pnpm db:migrate:status

echo ""
echo "✅ ベースライン化が完了しました！"
echo ""
echo "📝 次のステップ:"
echo "   - 新しい機能を追加する場合: pnpm db:migrate --name feature_name"
echo "   - チームメンバーは: git pull && pnpm db:migrate:deploy"
echo "   - 本番環境への適用: pnpm db:prod:migrate:deploy"