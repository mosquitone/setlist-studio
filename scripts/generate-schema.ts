import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import { printSchema } from 'graphql';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Import resolvers
import { SetlistResolver } from '../src/lib/server/graphql/resolvers/SetlistResolver';
import { SetlistItemResolver } from '../src/lib/server/graphql/resolvers/SetlistItemResolver';
import { SongResolver } from '../src/lib/server/graphql/resolvers/SongResolver';
import { AuthResolver } from '../src/lib/server/graphql/resolvers/AuthResolver';
import { UserResolver } from '../src/lib/server/graphql/resolvers/UserResolver';

async function generateSchema() {
  try {
    console.log('Generating GraphQL schema...');

    // Build schema from resolvers
    const schema = buildSchemaSync({
      resolvers: [SetlistResolver, SetlistItemResolver, SongResolver, AuthResolver, UserResolver],
      validate: false,
      authChecker: undefined,
    });

    // Generate SDL string
    const schemaSDL = printSchema(schema);

    // Write .graphql file
    const graphqlPath = join(__dirname, '../src/lib/server/graphql/schema.graphql');
    writeFileSync(graphqlPath, schemaSDL);

    // Generate TypeScript file with pre-built schema
    const escapedSchemaSDL = schemaSDL.replace(/`/g, '\\`').replace(/\${/g, '\\${');
    const tsContent = `// Auto-generated GraphQL schema
// Do not modify this file directly
import { buildSchemaSync } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

// Import resolvers
import { SetlistResolver } from './resolvers/SetlistResolver';
import { SetlistItemResolver } from './resolvers/SetlistItemResolver';
import { SongResolver } from './resolvers/SongResolver';
import { AuthResolver } from './resolvers/AuthResolver';
import { UserResolver } from './resolvers/UserResolver';

let cachedSchema: GraphQLSchema | null = null;

export function getPreBuiltSchema(): GraphQLSchema {
  if (!cachedSchema) {
    cachedSchema = buildSchemaSync({
      resolvers: [SetlistResolver, SetlistItemResolver, SongResolver, AuthResolver, UserResolver],
      validate: false,
      authChecker: undefined,
    });
  }
  return cachedSchema;
}

export const preGeneratedSchemaSDL = \`${escapedSchemaSDL}\`;
`;

    // Write TypeScript file
    const tsPath = join(__dirname, '../src/lib/server/graphql/generated-schema.ts');
    writeFileSync(tsPath, tsContent);

    console.log('✅ Schema generated successfully!');
    console.log(`📄 GraphQL schema: ${graphqlPath}`);
    console.log(`🔧 TypeScript schema: ${tsPath}`);
  } catch (error) {
    console.error('❌ Error generating schema:', error);
    process.exit(1);
  }
}

generateSchema();
