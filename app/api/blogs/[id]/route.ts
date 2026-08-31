import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await db.blog.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
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

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

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
        createdAt: blog.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const { id } = await params;
    const blog = await db.blog.findUnique({ where: { id } });

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Only allow author or admin to delete
    if (blog.authorId !== session.userId && session.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden: You do not have permission to delete this post" }, { status: 403 });
    }

    await db.blog.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
