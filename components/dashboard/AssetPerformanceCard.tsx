"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SimpleChart from "@/components/dashboard/SimpleChart";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Shield, Zap } from "lucide-react";

export interface AssetPerformanceCardProps {
  name: string;
  allocationShare?: number; // e.g. 65 for 65%
  currentValue: string;
  investedAmount: string;
  gainLoss: string;
  roi: string;
  isPositive?: boolean;
  trendData: number[];
  chartColor?: "indigo" | "green" | "blue" | "purple";
  isActive?: boolean;
  riskTier?: string;
  payoutInterval?: string;
}

export default function AssetPerformanceCard({
  name,
  allocationShare,
  currentValue,
  investedAmount,
  gainLoss,
  roi,
  isPositive = true,
  trendData,
  chartColor = "green",
  isActive = true,
  riskTier = "Balanced Growth",
  payoutInterval = "Monthly Payout",
}: AssetPerformanceCardProps) {
  return (
    <Card className="border border-slate-700/60 hover:border-slate-600 transition-all duration-200 shadow-lg bg-slate-800/80">
      <div className="flex flex-col h-full justify-between space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{name}</h3>
              {isActive && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                </span>
              )}
            </div>
            {allocationShare !== undefined && (
              <Badge variant="default" className="bg-slate-700 text-slate-200">
                {allocationShare}% Portfolio
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            <span>{riskTier}</span>
            <span>•</span>
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>{payoutInterval}</span>
          </div>
        </div>

        {/* Financial Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-900/70 rounded-xl border border-slate-700/40">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Current Value</span>
            <span className="text-base font-bold text-white">{currentValue}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Invested</span>
            <span className="text-base font-semibold text-slate-300">{investedAmount}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Total Profit</span>
            <span className={`text-base font-semibold flex items-center gap-0.5 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
              {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {gainLoss}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Asset ROI</span>
            <span className={`text-base font-extrabold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
              {roi}
            </span>
          </div>
        </div>

        {/* Mini Performance Trend Graph */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Performance Trend
            </span>
            <span className="text-[11px] text-slate-400">Historical Valuations</span>
          </div>
          <SimpleChart data={trendData} color={chartColor} label="" />
        </div>
      </div>
    </Card>
  );
}
