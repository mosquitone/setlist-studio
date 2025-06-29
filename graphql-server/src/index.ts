import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";

import { AuthResolver } from "./resolvers/AuthResolver";
import { SongResolver } from "./resolvers/SongResolver";

const prisma = new PrismaClient();

async function startServer() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [AuthResolver, SongResolver],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      req,
      prisma,
    }),
  });

  await server.start();

  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
    })
  );

  server.applyMiddleware({ 
    app, 
    path: "/graphql",
    cors: false,
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});