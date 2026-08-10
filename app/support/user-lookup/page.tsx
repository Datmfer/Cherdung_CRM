"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Search, UserCheck, ShieldCheck, Mail, Calendar } from "lucide-react";

interface UserResult {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified?: string | null;
  totpEnabled?: boolean;
  avatarUrl?: string | null;
  createdAt: string;
}

export default function SupportUserLookup() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/support/user-lookup?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Diagnostic User Lookup Tool
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Search registered accounts by name or email to check verification status and security settings
        </p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Enter user name or email (e.g. ram@chd.com)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" /> {loading ? "Searching..." : "Search Account"}
          </button>
        </form>
      </Card>

      {loading ? (
        <div className="text-center py-8 text-slate-400">Searching database...</div>
      ) : searched && users.length === 0 ? (
        <Card className="text-center py-12 text-slate-400">
          No matching user accounts found for "{query}".
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <Card key={u.id} className="border border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {u.name}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
                        {u.role.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3.5 w-3.5" /> {u.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant={u.emailVerified ? "success" : "warning"}>
                    {u.emailVerified ? "Email Verified" : "Unverified Email"}
                  </Badge>
                  <Badge variant={u.totpEnabled ? "success" : "info"}>
                    {u.totpEnabled ? "2FA Enabled" : "2FA Off"}
                  </Badge>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Joined {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
