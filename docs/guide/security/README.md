# セキュリティドキュメント

このディレクトリには、Setlist Studioのセキュリティに関するドキュメントが含まれています。

## ドキュメント構成

### 初心者向け
- [セキュリティ初心者ガイド](./SECURITY_BEGINNERS_GUIDE.md) - セキュリティの基本概念を分かりやすく解説
- [React XSS対策ガイド](./REACT_XSS_PROTECTION_GUIDE.md) - Reactの自動エスケープ機能の詳細解説

### 開発者向け
- [セキュリティテスト計画](./SECURITY_TEST_PLAN.md) - セキュリティテストの実施計画
- [CSP Nonce実装ガイド](./CSP_NONCE_IMPLEMENTATION_GUIDE.md) - Next.js 15でのCSP実装詳細

### 上級者向け
- [セキュリティアーキテクチャ](../../claude/SECURITY.md) - 詳細な技術仕様とアーキテクチャ

## 読む順番

1. **初めての方**: `SECURITY_BEGINNERS_GUIDE.md` から始めてください
2. **React開発者**: `REACT_XSS_PROTECTION_GUIDE.md` でReactのセキュリティ機能を理解
3. **セキュリティ担当者**: `SECURITY_TEST_PLAN.md` でテスト方法を確認
4. **アーキテクト**: `../../claude/SECURITY.md` で全体的なセキュリティ設計を把握

## トピック別ガイド

### XSS（クロスサイトスクリプティング）
- 基本概念: [セキュリティ初心者ガイド#XSS対策](./SECURITY_BEGINNERS_GUIDE.md#xssクロスサイトスクリプティング対策)
- Reactでの実装: [React XSS対策ガイド](./REACT_XSS_PROTECTION_GUIDE.md)

### CSRF（クロスサイトリクエストフォージェリ）
- 基本概念: [セキュリティ初心者ガイド#CSRF対策](./SECURITY_BEGINNERS_GUIDE.md#csrfクロスサイトリクエストフォージェリ対策)
- 実装詳細: [React XSS対策ガイド#XSSとCSRFの違い](./REACT_XSS_PROTECTION_GUIDE.md#xssとcsrfの違い)

### 認証とセッション管理
- 基本概念: [セキュリティ初心者ガイド#認証とセッション管理](./SECURITY_BEGINNERS_GUIDE.md#認証とセッション管理)
- JWT実装: [セキュリティアーキテクチャ](../../claude/SECURITY.md)

### CSP（コンテンツセキュリティポリシー）
- 基本概念: [セキュリティ初心者ガイド#CSP](./SECURITY_BEGINNERS_GUIDE.md#cspコンテンツセキュリティポリシー)
- 実装詳細: [React XSS対策ガイド](./REACT_XSS_PROTECTION_GUIDE.md)
- Next.js 15実装: [CSP Nonce実装ガイド](./CSP_NONCE_IMPLEMENTATION_GUIDE.md)

### セキュリティログ・監査ログ
- 基本概念: [セキュリティ初心者ガイド#監査ログ](./SECURITY_BEGINNERS_GUIDE.md#監査ログ)
- 実装詳細: [セキュリティログ・監査ログシステム](../../claude/security/SECURITY_LOGGING_SYSTEM.md)
- テーブル定義: [データベーススキーマ定義](../../claude/database/DATABASE_SCHEMA.md)