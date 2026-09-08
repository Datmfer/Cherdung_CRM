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

// PATCH: Update blog post
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = verifyToken(token);
    if (!session || session.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, excerpt, content, coverImage, category, published } = body;

    const existingBlog = await db.blog.findUnique({ where: { id } });
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const updates: any = {};
    if (title !== undefined) {
      updates.title = title;
      const newSlug = slugify(title);
      if (newSlug !== existingBlog.slug) {
        const slugMatch = await db.blog.findUnique({ where: { slug: newSlug } });
        updates.slug = slugMatch ? `${newSlug}-${Date.now()}` : newSlug;
      }
    }
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;
    if (coverImage !== undefined) updates.coverImage = coverImage;
    if (category !== undefined) updates.category = category;
    if (published !== undefined) updates.published = Boolean(published);

    const updatedBlog = await db.blog.update({
      where: { id },
      data: updates,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    await logActivity(session.userId, "ADMIN_BLOG_UPDATED", { blogId: id, updates }, req);

    return NextResponse.json({
      success: true,
      blog: {
        ...updatedBlog,
        createdAt: updatedBlog.createdAt.toISOString(),
        updatedAt: updatedBlog.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

// DELETE: Delete blog post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = verifyToken(token);
    if (!session || session.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const existingBlog = await db.blog.findUnique({ where: { id } });
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    await db.blog.delete({ where: { id } });
    await logActivity(session.userId, "ADMIN_BLOG_DELETED", { blogId: id }, req);

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/admin/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
