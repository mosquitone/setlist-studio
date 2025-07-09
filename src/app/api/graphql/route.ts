import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createApiRateLimit, createAuthRateLimit } from '../../../lib/security/rate-limit-db';
import { csrfProtection } from '../../../lib/security/csrf-protection';

// Import pre-built schema
import { getPreBuiltSchema } from '../../../lib/server/graphql/generated-schema';

// Initialize Prisma Client
const prisma = new PrismaClient();

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
    introspection: process.env.NODE_ENV !== 'production',
    validationRules: [
      depthLimit(10), // Limit query depth
    ],
    formatError: (err) => {
      console.error('GraphQL Error:', err);

      const isProduction = process.env.NODE_ENV === 'production';

      if (isProduction) {
        // 本番環境では詳細なエラー情報を隠蔽
        const userFriendlyErrors = [
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
        ];

        const isUserError = userFriendlyErrors.some((keyword) => err.message.includes(keyword));

        if (isUserError) {
          return { message: err.message };
        }

        // システムエラーは汎用メッセージ
        return {
          message: 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。',
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

// Context helper for secure token extraction
function createSecureContext(req: NextRequest) {
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

  return {
    req: {
      cookies,
      headers,
    },
    prisma,
  };
}

export async function GET(request: NextRequest) {
  // Apply database-based rate limiting
  const apiRateLimit = createApiRateLimit(prisma);
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const server = await getServerInstance();
  const handler = startServerAndCreateNextHandler(server, {
    context: async (req: NextRequest) => createSecureContext(req),
  });
  return handler(request);
}

export async function POST(request: NextRequest) {
  // Check if this is an authentication request for enhanced rate limiting
  const requestClone = request.clone();
  const body = await requestClone.text();
  const isAuthRequest = body.includes('login') || body.includes('register');

  // Apply appropriate database-based rate limiting
  const rateLimitFunction = isAuthRequest
    ? createAuthRateLimit(prisma)
    : createApiRateLimit(prisma);
  const rateLimitResponse = await rateLimitFunction(request);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Apply CSRF protection for state-changing operations
  const csrfResponse = await csrfProtection(request, prisma);
  if (csrfResponse) {
    return csrfResponse;
  }

  const server = await getServerInstance();
  const handler = startServerAndCreateNextHandler(server, {
    context: async (req: NextRequest) => createSecureContext(req),
  });
  return handler(request);
}
