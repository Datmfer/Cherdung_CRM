"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StatCard from "@/components/dashboard/StatCard";
import SimpleChart from "@/components/dashboard/SimpleChart";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from '@/contexts/AuthContext';
import { Wallet, TrendingUp, ShieldCheck, User, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PortfolioData {
  totalPortfolioValue: number;
  totalInvested: number;
  totalEarnings: number;
  totalWithdrawals: number;
  lifetimeReturnPct: string;
  monthlyReturnPct: string;
  activePlansCount: number;
  activePlanTier: string;
  emailVerified: boolean;
  totpEnabled: boolean;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/portfolio");
      if (res.ok) {
        const json = await res.json();
        setData(json.metrics);
        setRecentTransactions(json.transactions || []);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio data:", err);
    } finally {
      setLoading(false);
    }
  };

  const isVerified = data?.emailVerified ?? Boolean(user?.emailVerified);
  const is2faOn = data?.totpEnabled ?? Boolean(user?.totpEnabled);

  return (
    <div className="p-8 space-y-8 bg-slate-900 text-white min-h-screen">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-slate-800 to-emerald-900/40 border border-indigo-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Wallet className="h-3.5 w-3.5" /> PERSONAL CLIENT PORTFOLIO
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.name || 'Valued Client'}!
          </h1>
          <p className="text-slate-400 text-sm">
            Here is your personal investment summary and account status.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/user-dashboard/upgrade"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20"
          >
            <TrendingUp className="h-4 w-4" /> Explore Investment Plans
          </Link>
          <Link
            href="/user-dashboard/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            <User className="h-4 w-4" /> Edit Profile & Avatar
          </Link>
        </div>
      </div>

      {/* Account Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Portfolio Value"
          value={data ? `NPR ${data.totalPortfolioValue.toLocaleString()}` : "NPR 0"}
          change={data ? `+${data.lifetimeReturnPct}% lifetime` : "0.0% lifetime"}
          icon="💰"
          color="emerald"
        />
        <StatCard
          title="Total Invested"
          value={data ? `NPR ${data.totalInvested.toLocaleString()}` : "NPR 0"}
          change="Principal Invested"
          icon="🏦"
          color="purple"
        />
        <StatCard
          title="Active Plans"
          value={data ? `${data.activePlansCount} Active` : "0 Active"}
          change={data ? data.activePlanTier : "No Active Plan"}
          icon="📈"
          color="indigo"
        />
        <StatCard
          title="Total Earnings"
          value={data ? `NPR ${data.totalEarnings.toLocaleString()}` : "NPR 0"}
          change={data ? `+${data.monthlyReturnPct}% this month` : "0.0% this month"}
          icon="💵"
          color="blue"
        />
        <StatCard
          title="Verification Status"
          value={isVerified ? "Verified" : "Unverified"}
          change={is2faOn ? "2FA Protection On" : "2FA Off"}
          icon="🛡️"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📈</span> Portfolio Growth History
          </h3>
          <SimpleChart
            data={[10000, 10500, 11200, 10800, 11500, 12100, 11800, 12450, 12800]}
            color="green"
            label="Portfolio valuation trend"
          />
        </div>

        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>⚡</span> Quick Account Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/user-dashboard/upgrade"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm transition-colors text-white"
            >
              <TrendingUp className="h-4 w-4" /> Upgrade Plan
            </Link>
            <Link
              href="/user-dashboard/profile"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold text-sm transition-colors text-white"
            >
              <ShieldCheck className="h-4 w-4" /> Security & 2FA
            </Link>
            <Link
              href="/contact"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold text-sm transition-colors text-white"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Personal Transactions & Plan Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">My Subscribed Plans</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/40">
              <div>
                <p className="font-bold text-white">{data?.activePlanTier || "Professional Investment Tier"}</p>
                <p className="text-xs text-slate-400">Renews Monthly • Active</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-emerald-400">Active Tier</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Portfolio Activity</h3>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 3).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/40">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${txn.type === "WITHDRAWAL" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                      {txn.type === "WITHDRAWAL" ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{txn.type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-slate-400">{txn.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${txn.type === "WITHDRAWAL" ? "text-rose-400" : "text-emerald-400"}`}>
                    {txn.type === "WITHDRAWAL" ? "-" : "+"}NPR {txn.amount.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Monthly Profit Distribution</p>
                    <p className="text-xs text-slate-400">Automated Payout</p>
                  </div>
                </div>
                <p className="font-bold text-emerald-400">+NPR 1,240</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
