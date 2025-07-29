# セキュリティログ・監査ログシステム詳細ガイド

このドキュメントは、Setlist Studioのセキュリティログと監査ログシステムの詳細な実装と運用方法について説明します。

## 概要

Setlist Studioは、包括的なセキュリティ監視とコンプライアンス要件に対応するため、3層構造のログシステムを実装しています：

1. **SecurityEvent（セキュリティイベント）**: すべてのセキュリティ関連イベントを記録
2. **ThreatActivity（脅威アクティビティ）**: 攻撃や異常な活動を追跡
3. **AuditLog（監査ログ）**: リスクベースで重要なイベントを永続化

## セキュリティログシステムの構成

### 1. SecurityEvent（セキュリティイベント）

#### 目的

- リアルタイムのセキュリティ監視
- インシデント対応の迅速化
- 詳細な攻撃パターンの分析

#### イベントタイプ

```typescript
enum SecurityEventType {
  // 認証関連
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
  PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE',
  EMAIL_VERIFICATION_SUCCESS = 'EMAIL_VERIFICATION_SUCCESS',
  EMAIL_VERIFICATION_FAILURE = 'EMAIL_VERIFICATION_FAILURE',
  EMAIL_CHANGE_REQUEST = 'EMAIL_CHANGE_REQUEST',
  EMAIL_CHANGE_SUCCESS = 'EMAIL_CHANGE_SUCCESS',
  EMAIL_CHANGE_FAILURE = 'EMAIL_CHANGE_FAILURE',

  // OAuth関連
  OAUTH_LOGIN_ATTEMPT = 'OAUTH_LOGIN_ATTEMPT',
  OAUTH_LOGIN_SUCCESS = 'OAUTH_LOGIN_SUCCESS',
  OAUTH_LOGIN_FAILURE = 'OAUTH_LOGIN_FAILURE',
  OAUTH_NEW_USER_CREATED = 'OAUTH_NEW_USER_CREATED',

  // セキュリティ攻撃
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // アクセス制御
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  DATA_BREACH_ATTEMPT = 'DATA_BREACH_ATTEMPT',
}
```

#### 重要度レベル

- **CRITICAL**: システムへの重大な脅威（SQLインジェクション、データ漏洩試行）
- **HIGH**: 高リスクイベント（ブルートフォース攻撃、不正アクセス）
- **MEDIUM**: 中リスクイベント（認証失敗、レート制限超過）
- **LOW**: 通常のイベント（ログイン成功、正常な操作）
- **INFO**: 情報記録用（ログアウト、設定変更）

#### データ構造

```typescript
interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  details?: {
    reason?: string;
    attemptedEmail?: string;
    targetResource?: string;
    queryParams?: Record<string, any>;
    headers?: Record<string, string>;
    [key: string]: any;
  };
}
```

### 2. ThreatActivity（脅威アクティビティ）

#### 目的

- 攻撃パターンの追跡と分析
- IP単位での脅威レベル評価
- 自動ブロッキングの判断材料

#### アクティビティタイプ

```typescript
type ThreatActivityType =
  | 'brute_force' // ブルートフォース攻撃
  | 'credential_stuffing' // 認証情報の総当たり
  | 'sql_injection' // SQLインジェクション
  | 'xss_attempt' // XSS攻撃
  | 'path_traversal' // ディレクトリトラバーサル
  | 'suspicious_pattern' // 疑わしいアクセスパターン
  | 'rate_limit_abuse' // レート制限の悪用
  | 'bot_activity'; // ボット活動
```

#### データ構造

```typescript
interface ThreatActivity {
  id: string;
  ipAddress: string;
  activityType: ThreatActivityType;
  userId?: string;
  userAgent?: string;
  timestamp: Date;
  metadata?: {
    attackVector?: string;
    targetEndpoint?: string;
    payload?: string;
    riskScore?: number;
    [key: string]: any;
  };
}
```

### 3. AuditLog（監査ログ）

#### 目的

- コンプライアンス要件への対応
- 長期的な証跡保持
- リスクベースの効率的な記録

#### リスクベース記録戦略

##### 高リスクイベント（詳細記録）

```typescript
const HIGH_RISK_EVENTS = [
  SecurityEventType.BRUTE_FORCE_ATTEMPT,
  SecurityEventType.SQL_INJECTION_ATTEMPT,
  SecurityEventType.XSS_ATTEMPT,
  SecurityEventType.DATA_BREACH_ATTEMPT,
  SecurityEventType.UNAUTHORIZED_ACCESS,
];
```

- **記録内容**: すべての詳細情報を保存
- **保持期間**: 1年以上
- **用途**: インシデント調査、法的証拠

##### 中リスクイベント（標準記録）

```typescript
const MEDIUM_RISK_EVENTS = [
  SecurityEventType.LOGIN_FAILURE,
  SecurityEventType.RATE_LIMIT_EXCEEDED,
  SecurityEventType.CSRF_TOKEN_INVALID,
  SecurityEventType.PERMISSION_DENIED,
];
```

- **記録内容**: 基本情報と重要な詳細のみ
- **保持期間**: 6ヶ月
- **用途**: パターン分析、トレンド把握

