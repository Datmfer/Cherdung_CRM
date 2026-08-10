"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { Ticket as TicketIcon, Search, CheckCircle, Clock } from "lucide-react";

interface SupportTicket {
  id: string;
  user: string;
  email: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
}

export default function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const priorityColors = {
    HIGH: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    LOW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "OPEN": return "danger";
      case "IN_PROGRESS": return "warning";
      case "RESOLVED": return "success";
      default: return "default";
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Support Queue & Ticket Resolution
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review, assign, and resolve user support inquiries
        </p>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search tickets by user, subject, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Ticket Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading support queue...</div>
      ) : filteredTickets.length === 0 ? (
        <Card className="text-center py-12 text-slate-400">
          No tickets found matching your search.
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="border border-slate-700/50 hover:border-slate-600">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-cyan-400 font-bold px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20">
                      {ticket.id}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {ticket.subject}
                    </h3>
                    <Badge variant={statusBadgeVariant(ticket.status)}>
                      {ticket.status.replace(/_/g, ' ')}
                    </Badge>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[ticket.priority]}`}>
                      {ticket.priority} PRIORITY
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Requested by <span className="text-slate-200 font-medium">{ticket.user}</span> ({ticket.email}) • {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                    className="px-3 py-1.5 border border-slate-700 rounded-xl bg-slate-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <option value="OPEN">Mark Open</option>
                    <option value="IN_PROGRESS">Mark In Progress</option>
                    <option value="RESOLVED">Mark Resolved</option>
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
