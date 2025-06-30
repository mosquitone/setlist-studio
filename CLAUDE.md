# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is mosquitone Emotional Setlist Studio, a modern setlist generator application built for music bands, featuring user authentication, song management, and setlist creation. The application uses a dual-server architecture with NextJS frontend and a standalone GraphQL server for development, designed for potential Vercel deployment.

## Development Commands

### Core Development
- **Start frontend**: `pnpm dev` (runs NextJS on http://localhost:3000)
- **Start GraphQL server**: `cd graphql-server && pnpm dev` (runs on http://localhost:4000/graphql)
- **Build frontend**: `pnpm build`
- **Lint frontend**: `pnpm lint`
- **Fix lint issues**: `pnpm lint:fix`
- **TypeScript type check**: `cd graphql-server && npx tsc --noEmit` (check server types without compilation)

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
- Material-UI v5.17.1 for component library with custom theme
- Apollo Client 3.13.8 for GraphQL state management
- Client-side authentication state management
- React 19.0.0 with strict mode

**Backend (GraphQL + Prisma)**
- Standalone Apollo Server Express 3.12.0 (GraphQL 15.8.0 for Type-GraphQL compatibility)
- Type-GraphQL 1.1.1 for schema-first API development
- Prisma 6.2.0 as ORM with PostgreSQL
- JWT-based authentication with bcryptjs 2.4.3
- CORS enabled for frontend communication
- TypeScript with strictPropertyInitialization disabled for Type-GraphQL compatibility

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
- **Setlist Management**: Create, edit, delete, duplicate setlists with drag-and-drop song ordering
- **Image Generation**: Generate professional setlist images with streamlined UI - theme selection + one-click download
- **QR Code Integration**: Automatic QR codes linking to setlist pages
- **Theme System**: Black and White themes with dropdown selector
- **Duplication System**: Clone existing setlists via URL query parameters
- **Authentication**: JWT-based user system with protected routes

**Frontend Architecture**
- Provider pattern with separate MUIProvider and ApolloProvider
- Custom MUI theme with blue/red color scheme and Inter font
- Apollo Client configured for development (localhost:4000) with auth headers
- Client-side routing with NextJS App Router
- Advanced image generation system using html2canvas and QR code integration
- Simplified theme system with Black/White options for better UX
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
- Frontend uses GraphQL 16.11.0 (required by Apollo Client 3.13.8)
- GraphQL server uses GraphQL 15.8.0 (required by Type-GraphQL 1.1.1)
- Server package.json includes pnpm override to enforce GraphQL 15.8.0
- This dual-version setup is intentional for library compatibility

### Package Management
- Uses pnpm 10.12.1 for package management with specific Node.js 20.11.1 requirement
- Both root and graphql-server have separate package.json files
- GraphQL server has isolated dependencies to avoid version conflicts
- ESLint 9.x with TypeScript 8.35.0 parser and Prettier 3.6.2 for code formatting

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
│   ├── setlists/          # Setlist management pages
│   │   ├── [id]/          # Individual setlist view/edit
│   │   │   └── edit/      # Edit setlist page
│   │   └── new/           # Create new setlist
│   └── songs/             # Song management pages
│       └── new/           # Create new song
├── src/components/         # React components
│   ├── providers/          # Context providers (MUI, Apollo)
│   ├── ImageGenerator.tsx  # Simplified image generation with one-click download
│   └── setlist-themes/     # Theme renderers
│       ├── BlackTheme.tsx  # Black/dark theme
│       ├── WhiteTheme.tsx  # White/light theme
│       └── SetlistRenderer.tsx
├── src/lib/               # Shared utilities
│   ├── apollo-client.ts    # GraphQL client configuration
│   └── graphql/           # GraphQL queries and mutations
│       └── apollo-operations.ts  # All GraphQL queries, mutations, and subscriptions
├── graphql-server/        # Standalone GraphQL server
│   ├── src/apollo-server.ts      # Main Apollo GraphQL server entry point
│   ├── src/resolvers/     # GraphQL resolvers
│   │   ├── SetlistResolver.ts
│   │   └── SetlistItemResolver.ts
│   ├── src/types/         # GraphQL type definitions
│   ├── src/middleware/    # Authentication middleware
│   │   └── jwt-auth-middleware.ts  # JWT authentication middleware
│   └── prisma/           # Database schema and migrations
├── public/               # Static assets including theme logos
└── docker-compose.yml     # PostgreSQL for local development
```

### Current Status
- **Database**: PostgreSQL with complete schema applied via Prisma
- **Authentication**: Complete GraphQL resolvers for register/login with JWT tokens
- **Frontend**: Full application with login/register pages, setlist management
- **Setlist Management**: Complete CRUD operations with duplication functionality
- **User Interface**: Streamlined setlist detail page with action buttons (Edit, Download, Share, Duplicate)
- **Image Generation**: Simplified one-click download system with theme selection dropdown and debug preview modes
- **Theme System**: Black and White themes with real-time preview updates, loading states, and proper theme persistence
- **Duplication Feature**: Clone setlists via query parameters (/setlists/new?duplicate=ID)
- **Development**: Fully functional dual-server setup with hot reload
- **Code Quality**: GraphQL resolvers optimized for frontend requirements, all TypeScript warnings resolved

## Recent UI/UX Improvements

### Setlist Detail Page (/setlists/[id])
- **Simplified Layout**: Removed tabbed interface for cleaner, single-page experience
- **Action Button Row**: Horizontal layout with Edit, Download, Share, Duplicate buttons
- **Theme Selector**: Top-right dropdown with "Theme: basic/white" format
- **Success Notifications**: "Setlist Generated !" banner after successful image downloads
- **One-Click Downloads**: Direct image generation and download without preview tabs

### Image Generation System
- **Streamlined Component**: Simplified ImageGenerator to single download button
- **Real-time Preview**: Theme changes update preview immediately with loading states
- **Download Integration**: Uses useRef to prevent automatic downloads, only on button click
- **QR Code Integration**: Automatic QR codes included in generated images
- **Debug Mode**: Development-only toggle between DOM preview and image preview
- **Unified Preview Size**: 700px × 990px (A4 ratio) for consistent display across modes

### Duplication Workflow
- **Query Parameter System**: `/setlists/new?duplicate={id}` for seamless cloning
- **Auto-populated Forms**: Original setlist data pre-fills form with "(コピー)" suffix
- **Preserved Structure**: Maintains song order, timing, and all metadata in duplicates

### Home Page Enhancements (2025-06-30)
- **Setlist Dashboard**: Implemented stylish setlist listing on home page for logged-in users
- **Responsive Grid Layout**: 3-column desktop, 2-column tablet, 1-column mobile responsive design
- **Theme-aware Cards**: Dynamic gradient backgrounds based on setlist theme (white/black)
- **Interactive Card Design**: Hover animations with lift effect and enhanced shadows
- **Unified Card Sizing**: Standardized 278px height for consistent layout across all cards
- **Action Buttons**: Direct view/edit access buttons at bottom of each card
- **Empty State Handling**: Friendly message and call-to-action for users with no setlists
- **Button Design Consistency**: Unified button styling throughout application with rounded corners and proper color scheme
- **Header Navigation**: Updated header logout button design to match application style
- **Compact Information Display**: Optimized space usage with smaller icons, reduced padding, and appropriate font sizes

### Recent Bug Fixes (2025-06-30)
- **Theme Persistence**: Fixed issue where saved themes from database weren't being displayed on setlist detail pages
- **Theme Naming Consistency**: Resolved "basic"/"black" naming inconsistency in UI components
- **Database Integration**: Improved theme selection to properly initialize from stored setlist data
- **Theme Layout Improvements**: Updated font sizes and spacing to match reference design - larger band names (48px), improved song list readability (20-32px), cleaner layout without numbered songs
- **React Hooks Order**: Fixed hooks order violation in SetlistDetailPage that was causing React development errors
- **Debug Mode Layout**: Corrected debug mode preview dimensions and removed unwanted margins to match image preview sizing
- **Error Handling**: Replaced confusing fallback DOM preview with proper error message and retry functionality when image generation fails
- **Grid Layout Issues**: Resolved card height overflow problems by optimizing content spacing and card dimensions

### Semantic File Organization (2025-06-30)
- **GraphQL Server Entry Point**: Renamed `src/index.ts` to `src/apollo-server.ts` for better semantic clarity
- **GraphQL Operations**: Renamed `src/lib/graphql/queries.ts` to `apollo-operations.ts` to reflect it contains both queries and mutations
- **Authentication Middleware**: Renamed `src/middleware/auth.ts` to `jwt-auth-middleware.ts` for clearer purpose indication
- **Import Path Updates**: Updated all frontend files to use new `apollo-operations` import path and all GraphQL resolvers to use new middleware path
- **Package.json Updates**: Updated GraphQL server scripts and main entry point to reflect apollo-server.ts naming
- **Build Compatibility**: Verified all changes work correctly with both local development and Vercel deployment