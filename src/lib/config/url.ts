import { env, config } from '@/lib/config/environment';

/**
 * アプリケーションのベースURLを取得
 * 認証やAPI通信で使用
 */
export function getBaseUrl(): string {
  // NEXTAUTH_URLが設定されている場合はそれを使用
  if (config.nextAuthUrl) {
    return config.nextAuthUrl;
  }

  // Vercel環境の場合（フォールバック）
  if (config.vercelUrl) {
    return `https://${config.vercelUrl}`;
  }

  // デフォルト（ローカル開発環境）
  return 'http://localhost:3000';
}

/**
 * 公開用URLを取得（SEO・OGP・サイトマップ用）
 * NEXT_PUBLIC_SITE_URLを使用
 *
 * 注意: VERCEL_URLは常に*.vercel.appドメインを返すため、
 * カスタムドメインがある場合は環境変数の設定が必須
 */
export function getPublicUrl(): string {
  // 専用の環境変数が設定されている場合
  if (config.nextPublicSiteUrl) {
    return config.nextPublicSiteUrl;
  }

  // 本番環境の場合
  if (env.isProduction) {
    // 警告を出力
    console.warn(
      'Warning: NEXT_PUBLIC_SITE_URL is not set. ' +
        'SEO features may not work correctly with custom domains. ' +
        'Please set NEXT_PUBLIC_SITE_URL to your custom domain.',
    );

    // デフォルトドメイン
    return 'https://setlist-studio.mosquit.one';
  }

  // 開発環境
  return getBaseUrl();
}
