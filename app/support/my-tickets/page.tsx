"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Ticket as TicketIcon, CheckCircle } from "lucide-react";

interface SupportTicket {
  id: string;
  user: string;
  email: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
}

export default function MySupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

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
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Assigned Support Queue
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Support tickets assigned to your active agent session
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading assigned tickets...</div>
      ) : tickets.length === 0 ? (
        <Card className="text-center py-12 text-slate-400">No tickets assigned to you.</Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
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
                  </div>
                  <p className="text-sm text-slate-400">
                    Client: <span className="text-slate-200 font-medium">{ticket.user}</span> ({ticket.email})
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
