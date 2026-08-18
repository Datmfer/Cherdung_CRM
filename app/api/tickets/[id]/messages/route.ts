import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import {
  getTicketById,
  addMessageToTicket,
  updateTicketStatus,
  TicketStatus,
} from "@/lib/ticketsStore";
import { logActivity } from "@/lib/activity";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = verifyToken(token);
    if (!session) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const ticket = getTicketById(id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const isAgent =
      session.role?.toLowerCase() === "admin" ||
      session.role?.toLowerCase() === "support";

    // Standard client can only reply to their own ticket
    if (!isAgent && ticket.email.toLowerCase() !== session.email.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { message, attachments, newStatus } = body;

    if (!message && !newStatus) {
      return NextResponse.json(
        { error: "Message or status update is required" },
        { status: 400 }
      );
    }

    let updatedTicket = ticket;

    if (message) {
      const senderRole = isAgent
        ? session.role.toUpperCase() === "ADMIN"
          ? "ADMIN"
          : "SUPPORT"
        : "USER";

      const res = addMessageToTicket(id, {
        senderId: session.userId,
        senderName: session.name || session.email.split("@")[0],
        senderRole,
        message,
        attachments: attachments || [],
        newStatus: newStatus as TicketStatus,
      });

      if (res) updatedTicket = res;
    } else if (newStatus) {
      const res = updateTicketStatus(id, newStatus as TicketStatus);
      if (res) updatedTicket = res;
    }

    await logActivity(
      session.userId,
      "TICKET_REPLY_ADDED",
      { ticketId: id, newStatus },
      req
    );

    return NextResponse.json({ success: true, ticket: updatedTicket });
  } catch (error: any) {
    console.error("POST /api/tickets/[id]/messages error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to post message" },
      { status: 500 }
    );
  }
}
