"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import SimpleChart from "@/components/dashboard/SimpleChart";
import StatCard from "@/components/dashboard/StatCard";
import { Users, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  verificationRate: number;
  roles: {
    admin: number;
    support: number;
    user: number;
  };
  totalPlans: number;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const result = await res.json();
        setData(result.metrics);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Platform Analytics & Metrics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Real-time metrics computed directly from your Prisma Database
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading database analytics...</div>
      ) : !data ? (
        <Card className="text-center py-12">Failed to load analytics.</Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Database Users"
              value={data.totalUsers.toString()}
              change="Total Registered"
              icon="👥"
              color="indigo"
            />
            <StatCard
              title="Verified Email Accounts"
              value={data.verifiedUsers.toString()}
              change={`${data.verificationRate}% Verified`}
              icon="✅"
              color="green"
            />
            <StatCard
              title="Unverified Signups"
              value={data.unverifiedUsers.toString()}
              change="Pending Verification"
              icon="⏳"
              color="purple"
            />
            <StatCard
              title="Active Investment Tiers"
              value={data.totalPlans.toString()}
              change="Configured Plans"
              icon="💰"
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">User Roles Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                  <span className="font-semibold text-purple-400">Administrators</span>
                  <span className="font-bold text-white">{data.roles.admin} Users</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                  <span className="font-semibold text-blue-400">Support Agents</span>
                  <span className="font-bold text-white">{data.roles.support} Users</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                  <span className="font-semibold text-emerald-400">Regular Clients</span>
                  <span className="font-bold text-white">{data.roles.user} Users</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-white mb-4">Verification Ratio</h3>
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-extrabold text-emerald-400">{data.verificationRate}%</div>
                  <p className="text-slate-400 text-sm">of registered accounts have verified emails</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
