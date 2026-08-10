"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { useAuth } from "@/contexts/AuthContext";
import { LifeBuoy, Ticket, Search, BookOpen, ArrowRight } from "lucide-react";

export default function SupportDashboard() {
  const { user } = useAuth();

  const [openCount, setOpenCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);

  useEffect(() => {
    fetchTicketStats();
  }, []);

  const fetchTicketStats = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      if (res.ok) {
        const data = await res.json();
        const tickets = data.tickets || [];
        setOpenCount(tickets.filter((t: any) => t.status === "OPEN").length);
        setInProgressCount(tickets.filter((t: any) => t.status === "IN_PROGRESS").length);
        setResolvedCount(tickets.filter((t: any) => t.status === "RESOLVED").length);
      }
    } catch (err) {
      console.error("Failed to load ticket stats:", err);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      {/* Support Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900/60 via-slate-900 to-indigo-900/60 border border-cyan-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
            <LifeBuoy className="h-3.5 w-3.5" /> SUPPORT AGENT PORTAL
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Support Operations Center
          </h1>
          <p className="text-slate-400 text-sm">
            Welcome back, <span className="text-cyan-300 font-semibold">{user?.name || "Support Agent"}</span>! Assisting users and managing support inquiries.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/support/tickets"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20"
          >
            <Ticket className="h-4 w-4" /> View All Tickets <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support/user-lookup"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            <Search className="h-4 w-4 text-cyan-400" /> User Lookup Tool
          </Link>
        </div>
      </div>

      {/* Ticket Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/support/tickets" className="block transition-transform hover:scale-[1.02]">
          <StatCard
            title="Open Support Tickets"
            value={`${openCount} Open`}
            change="Requires attention"
            icon="🎫"
            color="indigo"
          />
        </Link>
        <StatCard
          title="In Progress"
          value={`${inProgressCount} Active`}
          change="Being resolved"
          icon="🔄"
          color="blue"
        />
        <StatCard
          title="Resolved Tickets"
          value={`${resolvedCount} Closed`}
          change="Successfully resolved"
          icon="✅"
          color="green"
        />
        <StatCard
          title="Average SLA Response"
          value="< 15 Mins"
          change="Optimal"
          icon="⏱️"
          color="purple"
        />
      </div>

      {/* Quick Action Cards & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-cyan-400" /> Support Tools & Shortcuts
            </h3>
            <Link
              href="/support/tickets"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm font-semibold"
            >
              <span className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-cyan-400" /> Ticket Queue
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/support/user-lookup"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm font-semibold"
            >
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4 text-emerald-400" /> Account Lookup
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/support/kb"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 transition-colors text-sm font-semibold"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" /> Knowledge Base
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚡</span> Support & System Activity Log
          </h3>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
