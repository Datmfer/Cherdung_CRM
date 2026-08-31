import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log('🌱 Starting Prisma DB Seeding & Migration...');

  // 1. Migrate users from data/users.json if it exists
  const usersJsonPath = path.join(process.cwd(), 'data', 'users.json');
  if (fs.existsSync(usersJsonPath)) {
    try {
      const fileData = fs.readFileSync(usersJsonPath, 'utf-8');
      const oldUsers = JSON.parse(fileData);

      console.log(`📦 Found ${oldUsers.length} accounts in users.json. Migrating to DB...`);

      for (const oldUser of oldUsers) {
        if (!oldUser.email) continue;
        const normalizedEmail = oldUser.email.toLowerCase();

        await prisma.user.upsert({
          where: { email: normalizedEmail },
          update: {
            passwordHash: oldUser.password,
            name: oldUser.name,
            role: (oldUser.role || 'USER').toUpperCase(),
          },
          create: {
            id: oldUser.id || undefined,
            email: normalizedEmail,
            passwordHash: oldUser.password,
            name: oldUser.name,
            role: (oldUser.role || 'USER').toUpperCase(),
            emailVerified: new Date(),
          },
        });
        console.log(`  └─ Migrated account: ${normalizedEmail} (${oldUser.role})`);
      }
    } catch (err) {
      console.error('Error migrating users.json:', err);
    }
  }

  // 2. Ensure default demo accounts exist
  const adminPassword = await hashPassword('admin123');
  await prisma.user.upsert({
    where: { email: 'admin@cherdung.com' },
    update: {},
    create: {
      email: 'admin@cherdung.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  const supportPassword = await hashPassword('support123');
  await prisma.user.upsert({
    where: { email: 'support@cherdung.com' },
    update: {},
    create: {
      email: 'support@cherdung.com',
      passwordHash: supportPassword,
      name: 'Support Agent',
      role: 'SUPPORT',
      emailVerified: new Date(),
    },
  });

  const userPassword = await hashPassword('user12345');
  await prisma.user.upsert({
    where: { email: 'user@cherdung.com' },
    update: {},
    create: {
      email: 'user@cherdung.com',
      passwordHash: userPassword,
      name: 'Demo Client',
      role: 'USER',
      emailVerified: new Date(),
    },
  });

  // 3. Seed Default Plans
  const plans = [
    {
      name: 'Starter Tier',
      stripePriceId: 'price_starter_mock',
      price: 49,
      interval: 'monthly',
      features: JSON.stringify(['Up to 5 Users', 'Basic CRM Analytics', 'Standard Support', '5GB Storage']),
    },
    {
      name: 'Professional Tier',
      stripePriceId: 'price_pro_mock',
      price: 149,
      interval: 'monthly',
      features: JSON.stringify(['Up to 25 Users', 'Advanced AI Insights', 'Priority 24/7 Support', '50GB Storage', 'Custom Workflows']),
    },
    {
      name: 'Enterprise Tier',
      stripePriceId: 'price_enterprise_mock',
      price: 499,
      interval: 'monthly',
      features: JSON.stringify(['Unlimited Users', 'Dedicated Account Manager', 'Custom API Integrations', 'Unlimited Storage', 'SLA Guarantee']),
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { stripePriceId: plan.stripePriceId },
      update: plan,
      create: plan,
    });
  }

  // 4. Seed Initial Portfolio Transactions for Demo Client
  const demoUser = await prisma.user.findUnique({ where: { email: 'user@cherdung.com' } });
  if (demoUser) {
    const existingTxns = await (prisma as any).transaction.count({ where: { userId: demoUser.id } });
    if (existingTxns === 0) {
      await (prisma as any).transaction.createMany({
        data: [
          { userId: demoUser.id, type: 'DEPOSIT', amount: 107110, status: 'COMPLETED', createdAt: new Date('2024-01-01') },
          { userId: demoUser.id, type: 'PROFIT_PAYOUT', amount: 1240, status: 'COMPLETED', createdAt: new Date('2024-01-15') },
          { userId: demoUser.id, type: 'PROFIT_PAYOUT', amount: 17100, status: 'COMPLETED', createdAt: new Date('2024-02-01') },
        ],
      });
      console.log('  └─ Seeded baseline portfolio transactions for demo user.');
    }
  }

  // 5. Seed Initial Blog Posts
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@cherdung.com' } });
  if (adminUser) {
    const existingBlogs = await (prisma as any).blog.count();
    if (existingBlogs === 0) {
      await (prisma as any).blog.createMany({
        data: [
          {
            title: '5 Strategies for High-Yield Portfolio Growth in 2026',
            slug: '5-strategies-for-high-yield-portfolio-growth-2026',
            excerpt: 'Explore essential risk-mitigation strategies and smart asset allocation models designed for sustainable returns.',
            content: 'In 2026, dynamic market shifts require investors to balance liquid reserves with growth plan equity holdings. In this comprehensive guide, we unpack how to allocate capital across low-risk fixed yield tiers and growth plans while ensuring steady dividend payouts.',
            coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
            category: 'Investment',
            authorId: adminUser.id,
            published: true,
          },
          {
            title: 'Q3 Global Market Analysis & Dividend Forecasts',
            slug: 'q3-global-market-analysis-and-dividend-forecasts',
            excerpt: 'An in-depth look at global macro trends, rate adjustments, and dividend distribution outlooks for the upcoming quarter.',
            content: 'Our quantitative analytics team has published the Q3 economic forecast. Key takeaways include steady performance in tech assets, rising yields in fixed-income portfolios, and optimized automated payouts.',
            coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
            category: 'Market Analysis',
            authorId: adminUser.id,
            published: true,
          },
          {
            title: 'Maximizing CRM Workflows for Portfolio Managers',
            slug: 'maximizing-crm-workflows-for-portfolio-managers',
            excerpt: 'Learn how to leverage automated activity logs, 2FA security, and real-time transaction reporting in your daily operations.',
            content: 'Modern CRM platforms empower financial managers to streamline client communications, track multi-tier asset portfolios, and audit transactions with full transparency.',
            coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            category: 'CRM & Tech',
            authorId: adminUser.id,
            published: true,
          },
        ],
      });
      console.log('  └─ Seeded initial blog posts.');
    }
  }

  console.log('🚀 Database seeding & migration completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
