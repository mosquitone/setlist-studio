-- 安全な本番環境マイグレーションSQL（キャメルケース対応）
-- エラーハンドリング付き

BEGIN;

-- 1. 重複トークンのクリーンアップ
-- emailChangeToken
UPDATE users u1
SET "emailChangeToken" = NULL
WHERE "emailChangeToken" IS NOT NULL
AND EXISTS (
    SELECT 1 
    FROM users u2 
    WHERE u2."emailChangeToken" = u1."emailChangeToken" 
    AND u2.id < u1.id
);

-- emailVerificationToken
UPDATE users u1
SET "emailVerificationToken" = NULL
WHERE "emailVerificationToken" IS NOT NULL
AND EXISTS (
    SELECT 1 
    FROM users u2 
    WHERE u2."emailVerificationToken" = u1."emailVerificationToken" 
    AND u2.id < u1.id
);

-- passwordResetToken
UPDATE users u1
SET "passwordResetToken" = NULL
WHERE "passwordResetToken" IS NOT NULL
AND EXISTS (
    SELECT 1 
    FROM users u2 
    WHERE u2."passwordResetToken" = u1."passwordResetToken" 
    AND u2.id < u1.id
);

-- 2. ユニーク制約の追加（既存の場合はスキップ）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' AND constraint_name = 'users_emailChangeToken_key'
    ) THEN
        ALTER TABLE "users" ADD CONSTRAINT "users_emailChangeToken_key" UNIQUE ("emailChangeToken");
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' AND constraint_name = 'users_emailVerificationToken_key'
    ) THEN
        ALTER TABLE "users" ADD CONSTRAINT "users_emailVerificationToken_key" UNIQUE ("emailVerificationToken");
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' AND constraint_name = 'users_passwordResetToken_key'
    ) THEN
        ALTER TABLE "users" ADD CONSTRAINT "users_passwordResetToken_key" UNIQUE ("passwordResetToken");
    END IF;
END$$;

-- 3. 孤立したsecurity_eventsレコードのクリーンアップ
UPDATE security_events
SET "userId" = NULL
WHERE "userId" IS NOT NULL
AND "userId" NOT IN (SELECT id FROM users);

-- 4. 外部キー制約の追加（既存の場合はスキップ）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'security_events' AND constraint_name = 'security_events_userId_fkey'
    ) THEN
        ALTER TABLE "security_events" ADD CONSTRAINT "security_events_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;

-- 5. インデックスの追加（既存の場合はスキップ）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'security_events' AND indexname = 'security_events_userId_type_timestamp_idx'
    ) THEN
        CREATE INDEX "security_events_userId_type_timestamp_idx" ON "security_events"("userId", "type", "timestamp");
    END IF;
END$$;

COMMIT;