# セキュリティテスト計画書

## 概要
セットリストスタジオの包括的セキュリティ機能のテスト計画です。各セキュリティ機能が正常に動作し、想定される攻撃に対して適切に防御できることを確認します。

## テスト環境
- **開発環境**: http://localhost:3000
- **テストデータベース**: PostgreSQL (Docker)
- **ブラウザ**: Chrome DevTools使用推奨
- **ツール**: curl, Postman, ブラウザ開発者ツール

---

## 1. 認証システムテスト

### 1.1 HttpOnly Cookie認証テスト

**目的**: JWTトークンがHttpOnly Cookieとして安全に管理されることを確認

**手順**:
1. **新規登録テスト**
   ```bash
   # ブラウザで実行
   1. http://localhost:3000/register にアクセス
   2. 新しいアカウントを作成（email: test@example.com, password: TestPass123!）
   3. 開発者ツール > Application > Cookies で auth_token が設定されていることを確認
   4. HttpOnly フラグが true であることを確認
   ```

2. **ログインテスト**
   ```bash
   # ブラウザで実行
   1. http://localhost:3000/login にアクセス
   2. 作成したアカウントでログイン
   3. Cookies に auth_token が更新されることを確認
   4. localStorage に token が残っていないことを確認（XSS対策）
   ```

**期待結果**:
- ✅ HttpOnly Cookie として auth_token が設定される
- ✅ localStorage からJWTトークンが削除される
- ✅ ログイン後にダッシュボードにリダイレクトされる

### 1.2 アクセス制御テスト

**目的**: プライベートセットリストへの不正アクセスを防ぐ

**手順**:
1. **プライベートセットリスト作成**
   ```bash
   1. ログイン状態でセットリストを作成
   2. isPublic を false に設定
   3. セットリストIDをメモ（例: cltxxxxx）
   ```

2. **不正アクセステスト**
   ```bash
   # 別のブラウザまたはIncognitoモードで
   1. http://localhost:3000/setlists/[セットリストID] にアクセス
   2. 認証されていない状態でアクセス試行
   ```

**期待結果**:
- ✅ プライベートセットリストは未認証ユーザーからアクセス不可
- ✅ 適切なエラーメッセージが表示される

---

## 2. CSRF保護テスト

### 2.1 CSRFトークン検証テスト

**目的**: CSRFトークンがない場合にmutationが拒否されることを確認

**手順**:
1. **CSRFトークンなしでのリクエスト**
   ```bash
   curl -X POST http://localhost:3000/api/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "mutation { login(input: {email: \"test@example.com\", password: \"TestPass123!\"}) { token user { id } } }"
     }'
   ```

**期待結果**:
- ✅ `{"error":"CSRF token validation failed","code":"CSRF_TOKEN_INVALID"}` が返される

### 2.2 正常なCSRFフロー確認

**手順**:
1. **ブラウザでの正常なログイン**
   ```bash
   1. http://localhost:3000/login にアクセス
   2. Network タブで /api/csrf リクエストが送信されることを確認
   3. Cookies に csrf_token が設定されることを確認
   4. ログイン実行時に x-csrf-token ヘッダーが送信されることを確認
   ```

**期待結果**:
- ✅ CSRFトークンが自動取得される
- ✅ GraphQL mutationリクエストにCSRFトークンが含まれる
- ✅ ログインが成功する

---

## 3. レート制限テスト

### 3.1 認証レート制限テスト

**目的**: 短時間での大量ログイン試行をブロック

**手順**:
1. **連続ログイン失敗テスト**
   ```bash
   # スクリプトを実行または手動で6回連続実行
   for i in {1..6}; do
     curl -X POST http://localhost:3000/api/graphql \
       -H "Content-Type: application/json" \
       -H "x-csrf-token: $(curl -s http://localhost:3000/api/csrf | jq -r .csrfToken)" \
       -d '{
         "query": "mutation { login(input: {email: \"wrong@email.com\", password: \"wrongpass\"}) { token } }"
       }'
     echo "Attempt $i completed"
     sleep 1
   done
   ```

