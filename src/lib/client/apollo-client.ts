import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// CSRF token utility functions
async function getCSRFToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  try {
    const response = await fetch('/api/csrf', {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      return data.csrfToken
    }
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error)
  }

  return null
}

function getCSRFTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'csrf_token') {
      return value
    }
  }

  return null
}

const httpLink = createHttpLink({
  uri: '/api/graphql', // Next.js API Routes (開発・本番共通)
  credentials: 'include', // HttpOnly Cookieを含める
})

const authLink = setContext(async (_, { headers }) => {
  // HttpOnly Cookieによる認証では、authorizationヘッダーは不要
  // JWTトークンは自動的にCookieとして送信される

  // CSRFトークンを取得（Cookieから、またはAPIから）
  let csrfToken = getCSRFTokenFromCookie()
  if (!csrfToken && typeof window !== 'undefined') {
    csrfToken = await getCSRFToken()
  }

  return {
    headers: {
      ...headers,
      'x-csrf-token': csrfToken || '',
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})
