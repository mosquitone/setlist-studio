-- 本番環境での事前チェックSQL（キャメルケース対応）

-- 1. 重複トークンのチェック
SELECT 'emailChangeToken duplicates' as check_type, COUNT(*) as count
FROM (
    SELECT "emailChangeToken" 
    FROM users 
    WHERE "emailChangeToken" IS NOT NULL 
    GROUP BY "emailChangeToken" 
    HAVING COUNT(*) > 1
) dup
UNION ALL
SELECT 'emailVerificationToken duplicates', COUNT(*)
FROM (
    SELECT "emailVerificationToken" 
    FROM users 
    WHERE "emailVerificationToken" IS NOT NULL 
    GROUP BY "emailVerificationToken" 
    HAVING COUNT(*) > 1
) dup
UNION ALL
SELECT 'passwordResetToken duplicates', COUNT(*)
FROM (
    SELECT "passwordResetToken" 
    FROM users 
    WHERE "passwordResetToken" IS NOT NULL 
    GROUP BY "passwordResetToken" 
    HAVING COUNT(*) > 1
) dup;

-- 2. 既存の制約確認
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'users' 
AND constraint_name IN (
    'users_emailChangeToken_key',
    'users_emailVerificationToken_key',
    'users_passwordResetToken_key'
);

-- 3. 孤立したsecurity_eventsレコードの確認
SELECT COUNT(*) as orphaned_security_events
FROM security_events 
WHERE "userId" IS NOT NULL 
AND "userId" NOT IN (SELECT id FROM users);

-- 4. 既存の外部キー制約確認
SELECT constraint_name
FROM information_schema.table_constraints 
WHERE table_name = 'security_events' 
AND constraint_name = 'security_events_userId_fkey';

-- 5. 既存のインデックス確認
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'security_events' 
AND indexname = 'security_events_userId_type_timestamp_idx';