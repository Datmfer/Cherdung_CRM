"use client";

import React, { useState, useEffect } from "react";
import {
  LifeBuoy,
  MessageSquare,
  Plus,
  Paperclip,
  X,
  Send,
  CheckCircle,
  Clock,
  Tag,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  User,
  Shield,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react";

interface TicketAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "USER" | "SUPPORT" | "ADMIN";
  message: string;
  attachments?: TicketAttachment[];
  createdAt: string;
}

interface SupportTicket {
  id: string;
  userId: string;
  user: string;
  email: string;
  subject: string;
  category: "BILLING" | "TECHNICAL" | "ACCOUNT" | "SECURITY" | "INVESTMENTS" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  attachments?: TicketAttachment[];
  messages: TicketMessage[];
}

export default function UserSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);

  // New Ticket Form State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<string>("BILLING");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [message, setMessage] = useState("");
  const [createAttachments, setCreateAttachments] = useState<TicketAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Reply Thread Form State
  const [replyMessage, setReplyMessage] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<TicketAttachment[]>([]);
  const [replying, setReplying] = useState(false);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);

        // Update active ticket if currently open in thread view
        if (activeTicket) {
          const updated = (data.tickets || []).find((t: SupportTicket) => t.id === activeTicket.id);
          if (updated) setActiveTicket(updated);
        }
      }
    } catch (err) {
      console.error("Failed to fetch support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle local file selection simulation for attachments
  const handleFileAttachment = (
    e: React.ChangeEvent<HTMLInputElement>,
    isReply: boolean = false
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: TicketAttachment[] = Array.from(files).map((file, idx) => {
      const reader = new FileReader();
      const id = `ATT-${Date.now()}-${idx}`;
      let dataUrl = "";
      reader.onload = (evt) => {
        dataUrl = evt.target?.result as string;
      };
      reader.readAsDataURL(file);

      return {
        id,
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type || "application/octet-stream",
        url: URL.createObjectURL(file),
      };
    });

    if (isReply) {
      setReplyAttachments((prev) => [...prev, ...newAttachments]);
    } else {
      setCreateAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string, isReply: boolean = false) => {
    if (isReply) {
      setReplyAttachments((prev) => prev.filter((a) => a.id !== id));
    } else {
      setCreateAttachments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Submit new ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          category,
          priority,
          message,
          attachments: createAttachments,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setSubject("");
        setMessage("");
        setCreateAttachments([]);
        fetchTickets();
      } else {
        alert("Failed to submit support ticket");
      }
    } catch (err) {
      alert("Error submitting ticket");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit reply message to ticket thread
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || (!replyMessage.trim() && replyAttachments.length === 0)) return;

    setReplying(true);
    try {
      const res = await fetch(`/api/tickets/${activeTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyMessage,
          attachments: replyAttachments,
        }),
      });

      if (res.ok) {
        setReplyMessage("");
        setReplyAttachments([]);
        fetchTickets();
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setReplying(false);
    }
  };

  // Mark ticket as resolved
  const handleMarkResolved = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStatus: "RESOLVED" }),
      });
      if (res.ok) {
        fetchTickets();
      }
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "OPEN") return matchesSearch && (ticket.status === "OPEN" || ticket.status === "IN_PROGRESS");
    if (statusFilter === "RESOLVED") return matchesSearch && (ticket.status === "RESOLVED" || ticket.status === "CLOSED");
    return matchesSearch;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "URGENT":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">🔴 Urgent Priority</span>;
      case "HIGH":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">⚡ High Priority</span>;
      case "MEDIUM":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">🔵 Medium Priority</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">⚪ Low Priority</span>;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "OPEN":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Open</span>;
      case "IN_PROGRESS":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">In Progress</span>;
      case "RESOLVED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Resolved</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-300">Closed</span>;
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto text-white">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-8 rounded-3xl border border-cyan-500/20 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <LifeBuoy className="h-3.5 w-3.5" /> Client Support Hub
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Support Tickets & Live Messages</h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Submit inquiry tickets with attachments, select resolution priority, and track live conversation threads with support agents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 hover:scale-[1.02] shrink-0 cursor-pointer"
        >
          <Plus className="h-5 w-5" /> Submit New Ticket
        </button>
      </div>

      {/* Main Grid: Ticket List + Live Reply Thread Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tickets Queue List (5 cols on lg) */}
        <div className={`space-y-6 ${activeTicket ? "lg:col-span-5" : "lg:col-span-12"}`}>
          {/* Search & Status Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets by topic or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === "ALL" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("OPEN")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === "OPEN" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                Active ({tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("RESOLVED")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === "RESOLVED" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                Resolved ({tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length})
              </button>
            </div>
          </div>

          {/* Ticket Cards */}
          {loading ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading support ticket history...</span>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <MessageSquare className="h-12 w-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Tickets Found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                No tickets match your search criteria. Create a ticket if you need assistance!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const isSelected = activeTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setActiveTicket(ticket)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? "bg-slate-900 border-cyan-500 ring-1 ring-cyan-500 shadow-lg shadow-cyan-500/10"
                        : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {ticket.id}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                          {ticket.category}
                        </span>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white line-clamp-1">{ticket.subject}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {ticket.messages[ticket.messages.length - 1]?.message || "No messages yet"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-3">
                        {getPriorityBadge(ticket.priority)}
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                          {ticket.messages.length} replies
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Reply Thread View (7 cols on lg) */}
        {activeTicket ? (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between min-h-[600px] shadow-2xl space-y-6">
            {/* Thread Header */}
            <div className="space-y-4 border-b border-slate-800 pb-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    {activeTicket.id}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    Category: {activeTicket.category}
                  </span>
                  {getPriorityBadge(activeTicket.priority)}
                </div>

                <div className="flex items-center gap-2">
                  {activeTicket.status !== "RESOLVED" && (
                    <button
                      type="button"
                      onClick={() => handleMarkResolved(activeTicket.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTicket(null)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">{activeTicket.subject}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Opened by <span className="text-white font-semibold">{activeTicket.user}</span> on{" "}
                  {new Date(activeTicket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Messages Chat Stream */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 max-h-[450px]">
              {activeTicket.messages.map((msg) => {
                const isUser = msg.senderRole === "USER";

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isUser
                          ? "bg-cyan-600 text-white"
                          : "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[80%] space-y-2 p-4 rounded-2xl text-sm ${
                        isUser
                          ? "bg-cyan-950/60 border border-cyan-500/30 text-white rounded-tr-none"
                          : "bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-xs">
                        <span
                          className={`font-bold ${
                            isUser ? "text-cyan-400" : "text-purple-400"
                          }`}
                        >
                          {msg.senderName} ({msg.senderRole})
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>

                      {/* Attached Files List */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="pt-2 border-t border-slate-700/50 space-y-2">
                          <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                            <Paperclip className="h-3.5 w-3.5" /> Attachments:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {msg.attachments.map((att) => (
                              <a
                                key={att.id}
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-700 rounded-xl text-xs text-cyan-300 transition-colors"
                              >
                                {att.type.includes("image") ? (
                                  <ImageIcon className="h-3.5 w-3.5" />
                                ) : (
                                  <FileText className="h-3.5 w-3.5" />
                                )}
                                <span className="font-medium max-w-[150px] truncate">{att.name}</span>
                                <span className="text-[10px] text-slate-400">({att.size})</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-800 space-y-3">
              {/* Attachment Preview Badges */}
              {replyAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                  {replyAttachments.map((att) => (
                    <span
                      key={att.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 border border-slate-700"
                    >
                      <Paperclip className="h-3 w-3 text-cyan-400" />
                      <span className="max-w-[120px] truncate">{att.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id, true)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <label className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors shrink-0">
                  <Paperclip className="h-5 w-5 text-cyan-400" />
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileAttachment(e, true)}
                    className="hidden"
                  />
                </label>

                <textarea
                  rows={2}
                  placeholder="Type your response message..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />

                <button
                  type="submit"
                  disabled={replying || (!replyMessage.trim() && replyAttachments.length === 0)}
                  className="p-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-cyan-600/30 shrink-0 cursor-pointer"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden lg:flex lg:col-span-7 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 flex-col items-center justify-center text-center space-y-4">
            <MessageSquare className="h-16 w-16 text-slate-700" />
            <h3 className="text-xl font-bold text-white">Select a Ticket to View Live Conversation</h3>
            <p className="text-sm text-slate-400 max-w-md">
              Click any support ticket from the list on the left to view response history, send messages, or upload file attachments.
            </p>
          </div>
        )}
      </div>

      {/* ── Submit New Ticket Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-6 w-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Create Support Inquiry Ticket</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-5">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Subject / Topic Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question regarding 2FA security setup or invoice receipt"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Category & Priority Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <option value="BILLING">💳 Billing & Invoices</option>
                    <option value="TECHNICAL">💻 Technical & System Bugs</option>
                    <option value="SECURITY">🛡️ Account Security & 2FA</option>
                    <option value="INVESTMENTS">📈 Investment Plans & Returns</option>
                    <option value="ACCOUNT">👤 Profile & Account Updates</option>
                    <option value="OTHER">❓ General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Priority Level *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <option value="LOW">⚪ Low Priority (General Query)</option>
                    <option value="MEDIUM">🔵 Medium Priority (Standard Support)</option>
                    <option value="HIGH">⚡ High Priority (Urgent Assistance)</option>
                    <option value="URGENT">🔴 Critical / System Blocking</option>
                  </select>
                </div>
              </div>

              {/* Detailed Message */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide complete details about your issue or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              {/* Attach File Section */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Attach Supporting Files (Screenshots, PDFs)
                </label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-800 hover:border-cyan-500 rounded-2xl bg-slate-950/60 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors text-sm">
                    <Paperclip className="h-5 w-5" />
                    <span>Click to attach files or screenshots</span>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileAttachment(e, false)}
                      className="hidden"
                    />
                  </label>

                  {createAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {createAttachments.map((att) => (
                        <span
                          key={att.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 border border-slate-700"
                        >
                          <Paperclip className="h-3.5 w-3.5 text-cyan-400" />
                          <span>{att.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(att.id, false)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
