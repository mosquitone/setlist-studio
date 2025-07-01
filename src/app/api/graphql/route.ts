import 'reflect-metadata'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import { buildSchema } from 'type-graphql'
import { PrismaClient } from '@prisma/client'
import { GraphQLSchema } from 'graphql'
import depthLimit from 'graphql-depth-limit'
import { apiRateLimit, authRateLimit } from '../../../lib/rate-limit'
import { csrfProtection } from '../../../lib/csrf-protection'

// Import resolvers
import { SetlistResolver } from '../../../lib/graphql/resolvers/SetlistResolver'
import { SongResolver } from '../../../lib/graphql/resolvers/SongResolver'
import { AuthResolver } from '../../../lib/graphql/resolvers/AuthResolver'

// Initialize Prisma Client
const prisma = new PrismaClient()

// Build schema from Type-GraphQL resolvers
let schema: GraphQLSchema | null = null

async function getSchema() {
  if (!schema) {
    schema = await buildSchema({
      resolvers: [SetlistResolver, SongResolver, AuthResolver],
      validate: false, // Disable validation for better performance
      authChecker: undefined, // We use middleware instead
    })
  }
  return schema
}

// Create Apollo Server with enhanced security
async function createServer() {
  const graphqlSchema = await getSchema()

  return new ApolloServer({
    schema: graphqlSchema,
    introspection: process.env.NODE_ENV !== 'production',
    validationRules: [
      depthLimit(10), // Limit query depth
    ],
    formatError: err => {
      console.error('GraphQL Error:', err)
      return {
        message: err.message,
        locations: err.locations,
        path: err.path,
      }
    },
  })
}

// Lazy initialization approach for Vercel Functions
async function getServerInstance() {
  return createServer()
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await apiRateLimit(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  const server = await getServerInstance()
  const handler = startServerAndCreateNextHandler(server, {
    context: async (req: NextRequest) => {
      return {
        req: {
          headers: {
            authorization: req.headers.get('authorization') || undefined,
          },
        },
        prisma,
      }
    },
  })
  return handler(request)
}

export async function POST(request: NextRequest) {
  // Check if this is an authentication request for enhanced rate limiting
  const requestClone = request.clone()
  const body = await requestClone.text()
  const isAuthRequest = body.includes('login') || body.includes('register')
  
  // Apply appropriate rate limiting
  const rateLimitResponse = isAuthRequest 
    ? await authRateLimit(request)
    : await apiRateLimit(request)
  
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Apply CSRF protection for state-changing operations
  const csrfResponse = await csrfProtection(request)
  if (csrfResponse) {
    return csrfResponse
  }

  const server = await getServerInstance()
  const handler = startServerAndCreateNextHandler(server, {
    context: async (req: NextRequest) => {
      return {
        req: {
          headers: {
            authorization: req.headers.get('authorization') || undefined,
          },
        },
        prisma,
      }
    },
  })
  return handler(request)
}
