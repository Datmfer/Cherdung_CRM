import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Log in required to upload images" }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate file type (image only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files (PNG, JPG, WEBP, GIF) are allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/blogs
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "blogs");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileExt = path.extname(file.name) || ".png";
    const sanitizedBase = path.basename(file.name, fileExt).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const fileName = `${sanitizedBase}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/blogs/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName,
      message: "Image uploaded successfully",
    });
  } catch (error: any) {
    console.error("Image upload route error:", error);
    return NextResponse.json({ error: "Failed to upload image file" }, { status: 500 });
  }
}
