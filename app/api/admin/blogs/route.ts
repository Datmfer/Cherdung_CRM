import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET: Fetch all blog posts for Admin Panel
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session || session.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const blogs = await db.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      blogs: blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blog.coverImage,
        category: blog.category,
        published: blog.published,
        author: blog.author,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("GET /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST: Create a new blog post as Admin
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session || session.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { title, excerpt, content, coverImage, category, published = true } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    let baseSlug = slugify(title) || `post-${Date.now()}`;
    let slug = baseSlug;

    const existingBlog = await db.blog.findUnique({ where: { slug } });
    if (existingBlog) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const blog = await db.blog.create({
      data: {
        title,
        slug,
        excerpt: excerpt || title.slice(0, 120),
        content,
        coverImage: coverImage || null,
        category: category || "Investment",
        published: Boolean(published),
        authorId: session.userId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    await logActivity(session.userId, "ADMIN_BLOG_CREATED", { blogId: blog.id, title }, req);

    return NextResponse.json({
      success: true,
      blog: {
        ...blog,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("POST /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
