-- 🚨 SUPABASE RLS (Row Level Security) 修正版
-- GraphQL API (Service Role) を考慮した安全な設定

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
-- 🔑 Service Role用ポリシー（最重要）
-- ========================================

-- GraphQL API (Service Role) の完全アクセス許可
CREATE POLICY "Service role full access users" ON public.users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access songs" ON public.songs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access setlists" ON public.setlists
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access setlist_items" ON public.setlist_items
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access rate_limit_entries" ON public.rate_limit_entries
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access security_events" ON public.security_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access threat_activities" ON public.threat_activities
  FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- 👤 Authenticated User用ポリシー（将来用）
-- ========================================

-- 現在は使用されていないが、将来Supabase Authを使う場合用

-- usersテーブル - 自分のプロフィールのみ
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id);

-- songsテーブル - 自分の楽曲のみ
CREATE POLICY "Users can view own songs" ON public.songs
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own songs" ON public.songs
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own songs" ON public.songs
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own songs" ON public.songs
  FOR DELETE USING (auth.uid()::text = "userId");

-- setlistsテーブル - 自分のセットリストまたは公開セットリスト
CREATE POLICY "Users can view own setlists" ON public.setlists
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can view public setlists" ON public.setlists
  FOR SELECT USING ("isPublic" = true);

CREATE POLICY "Users can insert own setlists" ON public.setlists
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own setlists" ON public.setlists
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own setlists" ON public.setlists
  FOR DELETE USING (auth.uid()::text = "userId");

-- setlist_itemsテーブル - セットリストの所有者のみ
CREATE POLICY "Users can view own setlist items" ON public.setlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.setlists 
      WHERE setlists.id = setlist_items."setlistId" 
      AND setlists."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own setlist items" ON public.setlist_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.setlists 
      WHERE setlists.id = setlist_items."setlistId" 
      AND setlists."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Users can update own setlist items" ON public.setlist_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.setlists 
      WHERE setlists.id = setlist_items."setlistId" 
      AND setlists."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own setlist items" ON public.setlist_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.setlists 
      WHERE setlists.id = setlist_items."setlistId" 
      AND setlists."userId" = auth.uid()::text
    )
  );

-- ========================================
-- 🔍 確認クエリ
-- ========================================

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