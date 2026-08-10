# Cherdung CRM Application

A modern, full-stack CRM built with Next.js 16, React 19, Prisma ORM, and Tailwind CSS featuring role-based access control, dual-token JWT authentication, email verification, password reset, admin tools with CSV export, audit logging, 2FA, avatar uploads, and Stripe subscription support.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (.env)
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="your-secret-key"

# 3. Setup database & seed data
npm run db:push
npm run seed

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Accounts (Post-Seed)

- **Admin Account:** `admin@cherdung.com` / `admin123`
- **Support Account:** `support@cherdung.com` / `support123`
- **User Account:** `user@cherdung.com` / `user12345`

---

## 🛠 Available Scripts

- `npm run dev`: Start Next.js development server.
- `npm run build`: Build production bundle.
- `npm run seed`: Seed database with initial users and plans.
- `npm run db:push`: Push Prisma schema to SQLite/Postgres DB.
- `npm run dev:db`: Open Prisma Studio database viewer.
- `npm run test`: Run Jest unit and API tests.
- `npm run test:e2e`: Run Playwright E2E browser tests.

---

## 📚 Documentation

For complete details on authentication flows, RBAC middleware, 2FA, API endpoints, and database models, refer to [AUTHENTICATION.md](AUTHENTICATION.md).
