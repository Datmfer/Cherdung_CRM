# Production Authentication & Database Architecture

This document describes the production-grade authentication and database architecture implemented in the Cherdung CRM application.

---

## 🚀 Quick Start

### 1. Environment Setup
Copy or configure your `.env` file:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-access-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional Email & Stripe Configuration
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="2525"
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM="noreply@cherdung.com"
```

### 2. Initialize Database & Seed Demo Data
```bash
# Push Prisma schema to SQLite/Postgres DB
npm run db:push

# Seed admin, support, regular user, and default plans
npm run seed
```

Default credentials created by seed:
- **Admin:** `admin@cherdung.com` / `admin123` -> Redirects to `/admin/dashboard`
- **Support:** `support@cherdung.com` / `support123` -> Redirects to `/support/dashboard`
- **User:** `user@cherdung.com` / `user12345` -> Redirects to `/user-dashboard/dashboard`

---

## 🔐 Core Features Implemented

### 1. Prisma ORM Database Storage
- Replaced `users.json` with Prisma ORM database models (`User`, `RefreshToken`, `Session`, `VerificationToken`, `PasswordResetToken`, `Activity`, `Plan`).
- Works with SQLite locally (`dev.db`) and PostgreSQL in production via `DATABASE_URL`.

### 2. Server-Side Dual Token Auth with Rotation
- **Access Tokens:** Short-lived JWTs (15 minutes).
- **Refresh Tokens:** Long-lived tokens (7 days) stored securely as cryptographic SHA-256 hashes in the DB (`RefreshToken` model).
- **Rotation:** Refresh tokens are revoked and rotated on every `/api/auth/refresh` request to prevent replay attacks.
- **Cookies:** Stored in HTTP-Only, SameSite=Lax secure cookies (`access_token`, `refresh_token`).

### 3. Role-Based Access Control (RBAC) & Middleware
- Enforced automatically in `middleware.ts`:
  - `/admin/*`: Admin only.
  - `/support/*`: Admin and Support.
  - `/user-dashboard/*`: All authenticated users.
- Security Headers applied: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.

### 4. Server Validation & Email Verification Flow
- Input validation enforced with Zod schemas (`lib/validation.ts`).
- New signups receive a 24-hour verification token sent via email (or simulated in console if SMTP is unconfigured).

### 5. Password Reset Flow
- `/api/auth/request-reset`: Generates 1-hour reset token and dispatches reset email.
- `/api/auth/reset-password`: Verifies token, updates password hash, and revokes active sessions.
- Interactive UI at `/reset-password`.

### 6. Admin Panel: Pagination, Filters, Search & CSV Export
- `/api/admin/users`: Supports server-side pagination (`page`, `limit`), role filters (`role=ADMIN|SUPPORT|USER`), keyword search, and CSV downloads (`format=csv`).
- UI at `/admin/users`.

### 7. Avatar Uploads & Audit Logs
- File uploads: Multipart endpoint `/api/user/avatar` saving to `public/uploads/avatars`.
- Audit logs: Automatic logging via `lib/activity.ts` to `Activity` model, displayed dynamically in `ActivityFeed.tsx`.

### 8. Two-Factor Authentication (2FA / TOTP)
- TOTP secret generation, QR code rendering, and 6-digit verification via `/api/auth/2fa/*`.
- 2FA challenge enforced during login if enabled.

### 9. Stripe Billing & Subscriptions
- Subscriptions endpoints `/api/stripe/checkout` and `/api/stripe/webhook` with fallback mock mode for local testing.

---

## 🧪 Testing

```bash
# Run unit & API integration tests (Jest)
npm run test

# Run E2E browser tests (Playwright)
npm run test:e2e
```
