# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is mosquitone Emotional Setlist Studio, a modern setlist generator application built for music bands, featuring user authentication, song management, and setlist creation. The application uses a unified Next.js architecture with GraphQL API routes powered by Vercel Functions, ready for production deployment.

## Development Commands

### Core Development
- **Start development server**: `pnpm dev` (runs Next.js with GraphQL API on http://localhost:3000)
- **Build for production**: `pnpm build`
- **Lint code**: `pnpm lint`
- **Fix lint issues**: `pnpm lint:fix`
- **TypeScript type check**: `npx tsc --noEmit`

### Database Operations
- **Start PostgreSQL**: `docker-compose up -d postgres`
- **Apply schema changes**: `pnpm db:push`
- **Generate Prisma client**: `pnpm generate`
- **Open database studio**: `pnpm db:studio`
- **Create migration**: `pnpm db:migrate`

### Environment Setup
- **Install dependencies**: `pnpm install`
- **Required environment variables** (in `.env` and `.env.local`):
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Secret key for JWT token generation

## Architecture Overview

### Unified Next.js Architecture
The application uses a modern, streamlined architecture:

**Frontend & Backend (Next.js 15.3.4)**
- Next.js App Router with TypeScript
- Material-UI v5.17.1 for component library with custom theme
- Apollo Client 3.13.8 for GraphQL state management
- Client-side authentication state management
- React 19.0.0 with strict mode

**GraphQL API (Vercel Functions)**
- Apollo Server v4.12.2 running as Next.js API route at `/api/graphql`
- Type-GraphQL 1.1.1 for schema-first API development
- Prisma 6.10.1 as ORM with PostgreSQL
- JWT-based authentication with bcryptjs 3.0.2
- Security enhancements: query depth limiting, request size limiting, introspection control
- Field resolvers for handling relations without circular dependencies

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
- GraphQL API uses AuthMiddleware to protect resolvers
- Unified GraphQL version: v15.8.0 (with pnpm override for compatibility)

### Authentication Flow
- JWT tokens stored in localStorage
- Protected GraphQL resolvers use AuthMiddleware decorator
- User registration/login through GraphQL mutations
- Client-side auth state management with localStorage monitoring

## Important Configuration Notes

### GraphQL Version Management
- Unified GraphQL version: v15.8.0 enforced via pnpm override
- Compatible with both Apollo Client 3.13.8 and Type-GraphQL 1.1.1
- Single package.json for simplified dependency management

### Package Management
- Uses pnpm 10.12.1 for package management with Node.js 20.11.1 requirement
- Single unified package.json in project root
- ESLint 9.x with TypeScript 8.35.0 parser and Prettier 3.6.2 for code formatting
- **ESLint Configuration**: Uses flat config format (eslint.config.mjs) with ignores property

### Development Workflow
1. Start PostgreSQL: `docker-compose up -d postgres`
2. Install dependencies: `pnpm install`
3. Set up database schema: `pnpm db:push`
4. Start development server: `pnpm dev`

### Project Structure
```
/                           # Next.js application root
├── src/app/                # Next.js App Router
│   ├── api/graphql/        # GraphQL API route (Vercel Function)
│   │   └── route.ts        # Apollo Server integration
│   ├── login/             # User authentication pages
│   ├── register/          # User registration
│   ├── setlists/          # Setlist management pages
│   │   ├── [id]/          # Individual setlist view/edit
│   │   │   └── edit/      # Edit setlist page
│   │   └── new/           # Create new setlist
│   └── songs/             # Song management pages
│       └── new/           # Create new song
├── src/components/         # React components
│   ├── common/             # Common UI components
│   │   ├── Header.tsx      # Application header component
│   │   └── Footer.tsx      # Application footer component
│   ├── forms/              # Form-related components
│   │   ├── SetlistForm.tsx # Main setlist form with validation
│   │   ├── SetlistFormFields.tsx # Form field components
│   │   └── SongItemInput.tsx # Individual song input component
│   ├── setlist/            # Setlist-specific components
│   │   ├── ImageGenerator.tsx # Simplified image generation with one-click download
│   │   ├── SetlistActions.tsx # Action buttons (Edit, Download, etc.)
│   │   └── SetlistPreview.tsx # Setlist preview display
│   ├── providers/          # Context providers (MUI, Apollo)
│   └── setlist-themes/     # Theme renderers
│       ├── BlackTheme.tsx  # Black/dark theme
│       ├── WhiteTheme.tsx  # White/light theme
│       └── SetlistRenderer.tsx
├── src/lib/               # Shared utilities
│   ├── apollo-client.ts    # GraphQL client configuration
│   └── graphql/           # GraphQL schema and operations
│       ├── apollo-operations.ts  # All GraphQL queries, mutations, and subscriptions
│       ├── resolvers/      # GraphQL resolvers
│       │   ├── SetlistResolver.ts
│       │   ├── SongResolver.ts
│       │   └── AuthResolver.ts
│       ├── types/          # GraphQL type definitions
│       │   ├── Setlist.ts
│       │   ├── Song.ts
│       │   └── User.ts
│       └── middleware/     # Authentication middleware
│           └── jwt-auth-middleware.ts
├── prisma/                 # Database schema and migrations
│   └── schema.prisma       # Prisma schema definition
├── public/                 # Static assets including theme logos
└── docker-compose.yml      # PostgreSQL for local development
```

### Current Status
- **Architecture**: Unified Next.js application with Vercel Functions GraphQL API
- **Database**: PostgreSQL with complete schema applied via Prisma
- **Authentication**: Complete GraphQL resolvers for register/login with JWT tokens
- **Frontend**: Full application with login/register pages, setlist management
- **Setlist Management**: Complete CRUD operations with duplication functionality
- **User Interface**: Streamlined setlist detail page with action buttons (Edit, Download, Share, Duplicate)
- **Image Generation**: Simplified one-click download system with theme selection dropdown and debug preview modes
- **Theme System**: Black and White themes with real-time preview updates, loading states, and proper theme persistence
- **Duplication Feature**: Clone setlists via query parameters (/setlists/new?duplicate=ID)
- **Development**: Single-server Next.js setup with hot reload and API routes
- **Code Quality**: Type-GraphQL circular dependencies resolved, all TypeScript warnings resolved
- **Security**: Apollo Server v4 with enhanced security features and EOL vulnerability fixes
- **Deployment**: Ready for Vercel production deployment

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

### Theme System Bug Fixes (2025-07-01)
- **Page Reload Theme Issue**: Fixed issue where white theme setlists would display as black theme after page reload
- **Theme Change Interference**: Resolved problem where manual theme changes were being overridden by database initialization
- **Theme Initialization Logic**: Implemented proper theme state management with initialization flags to prevent conflicts between database values and user selections
- **Loading State Management**: Added proper loading states during theme initialization to prevent flickering between themes

### Semantic File Organization (2025-06-30)
- **GraphQL Server Entry Point**: Renamed `src/index.ts` to `src/apollo-server.ts` for better semantic clarity
- **GraphQL Operations**: Renamed `src/lib/graphql/queries.ts` to `apollo-operations.ts` to reflect it contains both queries and mutations
- **Authentication Middleware**: Renamed `src/middleware/auth.ts` to `jwt-auth-middleware.ts` for clearer purpose indication
- **Import Path Updates**: Updated all frontend files to use new `apollo-operations` import path and all GraphQL resolvers to use new middleware path
- **Package.json Updates**: Updated GraphQL server scripts and main entry point to reflect apollo-server.ts naming
- **Build Compatibility**: Verified all changes work correctly with both local development and Vercel deployment

### ESLint Configuration Migration (2025-06-30)
- **Flat Config Migration**: Migrated from deprecated `.eslintignore` file to modern flat config format
- **Ignore Patterns**: Moved all ignore patterns to `ignores` property in `eslint.config.mjs`
- **Plugin Dependencies**: Added missing `@next/eslint-plugin-next` dependency to resolve plugin loading issues
- **Warning Resolution**: Eliminated ESLintIgnoreWarning about deprecated .eslintignore file
- **Code Quality**: Auto-fixed formatting issues with `pnpm lint:fix` while maintaining existing code structure

### Apollo Server v4 Security Migration (2025-06-30)
- **Version Upgrade**: Migrated from deprecated Apollo Server v3 (EOL) to Apollo Server v4.12.2
- **Security Enhancements**: Added query depth limiting (max 10 levels), request size limiting (50MB), and production introspection controls
- **Architecture Modernization**: Replaced legacy apollo-server-express with @apollo/server and expressMiddleware pattern
- **Validation Integration**: Added class-validator decorators to LoginInput and RegisterInput types for proper argument validation
- **Vulnerability Resolution**: Eliminated all known security vulnerabilities from deprecated Apollo Server v3 dependencies

### Vercel Functions Migration (2025-07-01)
- **Architecture Unification**: Migrated from dual-server architecture to unified Next.js with Vercel Functions
- **GraphQL API Routes**: Converted standalone GraphQL server to Next.js API route at `/api/graphql`
- **Type-GraphQL Integration**: Successfully integrated Type-GraphQL with Next.js API routes using buildSchema
- **Circular Dependency Resolution**: Resolved Type-GraphQL circular dependencies using field resolvers instead of direct type relations
- **Dependency Cleanup**: Removed redundant graphql-server directory and consolidated all dependencies into single package.json
- **Environment Configuration**: Unified environment variable management with `.env` and `.env.local` files
- **Production Ready**: Application now fully compatible with Vercel Functions deployment