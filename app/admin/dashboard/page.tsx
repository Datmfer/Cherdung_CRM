"use client";

import React from 'react';
import Link from 'next/link';
import StatCard from "@/components/dashboard/StatCard";
import SimpleChart from "@/components/dashboard/SimpleChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { useAuth } from '@/contexts/AuthContext';
import { Users, Shield, ArrowRight, Server, FileSpreadsheet } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 border border-purple-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20">
            <Shield className="h-3.5 w-3.5" /> SYSTEM ADMINISTRATION CONSOLE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Admin Overview & Control
          </h1>
          <p className="text-slate-400 text-sm">
            Welcome back, <span className="text-purple-300 font-semibold">{user?.name || 'Administrator'}</span>. Managing platform security, database, and accounts.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20"
          >
            <Users className="h-4 w-4" /> Manage All Users <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="/api/admin/users?format=csv"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Export User CSV
          </a>
        </div>
      </div>

      {/* Platform Stat Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/users" className="block transition-transform hover:scale-[1.02]">
          <div className="p-6 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Total Registered Users</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-2xl font-bold text-white">User Directory</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              Click to view, filter & edit users →
            </div>
          </div>
        </Link>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Active Subscriptions</span>
            <span className="text-2xl">💳</span>
          </div>
          <div className="text-2xl font-bold text-white">3 Plans Active</div>
          <div className="text-xs text-emerald-400 mt-1">+15% vs last month</div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Database Engine</span>
            <span className="text-2xl">🗄️</span>
          </div>
          <div className="text-2xl font-bold text-white">Prisma DB (SQLite)</div>
          <div className="text-xs text-blue-400 mt-1">Status: Operational</div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">System Security</span>
            <span className="text-2xl">🔒</span>
          </div>
          <div className="text-2xl font-bold text-white">JWT + 2FA Active</div>
          <div className="text-xs text-amber-400 mt-1">Rate limiting enforced</div>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📈</span> Platform Revenue Growth
          </h3>
          <SimpleChart
            data={[65, 72, 68, 85, 92, 88, 95, 102, 98, 110, 115, 120]}
            color="indigo"
            label="System revenue trends"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>👤</span> New Registrations Trend
          </h3>
          <SimpleChart
            data={[45, 52, 38, 65, 72, 58, 82, 75, 90, 85, 95, 88]}
            color="green"
            label="User acquisition"
          />
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>⚡</span> Real-time System Audit Feed
          </h3>
          <Link href="/admin/users" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
            Manage User Roles & Permissions →
          </Link>
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
