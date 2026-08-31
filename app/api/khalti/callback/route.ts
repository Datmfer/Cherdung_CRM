import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "97fbe4b210774d5bb3674e204fd1117a";
const KHALTI_BASE_URL = "https://a.khalti.com/api/v2/epayment";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pidx = searchParams.get("pidx");
    const status = searchParams.get("status");

    if (!pidx) {
      return NextResponse.redirect(`${APP_URL}/user-dashboard/transactions?payment=error&message=Missing+payment+token`);
    }

    const authHeader = KHALTI_SECRET_KEY.startsWith("Key ")
      ? KHALTI_SECRET_KEY
      : `Key ${KHALTI_SECRET_KEY}`;

    // Verify payment status directly with Khalti Lookup API
    const lookupRes = await fetch(`${KHALTI_BASE_URL}/lookup/`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const lookupData = await lookupRes.json();

    if (lookupData.status === "Completed") {
      const amountInNpr = Number(lookupData.total_amount) / 100;

      // Extract user from session cookie
      const token = req.cookies.get("access_token")?.value || req.cookies.get("auth_token")?.value;
      let userId: string | null = null;
      if (token) {
        const session = verifyToken(token);
        if (session) userId = session.userId;
      }

      // If user session exists, create COMPLETED deposit transaction in DB
      if (userId) {
        // Prevent duplicate transaction entry
        const existingTxn = await (db as any).transaction.findFirst({
          where: { userId, amount: amountInNpr, type: "DEPOSIT", status: "COMPLETED" },
          orderBy: { createdAt: "desc" },
        });

        const isRecent = existingTxn && Date.now() - new Date(existingTxn.createdAt).getTime() < 300000;

        if (!isRecent) {
          await (db as any).transaction.create({
            data: {
              userId,
              type: "DEPOSIT",
              amount: amountInNpr,
              status: "COMPLETED",
            },
          });
        }
      }

      return NextResponse.redirect(
        `${APP_URL}/user-dashboard/transactions?payment=success&amount=${amountInNpr}&pidx=${pidx}`
      );
    } else {
      return NextResponse.redirect(
        `${APP_URL}/user-dashboard/transactions?payment=failed&status=${lookupData.status || status}`
      );
    }
  } catch (error: any) {
    console.error("Khalti callback error:", error);
    return NextResponse.redirect(`${APP_URL}/user-dashboard/transactions?payment=error&message=Verification+failed`);
  }
}
