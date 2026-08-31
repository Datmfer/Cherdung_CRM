"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import SimpleChart from "@/components/dashboard/SimpleChart";
import StatCard from "@/components/dashboard/StatCard";
import AssetPerformanceCard from "@/components/dashboard/AssetPerformanceCard";
import SocialShare from "@/components/ui/SocialShare";
import { TrendingUp, PieChart, Wallet, Layers } from "lucide-react";

export default function UserPortfolio() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/user/portfolio")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.metrics);
      })
      .catch((err) => console.error("Error fetching portfolio:", err));
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Portfolio & Asset Growth
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed analytics on your active investments, profit distributions, and asset allocations
          </p>
        </div>
        <SocialShare 
          title="My Investment Portfolio"
          text="Tracking my portfolio & asset growth on this CRM platform!"
          variant="inline"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Net Worth"
          value={data ? `NPR ${data.totalPortfolioValue.toLocaleString()}` : "NPR 0"}
          change={data ? `+${data.lifetimeReturnPct}% All-Time` : "0.0% All-Time"}
          icon="💼"
          color="emerald"
        />
        <StatCard
          title="Total Invested Capital"
          value={data ? `NPR ${data.totalInvested.toLocaleString()}` : "NPR 0"}
          change="Lifetime Contributions"
          icon="🏦"
          color="purple"
        />
        <StatCard
          title="Monthly ROI Rate"
          value={data ? `${data.monthlyReturnPct}%` : "0.0%"}
          change="Average Monthly Gain"
          icon="📈"
          color="indigo"
        />
        <StatCard
          title="Total Dividends Paid"
          value={data ? `NPR ${data.totalEarnings.toLocaleString()}` : "NPR 0"}
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
          <h3 className="text-lg font-bold text-white mb-4">Asset Allocation Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
              <span className="font-semibold text-emerald-400">Growth Plan Holdings</span>
              <span className="font-bold text-white">65% (NPR 81,542)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
              <span className="font-semibold text-indigo-400">Professional Tier</span>
              <span className="font-bold text-white">25% (NPR 31,362)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
              <span className="font-semibold text-blue-400">Liquid Cash Balance</span>
              <span className="font-bold text-white">10% (NPR 12,546)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Individual Asset Performance & ROI Breakdowns Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" /> Individual Asset Performance & ROI Breakdowns
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Historical valuation graphs and individual yield rates per asset tier
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AssetPerformanceCard
            name="Growth Plan Holdings"
            allocationShare={65}
            currentValue="NPR 81,542"
            investedAmount="NPR 69,000"
            gainLoss="+NPR 12,542"
            roi="+18.2%"
            isPositive={true}
            trendData={[50000, 54000, 58000, 62000, 70000, 75000, 81542]}
            chartColor="green"
            isActive={true}
            riskTier="Growth Equity"
            payoutInterval="Monthly Dividend"
          />

          <AssetPerformanceCard
            name="Professional Tier"
            allocationShare={25}
            currentValue="NPR 31,362"
            investedAmount="NPR 28,110"
            gainLoss="+NPR 3,252"
            roi="+11.5%"
            isPositive={true}
            trendData={[20000, 22000, 24000, 26000, 28000, 29500, 31362]}
            chartColor="indigo"
            isActive={true}
            riskTier="Fixed Yield"
            payoutInterval="Bi-Weekly Distribution"
          />

          <AssetPerformanceCard
            name="Liquid Cash Reserve"
            allocationShare={10}
            currentValue="NPR 12,546"
            investedAmount="NPR 10,000"
            gainLoss="+NPR 2,546"
            roi="+4.1%"
            isPositive={true}
            trendData={[10000, 10200, 10800, 11400, 11900, 12200, 12546]}
            chartColor="blue"
            isActive={true}
            riskTier="Low Risk Reserve"
            payoutInterval="Instant Access"
          />
        </div>
      </div>
    </div>
  );
}
