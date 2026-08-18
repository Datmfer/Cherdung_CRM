import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import {
  getAllTickets,
  getUserTickets,
  createTicket,
  TicketCategory,
  TicketPriority,
} from "@/lib/ticketsStore";
import { logActivity } from "@/lib/activity";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = verifyToken(token);
    if (!session) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const isAgent =
      session.role?.toLowerCase() === "admin" ||
      session.role?.toLowerCase() === "support";

    const tickets = isAgent
      ? getAllTickets()
      : getUserTickets(session.email, session.userId);

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    console.error("GET /api/tickets error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = verifyToken(token);
    if (!session) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { subject, category, priority, message, attachments } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and Message are required" },
        { status: 400 }
      );
    }

    const ticket = createTicket({
      userId: session.userId,
      userName: session.name || session.email.split("@")[0],
      userEmail: session.email,
      subject,
      category: (category as TicketCategory) || "OTHER",
      priority: (priority as TicketPriority) || "MEDIUM",
      message,
      attachments: attachments || [],
    });

    await logActivity(
      session.userId,
      "TICKET_CREATED",
      { ticketId: ticket.id, subject: ticket.subject, category: ticket.category },
      req
    );

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error("POST /api/tickets error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create ticket" },
      { status: 500 }
    );
  }
}
