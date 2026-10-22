# NGANYA HIRE - Premium Booking Platform

A production-ready Next.js application for hiring customized Kenyan matatus (nganyas).

## Features

- **Premium UI/UX**: Dark theme with neon accents inspired by Nairobi matatu culture.
- **Role-Based Access**: Specialized dashboards for Customers, Drivers, Owners, and Admins.
- **Real-Time Availability**: Conflict checks against driver schedules and existing bookings.
- **PWA Support**: Installable on Android and Desktop with offline support and custom prompt.
- **Secure Auth**: Powered by Auth.js with role-based middleware protection.
- **Modern Stack**: Next.js 15, TypeScript, Drizzle ORM, Neon PostgreSQL, Tailwind CSS v4.

## Getting Started

### 1. Prerequisites
- Node.js 18+
- A Neon PostgreSQL database (or any PostgreSQL instance)

### 2. Installation
```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup
Create a `.env.local` file based on `.env.example`:
```env
DATABASE_URL=your_neon_postgres_url
AUTH_SECRET=your_auth_secret_at_least_32_chars
AUTH_URL=http://localhost:3000
```

### 4. Database Setup
```bash
# Push the schema to the database
npm run db:push

# Seed initial data (Admin, Owner, Driver, and Vehicles)
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

## Admin Credentials (Seeded)
- **Admin**: admin@nganyahire.com / admin123
- **Owner**: owner@nganyahire.com / owner123
- **Driver**: driver@nganyahire.com / driver123

## Tech Stack Detail
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Lucide Icons.
- **Backend**: Next.js Server Actions & Route Handlers.
- **Database**: Neon PostgreSQL via Drizzle ORM.
- **Auth**: Auth.js (NextAuth v5 Beta).
- **PWA**: Custom service worker and manifest.
