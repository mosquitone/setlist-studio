import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// CSRF token utility functions
async function getCSRFToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const response = await fetch('/api/csrf', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.csrfToken;
    }
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
  }

  return null;
}

function getCSRFTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf_token') {
      return value;
    }
  }

  return null;
}

const httpLink = createHttpLink({
  uri: '/api/graphql', // Next.js API Routes (開発・本番共通)
  credentials: 'include', // HttpOnly Cookieを含める
});

const authLink = setContext(async (_, { headers }) => {
  // HttpOnly Cookieによる認証では、authorizationヘッダーは不要
  // JWTトークンは自動的にCookieとして送信される

  // CSRFトークンを取得（Cookieから、またはAPIから）
  let csrfToken = getCSRFTokenFromCookie();
  if (!csrfToken && typeof window !== 'undefined') {
    csrfToken = await getCSRFToken();
  }

  // I18nProviderと同じlocalStorageキーから言語設定を読み取る
  const savedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : null;

  return {
    headers: {
      ...headers,
      'x-csrf-token': csrfToken || '',
      // 保存された言語があればそれを使用、なければブラウザの設定を使用
      'accept-language':
        savedLang || (typeof navigator !== 'undefined' ? navigator.language : 'ja'),
      // X-Languageヘッダーも送信（優先度が高い）
      ...(savedLang && { 'x-language': savedLang }),
    },
  };
});

// キャッシュ戦略を最適化
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        setlists: {
          // マージ戦略を定義してキャッシュの更新を最適化
          merge(_, incoming) {
            return incoming;
          },
        },
        songs: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Setlist: {
      fields: {
        items: {
          // セットリストアイテムの順序を保持
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      // デフォルトでcache-and-networkを使用（パフォーマンスと鮮度のバランス）
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      // デフォルトでcache-and-networkを使用（パフォーマンスと鮮度のバランス）
      fetchPolicy: 'cache-and-network',
    },
  },
});
