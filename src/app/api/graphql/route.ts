import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { GraphQLSchema } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

import { config, env, settings } from '../../../lib/config/environment';
import { getErrorMessage } from '../../../lib/i18n/api-helpers';
import { withI18n } from '../../../lib/i18n/context';
import { csrfProtection } from '../../../lib/security/csrf-protection';
import { createApiRateLimit, createAuthRateLimit } from '../../../lib/security/rate-limit-db';
import { getPreBuiltSchema } from '../../../lib/server/graphql/generated-schema';
import { prisma } from '../../../lib/server/prisma-optimized';
// Import pre-built schema

// Use pre-built schema for better performance
let schema: GraphQLSchema | null = null;

function getSchema() {
  if (!schema) {
    schema = getPreBuiltSchema();
  }
  return schema;
}

// Create Apollo Server with enhanced security
async function createServer() {
  const graphqlSchema = getSchema();

  return new ApolloServer({
    schema: graphqlSchema,
    introspection: settings.enableIntrospection,
    validationRules: [
      depthLimit(10), // Limit query depth
    ],
    formatError: (err) => {
      console.error('GraphQL Error:', err);

      if (env.isProduction) {
        // 本番環境では詳細なエラー情報を隠蔽
        const userFriendlyErrors = [
          // 日本語キーワード
          '認証',
          '権限',
          'メールアドレス',
          'パスワード',
          'ユーザー',
          '登録',
          'ログイン',
          'セットリスト',
          '楽曲',
          '不正',
          '無効',
          // 英語キーワード
          'authentication',
          'auth',
          'permission',
          'email',
          'password',
          'user',
          'register',
          'login',
          'setlist',
          'song',
          'invalid',
          'unauthorized',
          'forbidden',
          'not found',
          'already exists',
          'expired',
          'verified',
          'incorrect',
        ];

        const isUserError = userFriendlyErrors.some((keyword) =>
          err.message.toLowerCase().includes(keyword.toLowerCase()),
        );

        if (isUserError) {
          return { message: err.message };
        }

        // システムエラーは汎用メッセージ
        return {
          message: 'A server error occurred. Please try again later.',
        };
      }

      // 開発環境では詳細情報を含める
      return {
        message: err.message,
        locations: err.locations,
        path: err.path,
      };
    },
  });
}

// Lazy initialization approach for Vercel Functions
async function getServerInstance() {
  return createServer();
}

// JWT Token interface
interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

// Context helper for secure token extraction
async function createSecureContext(req: NextRequest) {
  // Cookiesオブジェクトを作成（認証ミドルウェア用）
  const cookies: { [key: string]: string } = {};
  req.cookies.getAll().forEach((cookie) => {
    cookies[cookie.name] = cookie.value;
  });

  // Headersオブジェクトを作成（セキュリティログ用）
  const headers: { [key: string]: string } = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // JWTトークンを取得して認証情報を設定
  let user: { userId: string; email: string; username: string } | undefined;

  const token = cookies['auth_token'];

  if (token) {
    try {
      const jwtSecret = config.jwtSecret;
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
        user = {
          userId: decoded.userId,
          email: decoded.email,
          username: decoded.username,
        };
      }
    } catch (error) {
      // Token validation failed - user remains undefined
      // Log for security monitoring without exposing sensitive details
      console.warn(
        'JWT validation failed - invalid or expired token:',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  const context = {
    req: {
      cookies,
      headers,
      authorization: token ? `Bearer ${token}` : undefined,
    },
    prisma,
    user,
  };

  // i18n機能を追加
  return withI18n(context);
}

export async function GET(request: NextRequest) {
  // Apply database-based rate limiting
  const apiRateLimit = createApiRateLimit(prisma);
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) {
    if (rateLimitResponse.status === 429) {
      const json = await rateLimitResponse.clone().json();
      return Response.json(
        {
          ...json,
          error: getErrorMessage(request, 'rateLimitExceeded'),
        },
        {
          status: rateLimitResponse.status,
          headers: rateLimitResponse.headers,
        },
      );
    }
    return rateLimitResponse;
  }

  const server = await getServerInstance();
  const handler = startServerAndCreateNextHandler(server, {
    context: async (req: NextRequest) => createSecureContext(req),
  });
  return handler(request);
}

export async function POST(request: NextRequest) {
  // Parallel processing for maximum performance optimization
  const bodyPromise = request.clone().text();
  const apiRateLimitPromise = createApiRateLimit(prisma)(request);

  // Start server creation early to reduce cold start time
  const serverPromise = getServerInstance();

  const [body, apiRateLimitResponse, server] = await Promise.all([
    bodyPromise,
    apiRateLimitPromise,
    serverPromise,
  ]);

  // Check API rate limit first
  if (apiRateLimitResponse) {
    if (apiRateLimitResponse.status === 429) {
      const json = await apiRateLimitResponse.clone().json();
      return Response.json(
        {
          ...json,
          error: getErrorMessage(request, 'rateLimitExceeded'),
        },
        {
          status: apiRateLimitResponse.status,
          headers: apiRateLimitResponse.headers,
        },
      );
    }
    return apiRateLimitResponse;
  }

  // Check if this is an authentication request for enhanced rate limiting
  const isAuthRequest = /(?:login|register)/.test(body);

  // Parallel processing for auth rate limit and CSRF protection
  const authPromises = [];

  if (isAuthRequest) {
    authPromises.push(createAuthRateLimit(prisma)(request));
  }

  authPromises.push(csrfProtection(request, prisma));

  const authResults = await Promise.all(authPromises);

  // Check for any auth/CSRF failures
  for (const result of authResults) {
    if (result) {
      if (result.status === 429) {
        // Auth rate limit exceeded
        const json = await result.clone().json();
        return Response.json(
          {
            ...json,
            error: getErrorMessage(request, 'authRateLimitExceeded'),
          },
          {
            status: result.status,
            headers: result.headers,
          },
        );
      } else if (result.status === 403) {
        // CSRF validation failed
        const json = await result.clone().json();
        return Response.json(
          {
            ...json,
            error: getErrorMessage(request, 'csrfValidationFailed'),
          },
          {
            status: result.status,
            headers: result.headers,
          },
        );
      }
      return result;
    }
  }

  const handler = startServerAndCreateNextHandler(server, {
    context: async (req: NextRequest) => createSecureContext(req),
  });
  return handler(request);
}
