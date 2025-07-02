import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createApiRateLimit, createAuthRateLimit } from '../../../lib/security/rate-limit-db';
import { csrfProtection } from '../../../lib/security/csrf-protection';

// Import resolvers
import { SetlistResolver } from '../../../lib/server/graphql/resolvers/SetlistResolver';
import { SongResolver } from '../../../lib/server/graphql/resolvers/SongResolver';
import { AuthResolver } from '../../../lib/server/graphql/resolvers/AuthResolver';
import { UserResolver } from '../../../lib/server/graphql/resolvers/UserResolver';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Build schema from Type-GraphQL resolvers
let schema: GraphQLSchema | null = null;

async function getSchema() {
  if (!schema) {
    schema = await buildSchema({
      resolvers: [SetlistResolver, SongResolver, AuthResolver, UserResolver],
      validate: false, // Disable validation for better performance
      authChecker: undefined, // We use middleware instead
    });
  }
  return schema;
}

// Create Apollo Server with enhanced security
async function createServer() {
  const graphqlSchema = await getSchema();

  return new ApolloServer({
    schema: graphqlSchema,
    introspection: process.env.NODE_ENV !== 'production',
    validationRules: [
      depthLimit(10), // Limit query depth
    ],
    formatError: (err) => {
      console.error('GraphQL Error:', err);
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
