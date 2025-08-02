/**
 * 環境変数の統一管理ユーティリティ
 *
 * NODE_ENVの条件分岐を一元化し、型安全性を確保します。
 * 各環境変数にはデフォルト値を設定し、実行時エラーを防ぎます。
 */

import { NodeEnv, NodeEnvType, VercelEnvType, RequiredEnvKeys, Config } from '@/types/environment';

// 現在の環境（undefined の場合は development をデフォルトとする）
const currentEnv = (process.env.NODE_ENV as NodeEnvType) || NodeEnv.Development;

// 環境判定ヘルパー
export const env = {
  // 基本的な環境判定
  isDevelopment: currentEnv === NodeEnv.Development,
  isProduction: currentEnv === NodeEnv.Production,
  isTest: currentEnv === NodeEnv.Test,

  // 現在の環境値
  current: currentEnv,

  // NODE_ENV
  NODE_ENV: currentEnv,
} as const;

// 環境変数アクセサー（型安全）
export const config: Config = {
  // データベース
  databaseUrl: process.env.DATABASE_URL || '',
  shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL || '',

  // 認証・セキュリティ
  jwtSecret: process.env.JWT_SECRET || '',
  csrfSecret: process.env.CSRF_SECRET || '',
  ipHashSalt: process.env.IP_HASH_SALT || '',
  cronSecret: process.env.CRON_SECRET || '',

  // メール
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || '',
  emailVerificationSecret: process.env.EMAIL_VERIFICATION_SECRET || '',
  passwordResetSecret: process.env.PASSWORD_RESET_SECRET || '',

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',

  // NextAuth
  nextAuthUrl: process.env.NEXTAUTH_URL || '',
  nextAuthSecret: process.env.NEXTAUTH_SECRET || '',

  // サイト設定
  nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',

  // その他（オプショナル）
  postgresPassword: process.env.POSTGRES_PASSWORD || '',

  // Vercelシステム環境変数（自動的に提供される）
  vercel: process.env.VERCEL,
  vercelEnv: process.env.VERCEL_ENV as VercelEnvType | undefined,
  vercelUrl: process.env.VERCEL_URL || '',
  vercelRegion: process.env.VERCEL_REGION,
  vercelProjectId: process.env.VERCEL_PROJECT_ID,
  vercelDeploymentId: process.env.VERCEL_DEPLOYMENT_ID,
  vercelGitCommitRef: process.env.VERCEL_GIT_COMMIT_REF,
  vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA,
} as const;

// 環境に応じた設定値
export const settings = {
  // ログレベル - 型安全なPrismaログレベル
  prismaLogLevel: env.isDevelopment
    ? (['error', 'warn'] as Array<'error' | 'warn' | 'info' | 'query'>)
    : (['error'] as Array<'error' | 'warn' | 'info' | 'query'>),

  // セキュリティ設定
  secureCookie: env.isProduction,

  // デバッグ設定
  enableIntrospection: !env.isProduction,

  // プロトコル
  protocol: env.isProduction ? 'https://' : 'http://',
} as const;

// 環境変数の検証（必須項目のチェック）
export function validateEnvironment(): void {
  const requiredVars = Object.values(RequiredEnvKeys) as string[];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// 開発環境では起動時に環境変数を検証
if (env.isDevelopment && typeof window === 'undefined') {
  validateEnvironment();
}
