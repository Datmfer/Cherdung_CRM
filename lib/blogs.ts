import { db } from "./db";
import crypto from "crypto";

export interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  authorId: string;
  published: boolean | number;
  createdAt: string | Date;
  updatedAt: string | Date;
  author?: {
    id: string;
    name: string;
    email?: string;
    avatarUrl: string | null;
    role?: string;
  };
}

// Fetch all published blogs
export async function getBlogs(category?: string | null): Promise<BlogData[]> {
  try {
    // 1. Try standard Prisma ORM model
    if ((db as any).blog && typeof (db as any).blog.findMany === "function") {
      const where: any = { published: true };
      if (category && category !== "All") {
        where.category = category;
      }
      const items = await (db as any).blog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, email: true, avatarUrl: true, role: true },
          },
        },
      });
      return items;
    }
  } catch (err) {
    console.warn("ORM blog findMany failed, using raw query fallback:", err);
  }

  // 2. Fallback to raw SQL for cached Prisma instance in running server
  let query = `
    SELECT 
      b.id, b.title, b.slug, b.excerpt, b.content, b.coverImage, b.category, b.authorId, b.published, b.createdAt, b.updatedAt,
      u.name as authorName, u.email as authorEmail, u.avatarUrl as authorAvatarUrl, u.role as authorRole
    FROM Blog b
    JOIN User u ON b.authorId = u.id
    WHERE b.published = 1 OR b.published = 'true'
  `;

  if (category && category !== "All") {
    query += ` AND b.category = '${category.replace(/'/g, "''")}'`;
  }

  query += ` ORDER BY b.createdAt DESC`;

  const rows: any[] = await db.$queryRawUnsafe(query);

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    coverImage: r.coverImage,
    category: r.category,
    authorId: r.authorId,
    published: Boolean(r.published),
    createdAt: typeof r.createdAt === "number" ? new Date(r.createdAt) : r.createdAt,
    updatedAt: typeof r.updatedAt === "number" ? new Date(r.updatedAt) : r.updatedAt,
    author: {
      id: r.authorId,
      name: r.authorName || "Admin",
      email: r.authorEmail || "",
      avatarUrl: r.authorAvatarUrl || null,
      role: r.authorRole || "USER",
    },
  }));
}

// Create a new blog post
export async function createBlog(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category?: string;
  authorId: string;
}): Promise<BlogData> {
  const { title, slug, excerpt, content, coverImage, category = "Investment", authorId } = data;

  try {
    if ((db as any).blog && typeof (db as any).blog.create === "function") {
      const created = await (db as any).blog.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          coverImage: coverImage || null,
          category,
          authorId,
          published: true,
        },
        include: {
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });
      return created;
    }
  } catch (err) {
    console.warn("ORM blog create failed, using raw query fallback:", err);
  }

  // Fallback to raw SQL
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.$executeRawUnsafe(
    `INSERT INTO Blog (id, title, slug, excerpt, content, coverImage, category, authorId, published, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    id,
    title,
    slug,
    excerpt,
    content,
    coverImage || null,
    category,
    authorId,
    now,
    now
  );

  const author = await db.user.findUnique({
    where: { id: authorId },
    select: { id: true, name: true, avatarUrl: true, role: true },
  });

  return {
    id,
    title,
    slug,
    excerpt,
    content,
    coverImage: coverImage || null,
    category,
    authorId,
    published: true,
    createdAt: now,
    updatedAt: now,
    author: author || { id: authorId, name: "Author", avatarUrl: null },
  };
}
