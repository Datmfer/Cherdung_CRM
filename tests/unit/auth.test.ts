import { hashPassword, verifyPassword, generateAccessToken, verifyToken } from '@/lib/auth';
import { loginSchema, signupSchema } from '@/lib/validation';

describe('Auth Utilities', () => {
  it('should hash and verify passwords correctly', async () => {
    const raw = 'Password123!';
    const hashed = await hashPassword(raw);
    expect(hashed).not.toBe(raw);
    const isValid = await verifyPassword(raw, hashed);
    expect(isValid).toBe(true);
    const isInvalid = await verifyPassword('WrongPassword', hashed);
    expect(isInvalid).toBe(false);
  });

  it('should generate and verify access tokens', () => {
    const userPayload = {
      userId: 'test-user-123',
      email: 'test@example.com',
      role: 'ADMIN',
      name: 'Test Admin',
    };
    const token = generateAccessToken(userPayload);
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(userPayload.userId);
    expect(decoded?.email).toBe(userPayload.email);
    expect(decoded?.role).toBe(userPayload.role);
  });
});

describe('Validation Schemas', () => {
  it('should validate valid login inputs', () => {
    const valid = loginSchema.safeParse({ email: 'user@example.com', password: 'password123' });
    expect(valid.success).toBe(true);
  });

  it('should reject invalid signup inputs', () => {
    const invalid = signupSchema.safeParse({ name: 'A', email: 'not-an-email', password: 'short' });
    expect(invalid.success).toBe(false);
  });

  it('should accept strong passwords for signup', () => {
    const valid = signupSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'StrongPassword123!',
    });
    expect(valid.success).toBe(true);
  });
});
