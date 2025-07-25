/**
 * アプリケーションのベースURLを取得
 * 認証やAPI通信で使用
 */
export function getBaseUrl(): string {
  // NEXTAUTH_URLが設定されている場合はそれを使用
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Vercel環境の場合（フォールバック）
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
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
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 本番環境の場合
  if (process.env.NODE_ENV === 'production') {
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
