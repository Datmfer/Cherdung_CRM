import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getBlogs, createBlog } from "@/lib/blogs";
import { db } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET: Fetch all published blog posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const blogs = await getBlogs(category);

    return NextResponse.json({
      success: true,
      blogs: blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blog.coverImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        category: blog.category,
        author: {
          id: blog.author?.id || blog.authorId,
          name: blog.author?.name || "Admin",
          avatarUrl: blog.author?.avatarUrl || null,
          role: blog.author?.role || "USER",
        },
        createdAt: typeof blog.createdAt === "string" ? blog.createdAt : blog.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST: Create a new blog post
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Please log in to post a blog" }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const body = await req.json();
    const { title, excerpt, content, coverImage, category } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    let baseSlug = slugify(title) || `post-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;

    // Check slug uniqueness via raw or ORM query
    const existingSlugs: any[] = await db.$queryRawUnsafe(`SELECT slug FROM Blog WHERE slug = ?`, slug);
    if (existingSlugs.length > 0) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const blog = await createBlog({
      title,
      slug,
      excerpt: excerpt || title,
      content,
      coverImage: coverImage || null,
      category: category || "Investment",
      authorId: session.userId,
    });

    return NextResponse.json({
      success: true,
      blog: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blog.coverImage,
        category: blog.category,
        author: blog.author,
        createdAt: typeof blog.createdAt === "string" ? blog.createdAt : blog.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
