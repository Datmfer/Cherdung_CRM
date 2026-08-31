"use client";

import React, { useState, useEffect } from "react";
import {
  Ticket as TicketIcon,
  Search,
  CheckCircle,
  MessageSquare,
  Paperclip,
  Send,
  X,
  User,
  Shield,
  FileText,
  Image as ImageIcon,
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

export default function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);

  // Reply Form State
  const [replyMessage, setReplyMessage] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<TicketAttachment[]>([]);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);

        if (activeTicket) {
          const updated = (data.tickets || []).find((t: SupportTicket) => t.id === activeTicket.id);
          if (updated) setActiveTicket(updated);
        }
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchTickets();
      }
    } catch (err) {
      alert("Failed to update ticket status");
    }
  };

  const handleFileAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        if (data.file) {
          const uploadedAtt: TicketAttachment = {
            id: data.file.id,
            name: data.file.name,
            size: data.file.size,
            type: data.file.type,
            url: data.file.url,
          };
          setReplyAttachments((prev) => [...prev, uploadedAtt]);
        }
      } catch (err: any) {
        alert(err.message || "Failed to upload attachment");
      }
    }
  };

  const removeAttachment = (id: string) => {
    setReplyAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSendAgentReply = async (e: React.FormEvent) => {
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
          newStatus: "IN_PROGRESS",
        }),
      });

      if (res.ok) {
        setReplyMessage("");
        setReplyAttachments([]);
        fetchTickets();
      }
    } catch (err) {
      console.error("Failed to post agent response:", err);
    } finally {
      setReplying(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "URGENT":
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">🔴 URGENT</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">⚡ HIGH</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">🔵 MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">⚪ LOW</span>;
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Queue & Resolution Center</h1>
        <p className="text-slate-400 text-sm mt-1">
          Respond to user support tickets, view attached files, update priorities, and manage ticket lifecycle.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by user, subject, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-800 rounded-xl bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
        >
          <option value="all">All Ticket Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Grid: Ticket List + Reply Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`space-y-4 ${activeTicket ? "lg:col-span-5" : "lg:col-span-12"}`}>
          {loading ? (
            <div className="text-center py-16 text-slate-400">Loading support queue...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              No tickets found matching your search.
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isSelected = activeTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setActiveTicket(ticket)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500 ring-1 ring-cyan-500 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {ticket.id}
                      </span>
                      {ticket.category && (
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                          {ticket.category}
                        </span>
                      )}
                    </div>
                    {getPriorityBadge(ticket.priority || "MEDIUM")}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{ticket.subject}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      User: <span className="text-white font-medium">{ticket.user}</span> ({ticket.email})
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <select
                      value={ticket.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                      className="px-2.5 py-1 border border-slate-700 rounded-lg bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>

                    <span className="text-[11px] text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Live Thread Drawer for Agent */}
        {activeTicket ? (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between min-h-[600px] shadow-2xl space-y-6">
            <div className="space-y-4 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    {activeTicket.id}
                  </span>
                  {getPriorityBadge(activeTicket.priority || "MEDIUM")}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">{activeTicket.subject}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  User: <span className="text-white font-semibold">{activeTicket.user}</span> ({activeTicket.email})
                </p>
              </div>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-2 max-h-[450px]">
              {activeTicket.messages &&
                activeTicket.messages.map((msg) => {
                  const isAgent = msg.senderRole === "SUPPORT" || msg.senderRole === "ADMIN";

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isAgent ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isAgent
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "bg-cyan-600 text-white"
                        }`}
                      >
                        {isAgent ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>

                      <div
                        className={`max-w-[80%] space-y-2 p-4 rounded-2xl text-sm ${
                          isAgent
                            ? "bg-purple-950/60 border border-purple-500/30 text-white rounded-tr-none"
                            : "bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-xs">
                          <span className={`font-bold ${isAgent ? "text-purple-400" : "text-cyan-400"}`}>
                            {msg.senderName} ({msg.senderRole})
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>

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
                                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-cyan-300 transition-colors"
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

            {/* Agent Reply Box */}
            <form onSubmit={handleSendAgentReply} className="pt-4 border-t border-slate-800 space-y-3">
              {replyAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                  {replyAttachments.map((att) => (
                    <span
                      key={att.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 border border-slate-700"
                    >
                      <Paperclip className="h-3 w-3 text-purple-400" />
                      <span className="max-w-[120px] truncate">{att.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
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
                  <Paperclip className="h-5 w-5 text-purple-400" />
                  <input
                    type="file"
                    multiple
                    onChange={handleFileAttachment}
                    className="hidden"
                  />
                </label>

                <textarea
                  rows={2}
                  placeholder="Type official support agent response..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />

                <button
                  type="submit"
                  disabled={replying || (!replyMessage.trim() && replyAttachments.length === 0)}
                  className="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-purple-600/30 shrink-0 cursor-pointer"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden lg:flex lg:col-span-7 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 flex-col items-center justify-center text-center space-y-4">
            <TicketIcon className="h-16 w-16 text-slate-700" />
            <h3 className="text-xl font-bold text-white">Select a Ticket to Manage</h3>
            <p className="text-sm text-slate-400 max-w-md">
              Click any ticket in the queue on the left to inspect user details, view attachments, and send official agent responses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
