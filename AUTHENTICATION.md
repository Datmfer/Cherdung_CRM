# Authentication System

This CRM application now has a complete authentication system with role-based access control.

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory with the following:

```env
JWT_SECRET=your-secret-key-here
```

**Important:** Change the JWT_SECRET to a secure random string in production!

### 2. Create Admin User

Run the admin creation script:

```bash
npm run create-admin
```

This will create an admin user with:
- Email: `admin@cherdung.com`
- Password: `admin123`

**⚠️ Important:** Change the admin password after first login!

### 3. Start the Development Server

```bash
npm run dev
```

## Login Credentials

### Admin Access
- **Email:** admin@cherdung.com
- **Password:** admin123
- **Redirects to:** `/admin/dashboard`

### Regular User Access
- Sign up via `/signup` page
- Default role: `user`
- **Redirects to:** `/user-dashboard/dashboard`

## Features

### 🔐 Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for session management
- Automatic token expiration (7 days)

### 👥 Role-Based Access Control
- **Admin:** Full access to admin panel (`/admin/*`)
- **Support:** Access to support panel (`/support/*`)
- **User:** Access to user dashboard (`/user-dashboard/*`)

### 🛡️ Route Protection
- Middleware protects all role-specific routes
- Automatic redirects based on user role
- Login redirects users to appropriate dashboard

### 🚪 Session Management
- Login/logout functionality
- Persistent sessions with cookies
- Auto-redirect on login based on role
- Logout clears session and redirects to login

## API Endpoints

### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  },
  "token": "jwt-token"
}
```

### POST `/api/auth/signup`
Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt-token"
}
```

### POST `/api/auth/logout`
Logout the current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET `/api/auth/me`
Get current authenticated user.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

## File Structure

```
lib/
├── types.ts           # TypeScript interfaces
├── auth.ts            # Authentication utilities (hash, verify, tokens)
└── storage.ts         # User data storage (JSON file based)

contexts/
└── AuthContext.tsx    # React context for auth state management

app/api/auth/
├── login/route.ts     # Login API endpoint
├── signup/route.ts    # Signup API endpoint
├── logout/route.ts    # Logout API endpoint
└── me/route.ts        # Get current user endpoint

scripts/
└── create-admin.ts    # Admin user creation script

middleware.ts          # Route protection middleware
```

## Security Notes

### Current Implementation (MVP)
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ HTTP-only cookies
- ✅ Role-based route protection
- ✅ Input validation

### Production Enhancements Needed
- 🔲 Use a real database (PostgreSQL, MongoDB, etc.)
- 🔲 Implement rate limiting for login attempts
- 🔲 Add email verification for signup
- 🔲 Implement password reset functionality
- 🔲 Add two-factor authentication
- 🔲 Use HTTPS in production
- 🔲 Implement CSRF protection
- 🔲 Add audit logging
- 🔲 Use environment variables for all sensitive data
- 🔲 Implement session timeout warnings

## User Data Storage

Currently, user data is stored in a JSON file (`data/users.json`). For production, this should be replaced with a proper database.

### Creating Additional Admin/Support Users

To create additional admin or support users, you can:

1. **Modify the create-admin script** to create users with different roles
2. **Add a registration code system** for role-based signup
3. **Create an admin panel** to manage users and roles

### Example: Creating a Support User

Modify `scripts/create-admin.ts`:

```typescript
const role: 'admin' | 'support' | 'user' = 'support';
const email = 'support@cherdung.com';
```

Then run `npm run create-admin`.

## Troubleshooting

### Login Not Working
- Check that the admin user was created successfully
- Verify the JWT_SECRET is set in .env
- Check browser console for errors
- Ensure cookies are enabled in your browser

### Route Protection Issues
- Clear your browser cookies
- Check that middleware.ts is properly configured
- Verify token is being set in cookies

### Admin Script Issues
- Ensure you have the required dependencies installed
- Check that the data directory exists
- Verify file permissions

## Next Steps

1. **Set up a real database** - Replace JSON file storage with a proper database
2. **Add email verification** - Implement email confirmation for new users
3. **Add password reset** - Allow users to reset forgotten passwords
4. **Implement rate limiting** - Prevent brute force attacks
5. **Add 2FA** - Two-factor authentication for enhanced security
6. **Add audit logging** - Track user actions for security monitoring
