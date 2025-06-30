import 'reflect-metadata'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import { buildSchema } from 'type-graphql'
import { PrismaClient } from '@prisma/client'
import depthLimit from 'graphql-depth-limit'

import { AuthResolver } from './resolvers/AuthResolver'
import { SongResolver } from './resolvers/SongResolver'
import { SetlistResolver } from './resolvers/SetlistResolver'
import { SetlistItemResolver } from './resolvers/SetlistItemResolver'

const prisma = new PrismaClient()

interface Context {
  req: express.Request
  prisma: PrismaClient
}

async function startServer() {
  const app = express()

  const schema = await buildSchema({
    resolvers: [AuthResolver, SongResolver, SetlistResolver, SetlistItemResolver],
  })

  const plugins =
    process.env.NODE_ENV !== 'production' ? [ApolloServerPluginLandingPageLocalDefault({ embed: true })] : []

  const server = new ApolloServer<Context>({
    schema,
    plugins,
    validationRules: [depthLimit(10)],
    introspection: process.env.NODE_ENV !== 'production',
  })

  await server.start()

  app.use(
    '/graphql',
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://studio.apollographql.com',
      ],
      credentials: true,
    }),
    json({ limit: '50mb' }),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        req,
        prisma,
      }),
    }),
  )

  const PORT = Number(process.env.PORT) || 4000

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server ready at http://0.0.0.0:${PORT}/graphql`)
  })
}

startServer().catch(error => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
