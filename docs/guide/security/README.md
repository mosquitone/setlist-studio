# セキュリティドキュメント

このディレクトリには、Setlist Studioのセキュリティに関するドキュメントが含まれています。

## ドキュメント構成

### 初心者向け
- [セキュリティ初心者ガイド](./Security-Beginners-Guide.md) - セキュリティの基本概念を分かりやすく解説
- [React XSS対策ガイド](./React-XSS-Protection-Guide.md) - Reactの自動エスケープ機能の詳細解説

### 開発者向け
- [セキュリティテスト計画](./SECURITY_TEST_PLAN.md) - セキュリティテストの実施計画

### 上級者向け
- [セキュリティアーキテクチャ](../../SECURITY.md) - 詳細な技術仕様とアーキテクチャ

## 読む順番

1. **初めての方**: `Security-Beginners-Guide.md` から始めてください
2. **React開発者**: `React-XSS-Protection-Guide.md` でReactのセキュリティ機能を理解
3. **セキュリティ担当者**: `SECURITY_TEST_PLAN.md` でテスト方法を確認
4. **アーキテクト**: `SECURITY.md` で全体的なセキュリティ設計を把握

## トピック別ガイド

### XSS（クロスサイトスクリプティング）
- 基本概念: [セキュリティ初心者ガイド#XSS対策](./Security-Beginners-Guide.md#xssクロスサイトスクリプティング対策)
- Reactでの実装: [React XSS対策ガイド](./React-XSS-Protection-Guide.md)

### CSRF（クロスサイトリクエストフォージェリ）
- 基本概念: [セキュリティ初心者ガイド#CSRF対策](./Security-Beginners-Guide.md#csrfクロスサイトリクエストフォージェリ対策)
- 実装詳細: [React XSS対策ガイド#XSSとCSRFの違い](./React-XSS-Protection-Guide.md#xssとcsrfの違い)

### 認証とセッション管理
- 基本概念: [セキュリティ初心者ガイド#認証とセッション管理](./Security-Beginners-Guide.md#認証とセッション管理)
- JWT実装: [セキュリティアーキテクチャ](../../SECURITY.md)

### CSP（コンテンツセキュリティポリシー）
- 基本概念: [セキュリティ初心者ガイド#CSP](./Security-Beginners-Guide.md#cspコンテンツセキュリティポリシー)
- 実装詳細: [React XSS対策ガイド](./React-XSS-Protection-Guide.md)