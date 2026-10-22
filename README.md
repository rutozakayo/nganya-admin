# NGANYA HIRE — Admin & owner console

Staff console and vehicle-owner portal. Not a public registration surface for admins.

**Live:** https://nganya-admin.vercel.app

## Scope
- `/login` staff sign-in, `/post-login` role routing
- `/admin` platform overview (customers, drivers, owners, vehicles, bookings)
- `/owner` owner portal, `/owner/register` owner application
- Customers and drivers are rejected here and sent to their own portals

## Creating the first administrator
There is no public admin signup. Promote an existing account with a trusted server-side
procedure, e.g. against the shared database:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'you@example.com';
```

## Environment
```
DATABASE_URL=postgresql://...   # shared Neon database
AUTH_SECRET=...                 # must match the other two apps
```

## Local
```bash
npm install --legacy-peer-deps
npm run dev
```
