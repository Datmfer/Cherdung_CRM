"use client";

import React from "react";
import Card from "@/components/ui/Card";
import SimpleChart from "@/components/dashboard/SimpleChart";
import StatCard from "@/components/dashboard/StatCard";
import { TrendingUp, PieChart, Wallet } from "lucide-react";

export default function UserPortfolio() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Portfolio & Asset Growth
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Detailed analytics on your active investments, profit distributions, and asset allocations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Net Worth"
          value="NPR 125,450"
          change="+14.5% All-Time"
          icon="💼"
          color="emerald"
        />
        <StatCard
          title="Monthly ROI Rate"
          value="12.4%"
          change="Average Monthly Gain"
          icon="📈"
          color="indigo"
        />
        <StatCard
          title="Total Dividends Paid"
          value="NPR 18,340"
          change="Paid to Wallet"
          icon="💵"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Historical Valuation Performance</h3>
            <SimpleChart
              data={[10000, 10500, 11200, 10800, 11500, 12100, 11800, 12450, 12800]}
              color="green"
              label="Portfolio valuation growth"
            />
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Asset Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
              <span className="font-semibold text-emerald-400">Growth Plan Holdings</span>
              <span className="font-bold text-white">65%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
              <span className="font-semibold text-indigo-400">Professional Tier</span>
              <span className="font-bold text-white">25%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
              <span className="font-semibold text-blue-400">Liquid Cash Balance</span>
              <span className="font-bold text-white">10%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