**期待結果**:
- ✅ 5回目以降のリクエストで HTTP 429 (Too Many Requests) が返される
- ✅ `Retry-After` ヘッダーが含まれる

### 3.2 API レート制限テスト

**手順**:
1. **大量リクエスト送信**
   ```bash
   # 1分間に60回以上のリクエスト送信
   for i in {1..65}; do
     curl -s http://localhost:3000/api/graphql \
       -H "Content-Type: application/json" \
       -d '{"query": "{ __typename }"}' > /dev/null
     echo "Request $i"
   done
   ```

**期待結果**:
- ✅ 60回目以降でレート制限が発動
- ✅ 適切なレート制限ヘッダーが返される

---

## 4. 脅威検知システムテスト

### 4.1 ブルートフォース攻撃検知

**目的**: 同一IPからの連続失敗ログインを検知

**手順**:
1. **異なるアカウントでの連続失敗**
   ```bash
   # 5つの異なるメールアドレスで失敗ログインを実行
   emails=("user1@test.com" "user2@test.com" "user3@test.com" "user4@test.com" "user5@test.com")
   for email in "${emails[@]}"; do
     curl -X POST http://localhost:3000/api/graphql \
       -H "Content-Type: application/json" \
       -H "x-csrf-token: $(curl -s http://localhost:3000/api/csrf | jq -r .csrfToken)" \
       -d "{
         \"query\": \"mutation { login(input: {email: \\\"$email\\\", password: \\\"wrongpass\\\"}) { token } }\"
       }"
   done
   ```

2. **データベースでの脅威ログ確認**
   ```sql
   -- Prisma Studioまたは直接SQLで確認
   SELECT * FROM "ThreatActivity" 
   WHERE "activityType" = 'login_failure' 
   ORDER BY "timestamp" DESC;
   ```

**期待結果**:
- ✅ ThreatActivity テーブルに失敗ログインが記録される
- ✅ 同一IPからの複数失敗でThreatAlertが生成される

### 4.2 認証情報スタッフィング検知

**手順**:
1. **複数ユーザーアカウントでの連続攻撃シミュレーション**
   ```bash
   # 10個の異なるメールアドレスで短時間に失敗ログイン
   for i in {1..10}; do
     curl -X POST http://localhost:3000/api/graphql \
       -H "Content-Type: application/json" \
       -H "x-csrf-token: $(curl -s http://localhost:3000/api/csrf | jq -r .csrfToken)" \
       -d "{
         \"query\": \"mutation { login(input: {email: \\\"attack$i@test.com\\\", password: \\\"commonpass\\\"}) { token } }\"
       }"
   done
   ```

**期待結果**:
- ✅ 認証情報スタッフィング攻撃として検知される
- ✅ SecurityEvent テーブルにCRITICALレベルで記録される

---

## 5. セキュリティログテスト

### 5.1 ログ記録確認

**手順**:
1. **様々なセキュリティイベント実行**
   - 成功ログイン
   - 失敗ログイン
   - レート制限違反
   - CSRF攻撃試行

2. **データベースログ確認**
   ```sql
   -- SecurityEvent テーブルの確認
   SELECT type, severity, "ipAddress", "timestamp" 
   FROM "SecurityEvent" 
   ORDER BY "timestamp" DESC 
   LIMIT 20;
   ```

**期待結果**:
- ✅ 全てのセキュリティイベントがデータベースに記録される
- ✅ 適切なseverityレベルが設定される
- ✅ IPアドレス、UserAgent等の情報が正確に記録される

### 5.2 ログインジェクション防止確認

**手順**:
1. **悪意のある文字列でのログイン試行**
   ```bash
   curl -X POST http://localhost:3000/api/graphql \
     -H "Content-Type: application/json" \
     -H "x-csrf-token: $(curl -s http://localhost:3000/api/csrf | jq -r .csrfToken)" \
     -d '{
       "query": "mutation { login(input: {email: \"test\\nmalicious\\rlog@test.com\", password: \"pass\\u0000word\"}) { token } }"
     }'
   ```

