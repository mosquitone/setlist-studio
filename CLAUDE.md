# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern setlist generator application built for music bands, featuring user authentication, song management, and setlist creation. The application uses a dual-server architecture with NextJS frontend and a standalone GraphQL server for development, designed for potential Vercel deployment.

## Development Commands

### Core Development
- **Start frontend**: `pnpm dev` (runs NextJS on http://localhost:3000)
- **Start GraphQL server**: `cd graphql-server && pnpm dev` (runs on http://localhost:4000/graphql)
- **Build frontend**: `pnpm build`
- **Lint frontend**: `pnpm lint`

### Database Operations
- **Start PostgreSQL**: `docker-compose up -d postgres`
- **Apply schema changes**: `cd graphql-server && pnpm db:push`
- **Generate Prisma client**: `cd graphql-server && pnpm generate`
- **Open database studio**: `cd graphql-server && pnpm db:studio`
- **Create migration**: `cd graphql-server && pnpm db:migrate`

### Environment Setup
- **Install dependencies**: `pnpm install && cd graphql-server && pnpm install`
- **Required environment variables** (in `graphql-server/.env`):
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Secret key for JWT token generation

## Architecture Overview

### Dual-Server Development Architecture
The application uses separate servers during development:

**Frontend (NextJS 15.3.4)**
- Next.js App Router with TypeScript
- Material-UI v7 for component library with custom theme
- Apollo Client for GraphQL state management
- Client-side authentication state management

**Backend (GraphQL + Prisma)**
- Standalone Apollo Server Express (GraphQL 15.x for Type-GraphQL compatibility)
- Type-GraphQL for schema-first API development
- Prisma as ORM with PostgreSQL
- JWT-based authentication with bcryptjs
- CORS enabled for frontend communication

**Database**
- PostgreSQL 15 running in Docker container
- Prisma schema with User, Song, Setlist, and SetlistItem models
- CUID-based IDs for all entities

### Key Components

**Data Models**
- `User`: Authentication and user management with unique email/username
- `Song`: Music tracks with metadata (title, artist, key, tempo, duration, notes)
- `Setlist`: Collections of songs for performances with band/venue information
- `SetlistItem`: Junction table linking songs to setlists with ordering and timing

**Key Features**
- **Setlist Management**: Create, edit, delete setlists with drag-and-drop song ordering
- **Image Generation**: Generate professional setlist images in multiple themes
- **QR Code Integration**: Automatic QR codes linking to setlist pages
- **Theme System**: Multiple visual themes (Basic, MQTN, MQTN2, Minimal)
- **Authentication**: JWT-based user system with protected routes

**Frontend Architecture**
- Provider pattern with separate MUIProvider and ApolloProvider
- Custom MUI theme with blue/red color scheme and Inter font
- Apollo Client configured for development (localhost:4000) with auth headers
- Client-side routing with NextJS App Router
- Advanced image generation system using html2canvas and QR code integration
- Multiple setlist themes for different band branding (MQTN, Basic, Minimal)
- Responsive design with Material-UI components

**GraphQL Integration**
- Apollo Client automatically includes JWT tokens in authorization headers
- GraphQL server uses AuthMiddleware to protect resolvers
- Dual GraphQL versions: v16 in frontend, v15 in server (compatibility requirement)

### Authentication Flow
- JWT tokens stored in localStorage
- Protected GraphQL resolvers use AuthMiddleware decorator
- User registration/login through GraphQL mutations
- Client-side auth state management with localStorage monitoring

## Important Configuration Notes

### GraphQL Version Compatibility
- Frontend uses GraphQL 16.x (required by Apollo Client 3.x)
- GraphQL server uses GraphQL 15.x (required by Type-GraphQL 1.x)
- Server package.json includes pnpm override to enforce GraphQL 15.x
- This dual-version setup is intentional for library compatibility

### Package Management
- Uses pnpm for package management with specific Node.js 20.11.1 requirement
- Both root and graphql-server have separate package.json files
- GraphQL server has isolated dependencies to avoid version conflicts

### Development Workflow
1. Start PostgreSQL: `docker-compose up -d postgres`
2. Install dependencies in both projects
3. Set up database schema: `cd graphql-server && pnpm db:push`
4. Start GraphQL server: `cd graphql-server && pnpm dev`
5. Start frontend: `pnpm dev`

### Project Structure
```
/                           # NextJS frontend root
├── src/app/                # NextJS App Router
│   ├── login/             # User authentication pages
│   ├── register/          # User registration
│   └── setlists/          # Setlist management pages
│       ├── [id]/          # Individual setlist view/edit
│       └── new/           # Create new setlist
├── src/components/         # React components
│   ├── providers/          # Context providers (MUI, Apollo)
│   ├── ImageGenerator.tsx  # Setlist image generation component
│   └── setlist-themes/     # Multiple theme renderers
│       ├── BasicTheme.tsx
│       ├── MQTNTheme.tsx
│       ├── MQTN2Theme.tsx
│       ├── MinimalTheme.tsx
│       └── SetlistRenderer.tsx
├── src/lib/               # Shared utilities
│   ├── apollo-client.ts    # GraphQL client configuration
│   └── graphql/           # GraphQL queries and mutations
├── graphql-server/        # Standalone GraphQL server
│   ├── src/resolvers/     # GraphQL resolvers
│   │   ├── SetlistResolver.ts
│   │   └── SetlistItemResolver.ts
│   ├── src/types/         # GraphQL type definitions
│   ├── src/middleware/    # Authentication middleware
│   └── prisma/           # Database schema and migrations
├── public/               # Static assets including theme logos
└── docker-compose.yml     # PostgreSQL for local development
```

### Current Status
- **Database**: PostgreSQL with complete schema applied via Prisma
- **Authentication**: Complete GraphQL resolvers for register/login with JWT tokens
- **Frontend**: Full application with login/register pages, setlist management
- **Setlist Management**: Complete CRUD operations for setlists and songs
- **Image Generation**: Advanced setlist image generator with multiple themes
- **Development**: Fully functional dual-server setup with hot reload