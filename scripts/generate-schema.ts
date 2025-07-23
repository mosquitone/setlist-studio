import 'reflect-metadata';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { printSchema } from 'graphql';
import { buildSchemaSync } from 'type-graphql';

// Import resolvers
import { AuthResolver } from '../src/lib/server/graphql/resolvers/AuthResolver';
import { EmailHistoryResolver } from '../src/lib/server/graphql/resolvers/EmailHistoryResolver';
import { SetlistItemResolver } from '../src/lib/server/graphql/resolvers/SetlistItemResolver';
import { SetlistResolver } from '../src/lib/server/graphql/resolvers/SetlistResolver';
import { SongResolver } from '../src/lib/server/graphql/resolvers/SongResolver';
import { UserResolver } from '../src/lib/server/graphql/resolvers/UserResolver';

async function generateSchema() {
  try {
    console.log('Generating GraphQL schema...');

    // Build schema from resolvers
    const schema = buildSchemaSync({
      resolvers: [
        SetlistResolver,
        SetlistItemResolver,
        SongResolver,
        AuthResolver,
        UserResolver,
        EmailHistoryResolver,
      ],
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
import { GraphQLSchema } from 'graphql';
import { buildSchemaSync } from 'type-graphql';

// Import resolvers
import { AuthResolver } from './resolvers/AuthResolver';
import { EmailHistoryResolver } from './resolvers/EmailHistoryResolver';
import { SetlistItemResolver } from './resolvers/SetlistItemResolver';
import { SetlistResolver } from './resolvers/SetlistResolver';
import { SongResolver } from './resolvers/SongResolver';
import { UserResolver } from './resolvers/UserResolver';

let cachedSchema: GraphQLSchema | null = null;

export function getPreBuiltSchema(): GraphQLSchema {
  if (!cachedSchema) {
    cachedSchema = buildSchemaSync({
      resolvers: [
        SetlistResolver,
        SetlistItemResolver,
        SongResolver,
        AuthResolver,
        UserResolver,
        EmailHistoryResolver,
      ],
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