**期待結果**:
- ✅ 改行文字・制御文字がサニタイズされてログに記録される
- ✅ ログインジェクション攻撃が無効化される

---

## 6. CSP（Content Security Policy）テスト

### 6.1 開発環境CSP確認

**手順**:
```bash
# 開発環境のCSPヘッダー確認
curl -I http://localhost:3000/
```

**期待結果**:
- ✅ `script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' 'unsafe-eval'` が含まれる
- ✅ Next.js開発サーバーが正常動作する

### 6.2 CSPエラー確認

**手順**:
1. ブラウザ開発者ツールのConsoleタブを開く
2. アプリケーションを操作
3. CSP違反エラーがないことを確認

**期待結果**:
- ✅ CSP関連のエラーが発生しない
- ✅ インラインスクリプトが正常実行される

---

## 7. Docker セキュリティテスト

### 7.1 PostgreSQL設定確認

**手順**:
```bash
# PostgreSQL設定確認
docker exec setlist-studio-postgres-1 psql -U postgres -c "SHOW password_encryption;"
docker exec setlist-studio-postgres-1 netstat -tlnp
```

**期待結果**:
- ✅ password_encryption が scram-sha-256
- ✅ PostgreSQLが localhost:5432 のみでリスニング

---

## 8. 総合セキュリティテスト

### 8.1 E2Eセキュリティフロー

**手順**:
1. **完全なユーザージャーニー**
   ```bash
   1. 新規ユーザー登録
   2. ログイン
   3. プライベートセットリスト作成
   4. ログアウト
   5. 別ブラウザから不正アクセス試行
   6. 再ログイン
   7. セットリスト編集
   ```

2. **セキュリティログの完全性確認**
   ```sql
   SELECT COUNT(*) FROM "SecurityEvent";
   SELECT COUNT(*) FROM "ThreatActivity";
   SELECT COUNT(*) FROM "RateLimitEntry";
   ```

**期待結果**:
- ✅ 全操作でセキュリティ機能が正常動作
- ✅ 完全なセキュリティログが記録される
- ✅ 不正アクセスが適切にブロックされる

---

## テスト実行チェックリスト

### 事前準備
- [ ] 開発環境の起動 (`pnpm dev`)
- [ ] PostgreSQL の起動 (`docker-compose up -d postgres`)
- [ ] データベーススキーマの適用 (`pnpm db:push`)
- [ ] 環境変数の設定確認

### 実行順序
1. [ ] 認証システムテスト（1.1, 1.2）
2. [ ] CSRF保護テスト（2.1, 2.2）
3. [ ] レート制限テスト（3.1, 3.2）
4. [ ] 脅威検知テスト（4.1, 4.2）
5. [ ] セキュリティログテスト（5.1, 5.2）
6. [ ] CSPテスト（6.1, 6.2）
7. [ ] Dockerセキュリティテスト（7.1）
8. [ ] 総合テスト（8.1）

### テスト完了後
- [ ] データベースクリーンアップ
- [ ] ログファイルの確認
- [ ] パフォーマンス影響の確認
- [ ] セキュリティ設定のドキュメント更新

---

## 異常時の対応

### テスト失敗時の調査手順
1. **ログの確認**: コンソール、データベース、Networkタブ
2. **設定の確認**: 環境変数、CSP、CORS設定
3. **依存関係の確認**: package.json、Prismaスキーマ
4. **キャッシュクリア**: ブラウザキャッシュ、Cookieクリア

### よくある問題と解決策
- **CSRFエラー**: Cookieの確認、CSRFプロバイダーの動作確認
- **レート制限が効かない**: データベース接続、時刻同期確認
- **ログが記録されない**: Prismaクライアント接続、テーブル存在確認

このテスト計画に従って実行することで、セットリストスタジオのセキュリティ機能が企業レベルの要件を満たしていることを確認できます。