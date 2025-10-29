# CyberForensics Pro

## Overview

CyberForensics Pro is an AI-powered digital forensics platform designed to detect, analyze, and respond to AI-powered cyber attacks in real-time. The system combines traditional cybersecurity approaches with advanced AI analysis and blockchain-based evidence logging to create a comprehensive forensic readiness model. The platform provides real-time threat detection, incident response management, attack simulation capabilities, and immutable evidence storage through blockchain integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with **React 18** and **TypeScript**, utilizing a modern component-based architecture. The UI framework is **shadcn/ui** with **Tailwind CSS** for styling, providing a dark-themed cybersecurity aesthetic. State management is handled through **TanStack React Query** for server state and caching. The application uses **Wouter** for client-side routing and follows a modular component structure with dedicated pages for landing, home, and error handling.

### Backend Architecture
The server is built with **Express.js** and **TypeScript**, following a RESTful API design pattern. The architecture separates concerns through dedicated modules for database operations, authentication, routing, and static file serving. WebSocket integration provides real-time updates for threat detection events. The server includes comprehensive error handling, request logging middleware, and session management.

### Authentication System
Authentication is implemented using **Replit's OpenID Connect (OIDC)** integration with **Passport.js**. The system supports session-based authentication with secure cookie handling and PostgreSQL session storage. User management includes role-based access control with admin, analyst, and viewer permissions.

### Database Design
The system uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations. The schema includes tables for users, threats, evidence, incidents, simulations, analytics, and session storage. Foreign key relationships maintain data integrity between related entities. The database supports both structured data storage and JSONB fields for flexible metadata.

### Real-time Communication
**WebSocket** connections enable real-time threat detection alerts and dashboard updates. The system broadcasts threat detection events to connected clients and maintains persistent connections for live monitoring capabilities.

### AI Analysis Integration
The platform includes AI-powered threat analysis with confidence scoring, pattern recognition, and anomaly detection. Machine learning metrics are tracked and displayed through analytics dashboards, providing insights into detection accuracy and system performance.

### Evidence Management
Blockchain-based evidence logging ensures immutable audit trails for forensic investigations. Evidence entries are cryptographically secured and linked to specific threats and incidents for comprehensive case management.

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connectivity through Neon's serverless platform
- **Replit Authentication**: OIDC-based authentication system integrated with Replit's platform
- **shadcn/ui + Radix UI**: Comprehensive component library providing accessible UI primitives
- **TanStack React Query**: Server state management and caching for efficient data fetching
- **Drizzle ORM**: Type-safe database operations and schema management
- **WebSocket (ws)**: Real-time bidirectional communication for live updates
- **Express Session + connect-pg-simple**: PostgreSQL-backed session storage
- **Vite**: Development server and build tooling for the React frontend
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Hook Form + Zod**: Form handling with schema validation
- **Wouter**: Lightweight client-side routing solution