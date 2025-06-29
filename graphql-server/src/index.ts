import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";

import { AuthResolver } from "./resolvers/AuthResolver";
import { SongResolver } from "./resolvers/SongResolver";
import { SetlistResolver } from "./resolvers/SetlistResolver";
import { SetlistItemResolver } from "./resolvers/SetlistItemResolver";

const prisma = new PrismaClient();

async function startServer() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [AuthResolver, SongResolver, SetlistResolver, SetlistItemResolver],
    validate: false,
  });

  const plugins = process.env.NODE_ENV !== "production"
    ? [ApolloServerPluginLandingPageGraphQLPlayground()]
    : [];

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      req,
      prisma,
    }),
    plugins,
  });

  await server.start();

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://studio.apollographql.com"
      ],
      credentials: true,
    })
  );

  server.applyMiddleware({
    app: app as any,
    path: "/graphql",
  });

  const PORT = Number(process.env.PORT) || 4000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
