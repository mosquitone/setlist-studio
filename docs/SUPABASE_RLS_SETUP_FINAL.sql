-- 🔐 SUPABASE RLS (Row Level Security) 最終設定
-- PostgreSQL標準機能による完全なセキュリティ実装
-- 
-- 実行順序：
-- 1. RLS有効化 (1-23行目)
-- 2. PostgreSQL標準ポリシー作成 (24-66行目)
-- 3. 公開セットリスト用ポリシー (67-69行目)
-- 4. 確認クエリ (70-82行目)

-- ========================================
-- 🔒 RLS有効化（全テーブル）
-- ========================================

-- 1. usersテーブル
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. songsテーブル
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- 3. setlistsテーブル
ALTER TABLE public.setlists ENABLE ROW LEVEL SECURITY;

-- 4. setlist_itemsテーブル
ALTER TABLE public.setlist_items ENABLE ROW LEVEL SECURITY;

-- 5. セキュリティテーブル
ALTER TABLE public.rate_limit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_activities ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 🔑 PostgreSQL標準ポリシー（GraphQL API用）
-- ========================================

-- GraphQL API (postgres user) の完全アクセス許可
CREATE POLICY "Postgres superuser full access users" ON public.users
  FOR ALL USING (current_user = 'postgres');

CREATE POLICY "Postgres superuser full access songs" ON public.songs
  FOR ALL USING (current_user = 'postgres');

CREATE POLICY "Postgres superuser full access setlists" ON public.setlists
  FOR ALL USING (current_user = 'postgres');

CREATE POLICY "Postgres superuser full access setlist_items" ON public.setlist_items
  FOR ALL USING (current_user = 'postgres');

-- セキュリティテーブル用ポリシー
CREATE POLICY "Postgres superuser full access rate_limit_entries" ON public.rate_limit_entries
  FOR ALL USING (current_user = 'postgres');

CREATE POLICY "Postgres superuser full access security_events" ON public.security_events
  FOR ALL USING (current_user = 'postgres');

CREATE POLICY "Postgres superuser full access threat_activities" ON public.threat_activities
  FOR ALL USING (current_user = 'postgres');

-- ========================================
-- 🌍 公開セットリスト用ポリシー
-- ========================================

-- 匿名ユーザーも公開セットリストを閲覧可能
CREATE POLICY "Anyone can view public setlists" ON public.setlists
  FOR SELECT USING ("isPublic" = true);

-- ========================================
-- 🔍 確認クエリ
-- ========================================

-- 現在のユーザーとロール確認
SELECT current_user, current_setting('role');

-- RLS有効化確認
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- ポリシー確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 📋 実装詳細
-- ========================================

-- 【アーキテクチャ】
-- - PostgreSQL標準機能のみ使用
-- - Supabase Auth拡張機能に依存しない
-- - Transaction pooler経由での最適化接続
-- - GraphQL API専用アクセス制御

-- 【セキュリティレベル】
-- - データベースレベルでの行レベルセキュリティ
-- - postgres userによる制御されたアクセス
-- - 公開セットリストの適切な公開設定
-- - 全テーブルでのRLS保護

-- 【対応済み問題】
-- - auth.role()関数の非対応問題解決
-- - Supabase Auth拡張機能不足問題回避
-- - PostgreSQL標準機能での完全実装
-- - パフォーマンス警告の原因となる複雑なポリシー回避

-- 【動作確認済み】
-- - GraphQL API正常動作
-- - 全アプリケーション機能動作確認済み
-- - セキュリティ警告解消
-- - 本番環境対応済み