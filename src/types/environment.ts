/**
 * 環境変数関連の型定義
 */

// 環境タイプの定義（as const パターン）
export const NodeEnv = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
} as const;

export type NodeEnvType = (typeof NodeEnv)[keyof typeof NodeEnv];

// Vercel環境の定義（as const パターン）
// Vercelシステム環境変数: VERCEL_ENVの値
export const VercelEnv = {
  Production: 'production',
  Preview: 'preview',
  Development: 'development',
} as const;

export type VercelEnvType = (typeof VercelEnv)[keyof typeof VercelEnv];

// 必須環境変数のキー（as const パターン）
export const RequiredEnvKeys = {
  DATABASE_URL: 'DATABASE_URL',
  JWT_SECRET: 'JWT_SECRET',
  CSRF_SECRET: 'CSRF_SECRET',
  IP_HASH_SALT: 'IP_HASH_SALT',
} as const;

export type RequiredEnvKey = (typeof RequiredEnvKeys)[keyof typeof RequiredEnvKeys];

// Vercelシステム環境変数の定義（as const パターン）
// これらの変数はVercelが自動的に提供する
export const VercelSystemEnvKeys = {
  VERCEL: 'VERCEL', // システム環境変数が公開されていることを示すインジケーター
  VERCEL_ENV: 'VERCEL_ENV', // 環境タイプ: "production" | "preview" | "development"
  VERCEL_URL: 'VERCEL_URL', // デプロイメントURL（プロトコルなし）
  VERCEL_REGION: 'VERCEL_REGION', // 実行中のリージョンID
  VERCEL_PROJECT_ID: 'VERCEL_PROJECT_ID', // プロジェクトの一意識別子
  VERCEL_DEPLOYMENT_ID: 'VERCEL_DEPLOYMENT_ID', // デプロイメントの一意識別子
  VERCEL_GIT_COMMIT_REF: 'VERCEL_GIT_COMMIT_REF', // Gitブランチ名
  VERCEL_GIT_COMMIT_SHA: 'VERCEL_GIT_COMMIT_SHA', // Gitコミットハッシュ
} as const;

export type VercelSystemEnvKey = (typeof VercelSystemEnvKeys)[keyof typeof VercelSystemEnvKeys];

// 設定オブジェクトの型定義
export type Config = {
  // Required
  databaseUrl: string;
  jwtSecret: string;
  csrfSecret: string;
  ipHashSalt: string;

  // Optional with defaults
  shadowDatabaseUrl: string;
  cronSecret: string;
  resendApiKey: string;
  resendFromEmail: string;
  emailVerificationSecret: string;
  passwordResetSecret: string;
  googleClientId: string;
  googleClientSecret: string;
  nextAuthUrl: string;
  nextAuthSecret: string;
  nextPublicSiteUrl: string;
  postgresPassword: string;

  // Vercelシステム環境変数（自動的に提供される）
  vercel: string | undefined;
  vercelEnv: VercelEnvType | undefined;
  vercelUrl: string;
  vercelRegion: string | undefined;
  vercelProjectId: string | undefined;
  vercelDeploymentId: string | undefined;
  vercelGitCommitRef: string | undefined;
  vercelGitCommitSha: string | undefined;
};
