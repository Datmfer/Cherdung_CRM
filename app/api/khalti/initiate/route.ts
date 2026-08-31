import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "97fbe4b210774d5bb3674e204fd1117a";
const KHALTI_BASE_URL = "https://a.khalti.com/api/v2/epayment";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Log in required" }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, purchase_order_id, purchase_order_name } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json({ error: "Please enter a valid positive amount in NPR" }, { status: 400 });
    }

    // Convert NPR to Paisa (1 NPR = 100 Paisa)
    const amountInPaisa = Math.round(numAmount * 100);
    const orderId = purchase_order_id || `DEPOSIT-${Date.now()}`;
    const orderName = purchase_order_name || "Cherdung CRM Capital Deposit";

    const authHeader = KHALTI_SECRET_KEY.startsWith("Key ")
      ? KHALTI_SECRET_KEY
      : `Key ${KHALTI_SECRET_KEY}`;

    const khaltiPayload = {
      return_url: `${APP_URL}/api/khalti/callback`,
      website_url: APP_URL,
      amount: amountInPaisa,
      purchase_order_id: orderId,
      purchase_order_name: orderName,
      customer_info: {
        name: session.name || "Investor",
        email: session.email || "investor@cherdung.com",
      },
    };

    const response = await fetch(`${KHALTI_BASE_URL}/initiate/`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khaltiPayload),
    });

    const data = await response.json();

    if (!response.ok || !data.payment_url) {
      console.error("Khalti initiate error response:", data);
      return NextResponse.json(
        { error: data.detail || data.message || "Failed to initiate Khalti payment" },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pidx: data.pidx,
      payment_url: data.payment_url,
      amount: numAmount,
    });
  } catch (error: any) {
    console.error("Khalti initiate route exception:", error);
    return NextResponse.json({ error: "Khalti payment initialization failed" }, { status: 500 });
  }
}