##### 低リスクイベント（最小限記録）

```typescript
const LOW_RISK_EVENTS = [
  SecurityEventType.LOGIN_SUCCESS,
  SecurityEventType.LOGOUT,
  SecurityEventType.EMAIL_VERIFICATION_SUCCESS,
];
```

- **記録内容**: 最小限の情報（発生のみ）
- **保持期間**: 3ヶ月
- **用途**: 統計情報、正常性確認

#### データ構造

```typescript
interface AuditLog {
  id: string;
  eventType: string;
  outcome: 'SUCCESS' | 'FAILURE';
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  details?: Record<string, unknown>;
}
```

## 実装詳細

### SecurityLogger（セキュリティロガー）

```typescript
// src/lib/security/security-logger-db.ts
export class SecurityLogger {
  // イベント記録
  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    await this.prisma.securityEvent.create({
      data: {
        ...event,
        timestamp: new Date(),
      },
    });
  }

  // 脅威活動の記録
  async logThreatActivity(activity: ThreatActivityInput): Promise<void> {
    await this.prisma.threatActivity.create({
      data: activity,
    });
  }

  // 統計情報の取得
  async getSecurityStats(timeRange: TimeRange): Promise<SecurityStats> {
    // 実装...
  }
}
```

### SimpleAuditLogger（軽量監査ロガー）

```typescript
// src/lib/security/simple-audit-logger.ts
export class SimpleAuditLogger {
  // リスクベース記録
  async logSecurityEvent(
    event: SecurityEvent,
    additionalDetails?: Record<string, unknown>,
  ): Promise<void> {
    const riskLevel = this.calculateSimpleRiskLevel(event);

    if (riskLevel === 'HIGH') {
      await this.createDetailedAuditLog(event, riskLevel, additionalDetails);
    } else {
      await this.createLightAuditLog(event, riskLevel);
    }
  }
}
```

## ログの活用方法

### 1. リアルタイム監視

```typescript
// 直近1時間の高リスクイベントを取得
const criticalEvents = await prisma.securityEvent.findMany({
  where: {
    severity: { in: ['CRITICAL', 'HIGH'] },
    timestamp: { gte: new Date(Date.now() - 3600000) },
  },
  orderBy: { timestamp: 'desc' },
});
```

### 2. 攻撃パターン分析

```typescript
// 特定IPの脅威活動を集計
const threatPattern = await prisma.threatActivity.groupBy({
  by: ['activityType'],
  where: { ipAddress: suspiciousIp },
  _count: true,
});
```

### 3. コンプライアンスレポート

```typescript
// 月次監査レポート生成
const auditReport = await prisma.auditLog.findMany({
  where: {
    timestamp: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
  },
  orderBy: { riskLevel: 'desc' },
});
```

## データ保持とクリーンアップ

### 自動クリーンアップジョブ

```typescript
// Vercel Cronジョブ（毎日午前3時実行）
export async function cleanupSecurityLogs() {
  const now = new Date();

  // 低リスクイベント：3ヶ月以上前のものを削除
  await prisma.auditLog.deleteMany({
    where: {
      riskLevel: 'LOW',
      timestamp: { lt: subMonths(now, 3) },
    },
  });

  // 中リスクイベント：6ヶ月以上前のものを削除
  await prisma.auditLog.deleteMany({
    where: {
      riskLevel: 'MEDIUM',
      timestamp: { lt: subMonths(now, 6) },
    },
  });

  // SecurityEvent：30日以上前のものを削除（監査ログに記録済み）
  await prisma.securityEvent.deleteMany({
    where: {
      timestamp: { lt: subDays(now, 30) },
    },
  });
}
```

## ベストプラクティス

### 1. パフォーマンス最適化

- **非同期記録**: ログ記録は非同期で実行し、メイン処理をブロックしない
- **バッチ処理**: 大量のログは一括で書き込む
- **インデックス**: 検索頻度の高いカラムにインデックスを設定

### 2. セキュリティ考慮事項

- **個人情報の扱い**: パスワードやトークンは絶対に記録しない
- **IPアドレス**: 必要に応じてハッシュ化して保存
- **アクセス制限**: ログへのアクセスは管理者のみに制限

### 3. 運用上の注意点

- **ストレージ管理**: ログの増加に応じてストレージを監視
- **定期的な分析**: 週次・月次でログを分析し、異常を検知
- **アラート設定**: 高リスクイベントは即座に通知

## トラブルシューティング

### ログが記録されない場合

1. データベース接続を確認
2. Prismaクライアントの初期化を確認
3. エラーログを確認（console.error出力）

### パフォーマンス問題

1. インデックスの最適化
2. クリーンアップジョブの頻度調整
3. 非同期処理の確認

## 関連ドキュメント

- [セキュリティアーキテクチャ](../SECURITY.md)
- [データベーススキーマ定義](../database/DATABASE_SCHEMA.md)
- [セキュリティテストプラン](../../guide/security/SECURITY_TEST_PLAN.md)

## 更新履歴

- 2025-07-29: 初版作成（3層ログシステムの詳細説明）
