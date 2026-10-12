"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";

// ─── Color palette ────────────────────────────────────────────────────────────
const PALETTE = {
  indigo:  { stroke: "#818cf8", gradientFrom: "rgba(129,140,248,0.35)", gradientTo: "rgba(129,140,248,0)", dot: "#6366f1" },
  green:   { stroke: "#34d399", gradientFrom: "rgba(52,211,153,0.35)",  gradientTo: "rgba(52,211,153,0)",  dot: "#10b981" },
  blue:    { stroke: "#60a5fa", gradientFrom: "rgba(96,165,250,0.35)",  gradientTo: "rgba(96,165,250,0)",  dot: "#3b82f6" },
  purple:  { stroke: "#c084fc", gradientFrom: "rgba(192,132,252,0.35)", gradientTo: "rgba(192,132,252,0)", dot: "#a855f7" },
  emerald: { stroke: "#34d399", gradientFrom: "rgba(52,211,153,0.30)",  gradientTo: "rgba(52,211,153,0)",  dot: "#10b981" },
} as const;

export type ChartColor = keyof typeof PALETTE;

// ─── Currency Tooltip ─────────────────────────────────────────────────────────
function CurrencyTooltip({
  active,
  payload,
  label,
  prefix = "रू ",
}: {
  active?: boolean;
  payload?: { value: number; name?: string; color?: string }[];
  label?: string;
  prefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl text-sm min-w-[140px]">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold" style={{ color: p.color ?? "#fff" }}>
          {p.name ? <span className="text-slate-300 font-normal">{p.name}: </span> : null}
          {prefix}
          {Number(p.value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
      ))}
    </div>
  );
}

// ─── Growth % Tooltip ─────────────────────────────────────────────────────────
function GrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name?: string; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl text-sm min-w-[160px]">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold" style={{ color: p.color ?? "#fff" }}>
          {p.name ? <span className="text-slate-300 font-normal">{p.name}: </span> : null}
          {p.value >= 0 ? "+" : ""}{Number(p.value).toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

// ─── MiniLineChart (inside AssetPerformanceCard) ──────────────────────────────
export interface MiniLineChartProps {
  data: number[];
  color?: ChartColor;
  labels?: string[];
}

export function MiniLineChart({ data, color = "green", labels }: MiniLineChartProps) {
  const palette = PALETTE[color];
  const gradientId = `mini-gradient-${color}`;
  const chartData = data.map((v, i) => ({ name: labels?.[i] ?? `W${i + 1}`, value: v }));

  return (
    <ResponsiveContainer width="100%" height={96}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.gradientFrom} />
            <stop offset="100%" stopColor={palette.gradientTo} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide domain={["auto", "auto"]} />
        <Tooltip content={<CurrencyTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={palette.stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: palette.dot, stroke: "#1e293b", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── PortfolioLineChart (full-width overview) ─────────────────────────────────
export interface PortfolioDataPoint {
  label: string;
  value: number;
}

export interface PortfolioLineChartProps {
  data: PortfolioDataPoint[];
  color?: ChartColor;
  prefix?: string;
}

export function PortfolioLineChart({ data, color = "emerald", prefix = "रू " }: PortfolioLineChartProps) {
  const palette = PALETTE[color];
  const gradientId = `portfolio-gradient-${color}`;
  const chartData = data.map((d) => ({ name: d.label, value: d.value }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.gradientFrom} />
            <stop offset="100%" stopColor={palette.gradientTo} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${prefix}${Number(v).toLocaleString()}`}
          width={72}
        />
        <Tooltip content={<CurrencyTooltip prefix={prefix} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={palette.stroke}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 5, fill: palette.dot, stroke: "#0f172a", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── HistoricalValuationChart (grouped bar chart) ─────────────────────────────
export interface ValuationDataPoint {
  month: string;
  professional: number;
  growth: number;
  starter: number;
}

const tierLabel = (value: string) =>
  value === "professional" ? "Professional" : value === "growth" ? "Growth" : "Starter";

export function HistoricalValuationChart({ data }: { data: ValuationDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }} barCategoryGap="25%" barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `रू ${Number(v / 1000).toFixed(0)}k`}
          width={60}
        />
        <Tooltip content={<CurrencyTooltip />} />
        <Legend wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#94a3b8" }} formatter={tierLabel} />
        <Bar dataKey="professional" fill="#818cf8" radius={[4, 4, 0, 0]} name="professional" />
        <Bar dataKey="growth"       fill="#34d399" radius={[4, 4, 0, 0]} name="growth" />
        <Bar dataKey="starter"      fill="#c084fc" radius={[4, 4, 0, 0]} name="starter" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── PortfolioGrowthChart (multi-line % growth) ───────────────────────────────
export interface GrowthDataPoint {
  month: string;
  professional: number;
  growth: number;
  starter: number;
}

export function PortfolioGrowthChart({ data }: { data: GrowthDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v >= 0 ? "+" : ""}${v}%`}
          width={52}
        />
        <ReferenceLine y={0} stroke="#334155" strokeDasharray="4 4" />
        <Tooltip content={<GrowthTooltip />} />
        <Legend wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#94a3b8" }} formatter={tierLabel} />
        <Line type="monotone" dataKey="professional" stroke="#818cf8" strokeWidth={2.5} dot={false}
          activeDot={{ r: 5, fill: "#6366f1", stroke: "#0f172a", strokeWidth: 2 }} name="professional" />
        <Line type="monotone" dataKey="growth"       stroke="#34d399" strokeWidth={2.5} dot={false}
          activeDot={{ r: 5, fill: "#10b981", stroke: "#0f172a", strokeWidth: 2 }} name="growth" />
        <Line type="monotone" dataKey="starter"      stroke="#c084fc" strokeWidth={2.5} dot={false}
          activeDot={{ r: 5, fill: "#a855f7", stroke: "#0f172a", strokeWidth: 2 }} name="starter" />
      </LineChart>
    </ResponsiveContainer>
  );
}
