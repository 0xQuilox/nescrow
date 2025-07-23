# Nescrow - Solana Escrow Platform

## Overview

Nescrow is a modern, full-stack web application built for creating and managing escrow transactions on the Solana blockchain. The platform provides a trustless, secure way to handle peer-to-peer transactions across multiple use cases including sports betting, marketplace transactions, freelance payments, and custom escrow agreements.

The application follows a monorepo structure with a React frontend, Express.js backend, and PostgreSQL database, all configured with TypeScript for type safety throughout the stack.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Tailwind CSS with Radix UI components via shadcn/ui
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Database Design
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Three main tables - users, escrows, and transactions
- **Migrations**: Managed through Drizzle Kit
- **Development**: In-memory storage implementation for rapid prototyping

## Key Components

### Database Schema
- **Users Table**: Stores wallet addresses, usernames, and performance metrics
- **Escrows Table**: Contains escrow details, status, amounts, and release conditions
- **Transactions Table**: Records all blockchain transactions with hashes and status

### API Endpoints
- User dashboard statistics and metrics
- Active escrow retrieval for users
- Transaction history with filtering capabilities
- Escrow creation and management

### Frontend Pages
- **Landing Page**: Marketing and feature overview
- **Dashboard**: User statistics and active escrows overview
- **Create Escrow**: Multi-step form for creating new escrows
- **Transaction History**: Searchable and filterable transaction log

### UI Components
- Reusable stat cards for dashboard metrics
- Escrow type selection cards with icons
- Wallet connection modal for Solana wallet integration
- Responsive navigation with mobile support

## Data Flow

1. **User Authentication**: Wallet-based authentication through Solana wallet adapters
2. **Escrow Creation**: Multi-step form validation → API submission → Database storage
3. **Transaction Tracking**: Blockchain events → Database updates → Real-time UI updates
4. **Dashboard Updates**: Periodic data fetching via React Query with optimistic updates

## External Dependencies

### Frontend Dependencies
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **TanStack Query**: Server state management
- **React Hook Form**: Form state and validation
- **Zod**: Runtime type validation

### Backend Dependencies
- **Drizzle ORM**: Database toolkit and query builder
- **Neon Database**: Serverless PostgreSQL provider
- **Express**: Web application framework
- **TSX**: TypeScript execution environment

### Development Tools
- **Vite**: Build tool with HMR
- **ESBuild**: Fast JavaScript bundler
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing tool

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory via Vite
- Backend compiles TypeScript to `dist/index.js` via ESBuild
- Single production command runs the Express server serving both API and static files

### Environment Configuration
- Database URL configuration for PostgreSQL connection
- Development/production environment detection
- Replit-specific tooling for development environment

### Storage Strategy
- Production: PostgreSQL database with Drizzle ORM
- Development: In-memory storage with sample data for rapid iteration
- Migration strategy: Drizzle Kit for schema changes

### Monitoring and Logging
- Request/response logging middleware for API endpoints
- Development-specific error overlays and debugging tools
- Performance monitoring through Vite development server