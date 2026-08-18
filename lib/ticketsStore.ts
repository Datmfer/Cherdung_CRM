export interface TicketAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "USER" | "SUPPORT" | "ADMIN";
  message: string;
  attachments?: TicketAttachment[];
  createdAt: string;
}

export type TicketCategory =
  | "BILLING"
  | "TECHNICAL"
  | "ACCOUNT"
  | "SECURITY"
  | "INVESTMENTS"
  | "OTHER";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportTicket {
  id: string;
  userId: string;
  user: string;
  email: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  attachments?: TicketAttachment[];
  messages: TicketMessage[];
}

// Global in-memory tickets storage with rich demo data
const globalForTickets = globalThis as unknown as {
  mockTickets: SupportTicket[];
};

if (!globalForTickets.mockTickets) {
  globalForTickets.mockTickets = [
    {
      id: "TICK-101",
      userId: "user-demo-01",
      user: "Deepak Magar",
      email: "dpk@gmail.com",
      subject: "Account 2FA Setup Query & Secret Key",
      category: "SECURITY",
      priority: "HIGH",
      status: "OPEN",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      messages: [
        {
          id: "MSG-1",
          senderId: "user-demo-01",
          senderName: "Deepak Magar",
          senderRole: "USER",
          message:
            "Hello team, I am trying to enable TOTP 2FA on my account but the QR code does not scan properly on my Google Authenticator app. Attached screenshot of the issue.",
          attachments: [
            {
              id: "ATT-1",
              name: "2fa_error_screenshot.png",
              url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
              size: "142 KB",
              type: "image/png",
            },
          ],
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: "MSG-2",
          senderId: "support-agent-01",
          senderName: "Support Agent (Alex)",
          senderRole: "SUPPORT",
          message:
            "Hi Deepak, thank you for reaching out! Please try copying the manual 32-character secret key below the QR code directly into your authenticator app. Let us know if that resolves it.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
    },
    {
      id: "TICK-102",
      userId: "user-demo-02",
      user: "Ram Bahadur",
      email: "ram@chd.com",
      subject: "Billing Invoice Request for Monthly Plan",
      category: "BILLING",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      messages: [
        {
          id: "MSG-3",
          senderId: "user-demo-02",
          senderName: "Ram Bahadur",
          senderRole: "USER",
          message:
            "Could you please send me an official VAT tax invoice for my Professional Tier monthly subscription charge?",
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: "MSG-4",
          senderId: "support-agent-01",
          senderName: "Support Agent (Sarah)",
          senderRole: "SUPPORT",
          message:
            "We have processed your invoice request. Our finance department is generating the PDF receipt now.",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
      ],
    },
    {
      id: "TICK-103",
      userId: "user-demo-03",
      user: "Demo Client",
      email: "user@cherdung.com",
      subject: "Portfolio Return Analytics Explanation",
      category: "INVESTMENTS",
      priority: "LOW",
      status: "RESOLVED",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      messages: [
        {
          id: "MSG-5",
          senderId: "user-demo-03",
          senderName: "Demo Client",
          senderRole: "USER",
          message:
            "I noticed a payout calculation on my portfolio dashboard. How is the monthly profit distribution calculated?",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "MSG-6",
          senderId: "support-agent-01",
          senderName: "Support Agent (Alex)",
          senderRole: "SUPPORT",
          message:
            "Profit distributions are calculated on the 1st of every month based on your active plan tier percentage.",
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        },
      ],
    },
  ];
}

export const ticketsStore = globalForTickets.mockTickets;

export function getAllTickets(): SupportTicket[] {
  return ticketsStore;
}

export function getUserTickets(email?: string, userId?: string): SupportTicket[] {
  if (!email && !userId) return ticketsStore;
  return ticketsStore.filter(
    (t) =>
      (email && t.email.toLowerCase() === email.toLowerCase()) ||
      (userId && t.userId === userId)
  );
}

export function getTicketById(id: string): SupportTicket | undefined {
  return ticketsStore.find((t) => t.id === id);
}

export function createTicket(data: {
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  message: string;
  attachments?: TicketAttachment[];
}): SupportTicket {
  const newId = `TICK-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  const newTicket: SupportTicket = {
    id: newId,
    userId: data.userId,
    user: data.userName,
    email: data.userEmail,
    subject: data.subject,
    category: data.category,
    priority: data.priority,
    status: "OPEN",
    createdAt: now,
    updatedAt: now,
    attachments: data.attachments || [],
    messages: [
      {
        id: `MSG-${Date.now()}`,
        senderId: data.userId,
        senderName: data.userName,
        senderRole: "USER",
        message: data.message,
        attachments: data.attachments || [],
        createdAt: now,
      },
    ],
  };

  ticketsStore.unshift(newTicket);
  return newTicket;
}

export function addMessageToTicket(
  ticketId: string,
  data: {
    senderId: string;
    senderName: string;
    senderRole: "USER" | "SUPPORT" | "ADMIN";
    message: string;
    attachments?: TicketAttachment[];
    newStatus?: TicketStatus;
  }
): SupportTicket | null {
  const ticket = getTicketById(ticketId);
  if (!ticket) return null;

  const now = new Date().toISOString();
  const newMessage: TicketMessage = {
    id: `MSG-${Date.now()}`,
    senderId: data.senderId,
    senderName: data.senderName,
    senderRole: data.senderRole,
    message: data.message,
    attachments: data.attachments || [],
    createdAt: now,
  };

  ticket.messages.push(newMessage);
  ticket.updatedAt = now;

  if (data.newStatus) {
    ticket.status = data.newStatus;
  } else if (data.senderRole === "SUPPORT" || data.senderRole === "ADMIN") {
    ticket.status = "IN_PROGRESS";
  }

  return ticket;
}

export function updateTicketStatus(ticketId: string, status: TicketStatus): SupportTicket | null {
  const ticket = getTicketById(ticketId);
  if (!ticket) return null;
  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  return ticket;
}
