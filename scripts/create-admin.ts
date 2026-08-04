import { hashPassword } from '../lib/auth';
import { createUser, findUserByEmail } from '../lib/storage';
import { User } from '../lib/types';

async function createAdmin() {
  const email = 'admin@cherdung.com';
  const password = 'admin123'; // Change this in production!
  const name = 'Admin User';
  const role: 'admin' | 'support' | 'user' = 'admin';

  console.log('Creating admin user...');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('⚠️  Please change the password after first login!\n');

  // Check if admin already exists
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    console.log('Admin user already exists!');
    console.log('User ID:', existingUser.id);
    console.log('Email:', existingUser.email);
    console.log('Role:', existingUser.role);
    return;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create admin user
  try {
    const admin = createUser({
      email,
      password: hashedPassword,
      role,
      name,
    });

    console.log('✅ Admin user created successfully!');
    console.log('User ID:', admin.id);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Name:', admin.name);
    console.log('\nYou can now login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

// Run the script
createAdmin().catch(console.error);
