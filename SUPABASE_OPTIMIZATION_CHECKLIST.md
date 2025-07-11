# Supabase最適化チェックリスト

## 実行手順

### ✅ 1. Vercel環境変数更新
- [ ] Vercelダッシュボードにアクセス
- [ ] Settings → Environment Variables
- [ ] DATABASE_URLを以下に更新:

```bash
DATABASE_URL="postgresql://postgres.your_user:your_password@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=20&pool_timeout=30&statement_timeout=30000&connect_timeout=60&application_name=setlist-studio&pool_mode=transaction"
```

- [ ] Production, Preview, Developmentに適用
- [ ] 保存

### ✅ 2. Supabaseダッシュボード確認
- [ ] https://supabase.com/dashboard にアクセス
- [ ] プロジェクト選択
- [ ] Settings → Database
- [ ] Connection poolingの設定確認

### ✅ 3. デプロイ
- [ ] 設定変更後、Vercelで自動デプロイ開始
- [ ] デプロイ完了まで待機（約2-3分）

### ✅ 4. 動作確認
- [ ] 以下のコマンドでレスポンス時間測定:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"query":"query { __typename }"}' \
  https://setlist-studio.mosquit.one/api/graphql \
  -w "Time: %{time_total}s\n"
```

- [ ] 3回測定して平均値を記録
- [ ] 改善確認（目標: 1.39秒 → 0.3-0.5秒）

## 期待される改善効果

### パフォーマンス
- **現在**: 1.39秒
- **最適化後**: 0.3-0.5秒
- **改善率**: 70-80%

### 改善項目
- ✅ 接続プール効率化
- ✅ タイムアウト最適化
- ✅ 接続数制限による安定性
- ✅ トランザクション単位プール

## トラブルシューティング

### 問題: 接続エラー
**原因**: 接続文字列の誤り
**対処**: 
1. Supabaseダッシュボードで正しい接続文字列を確認
2. パスワードに特殊文字が含まれる場合はURLエンコード

### 問題: 改善効果が少ない
**原因**: Connection poolingが有効化されていない
**対処**:
1. SupabaseダッシュボードでConnection pooling設定確認
2. `pgbouncer=true`パラメータ確認

### 問題: タイムアウトエラー
**原因**: タイムアウト設定が短すぎる
**対処**:
1. `statement_timeout=30000`を`60000`に変更
2. `connect_timeout=60`を`120`に変更

## 測定記録

### 最適化前
- 測定1: _____ 秒
- 測定2: _____ 秒
- 測定3: _____ 秒
- 平均: _____ 秒

### 最適化後
- 測定1: _____ 秒
- 測定2: _____ 秒
- 測定3: _____ 秒
- 平均: _____ 秒

### 改善率
- 改善: _____ %
- 目標達成: [ ] Yes [ ] No

## 次のステップ

### 改善が十分な場合
- [ ] 設定を本番環境に固定
- [ ] 監視設定
- [ ] 完了

### 改善が不十分な場合
- [ ] Railway移行検討
- [ ] 他のDB選択肢検討
- [ ] インフラ最適化検討

---

*実行日: ___________*
*実行者: ___________*
*結果: ___________*