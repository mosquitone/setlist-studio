# 認証関連ガイド

このディレクトリには、認証システムに関するガイドが含まれています。

## ドキュメント一覧

### Google OAuth認証
- [Google OAuthフローガイド](./GOOGLE_OAUTH_FLOW_GUIDE.md) - Google認証の動作フロー
- [Google OAuth実装ガイド](./GOOGLE_OAUTH_IMPLEMENTATION_GUIDE.md) - 実装手順と設定方法

## 認証システムの概要

Setlist Studioは以下の認証方法をサポートしています：

1. **メール認証**
   - メールアドレスとパスワードによる認証
   - メール認証必須（登録後にメール確認が必要）
   - パスワードリセット機能

2. **Google OAuth認証**
   - Googleアカウントでのワンクリックログイン
   - 既存メールユーザーとの統合
   - セキュアな認証フロー

## セキュリティ機能

- **JWT + HttpOnly Cookie**: セキュアなトークン管理
- **CSRF保護**: すべてのミューテーションで自動保護
- **レート制限**: ブルートフォース攻撃対策
- **セキュリティログ**: 全認証イベントの記録

## 関連ドキュメント

- [セキュリティ初心者ガイド](../security/SECURITY_BEGINNERS_GUIDE.md)
- [メール認証システム技術仕様](../../claude/api/EMAIL_AUTHENTICATION.md)

## トラブルシューティング

### よくある質問

**Q: Google認証でログインできない**
- Google Cloud ConsoleでリダイレクトURLが正しく設定されているか確認
- 環境変数（GOOGLE_CLIENT_ID、GOOGLE_CLIENT_SECRET）が設定されているか確認

**Q: メール認証メールが届かない**
- 迷惑メールフォルダを確認
- Resend APIキーが正しく設定されているか確認