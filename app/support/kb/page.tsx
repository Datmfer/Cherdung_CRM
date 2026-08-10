"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { BookOpen, Search, HelpCircle, Key, Shield, CreditCard } from "lucide-react";

interface KBArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  icon: string;
}

const articles: KBArticle[] = [
  { id: "1", category: "Authentication", title: "How to Help Users Reset Passwords", summary: "Direct users to /reset-password or initiate request-reset on their behalf.", icon: "🔑" },
  { id: "2", category: "Security", title: "Configuring & Troubleshooting 2FA", summary: "Guide users through scanning the QR code in Google Authenticator or Authy.", icon: "🛡️" },
  { id: "3", category: "Verification", title: "Resending Email Verification Links", summary: "Explain email verification token expiration window (24h) and trigger re-send.", icon: "✉️" },
  { id: "4", category: "Billing", title: "Managing Subscription Upgrades & Stripe", summary: "Assisting clients with checkout sessions and plan changes.", icon: "💳" },
];

export default function SupportKB() {
  const [query, setQuery] = useState("");

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.summary.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Support Knowledge Base
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Standard operating procedures and agent reference guides
        </p>
      </div>

      <Card>
        <div className="relative">
          <Input
            placeholder="Search articles by keyword or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((art) => (
          <Card key={art.id} className="border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <span className="text-3xl p-3 bg-slate-900 rounded-xl border border-slate-700/50">{art.icon}</span>
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{art.category}</span>
                <h3 className="text-lg font-bold text-white">{art.title}</h3>
                <p className="text-sm text-slate-400">{art.summary}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
