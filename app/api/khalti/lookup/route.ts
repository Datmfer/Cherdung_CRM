import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "97fbe4b210774d5bb3674e204fd1117a";
const KHALTI_BASE_URL = "https://a.khalti.com/api/v2/epayment";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const { pidx } = await req.json();
    if (!pidx) {
      return NextResponse.json({ error: "pidx payment token required" }, { status: 400 });
    }

    const authHeader = KHALTI_SECRET_KEY.startsWith("Key ")
      ? KHALTI_SECRET_KEY
      : `Key ${KHALTI_SECRET_KEY}`;

    const response = await fetch(`${KHALTI_BASE_URL}/lookup/`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: "Khalti payment lookup failed" }, { status: 500 });
  }
}
