import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getAllTickets, updateTicketStatus, TicketStatus } from "@/lib/ticketsStore";
import { logActivity } from "@/lib/activity";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = verifyToken(token);
    if (
      !session ||
      (session.role.toLowerCase() !== "admin" &&
        session.role.toLowerCase() !== "support")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, tickets: getAllTickets() });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = verifyToken(token);
    if (
      !session ||
      (session.role.toLowerCase() !== "admin" &&
        session.role.toLowerCase() !== "support")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, status } = await req.json();
    const updated = updateTicketStatus(id, status as TicketStatus);
    if (updated) {
      await logActivity(
        session.userId,
        "TICKET_STATUS_UPDATED",
        { ticketId: id, status },
        req
      );
    }

    return NextResponse.json({ success: true, tickets: getAllTickets() });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
