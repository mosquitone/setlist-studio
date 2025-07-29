# デプロイメント関連ガイド

このディレクトリには、デプロイと運用に関するガイドが含まれています。

## ドキュメント一覧

### デプロイガイド
- [データベースマイグレーションガイド](./DATABASE_MIGRATION_GUIDE.md) - 開発から本番までのマイグレーション手順
- [Supabase最適化チェックリスト](./SUPABASE_OPTIMIZATION_CHECKLIST.md) - パフォーマンス最適化の実行手順

## 関連する技術仕様
- [Vercelデプロイ設定](../../claude/deployment/VERCEL_DEPLOYMENT.md)
- [環境変数一覧](../../claude/deployment/ENVIRONMENT_VARIABLES.md)

## デプロイ環境

### プラットフォーム
- **Vercel**: Next.jsアプリケーションのホスティング
- **Supabase**: PostgreSQLデータベース（本番環境）
- **Docker**: ローカル開発環境

### デプロイフロー
1. GitHubへのプッシュ
2. Vercelの自動デプロイ
3. 環境変数の設定確認
4. データベースマイグレーション（必要な場合）

## 環境別設定

### ローカル開発
- Docker PostgreSQL
- `.env.local`による環境変数管理
- Shadow DBでのマイグレーションテスト

### 本番環境
- Supabase PostgreSQL
- Vercel環境変数
- Connection Pooling有効化

## チェックリスト

### 初回デプロイ
- [ ] 環境変数の設定（[一覧参照](../../claude/deployment/ENVIRONMENT_VARIABLES.md)）
- [ ] データベース接続確認
- [ ] マイグレーション実行
- [ ] ヘルスチェック確認

### 更新デプロイ
- [ ] マイグレーションの必要性確認
- [ ] 環境変数の追加・変更確認
- [ ] パフォーマンステスト実行

## パフォーマンス最適化

### データベース接続
- Connection Pooling設定
- 適切なタイムアウト値
- インデックス最適化

### 測定と改善
- レスポンスタイム測定
- エラー率監視
- 定期的な最適化レビュー

## トラブルシューティング

### よくある問題

**接続エラー**
- DATABASE_URLの確認
- Supabaseのプロジェクト状態確認
- ネットワーク設定の確認

**マイグレーションエラー**
- Shadow DBの設定確認（開発環境）
- スキーマの整合性確認
- ロールバック手順の準備