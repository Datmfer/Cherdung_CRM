"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Shield, Key, Mail, Database, CheckCircle, Save } from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          System & Platform Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure application security policies, email gateways, and database settings
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle className="h-5 w-5" /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-400" /> Authentication & Security Policies
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Require Email Verification on Signup</p>
                <p className="text-xs text-slate-400">Users must confirm their email address before accessing features</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-white">Enforce Two-Factor Authentication (2FA) for Admins</p>
                <p className="text-xs text-slate-400">Mandate TOTP authenticator app on all Admin logins</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-white">API Rate Limiting (10 requests/min)</p>
                <p className="text-xs text-slate-400">Protect authentication endpoints against brute force attacks</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 cursor-pointer" />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" /> Email Gateway Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="SMTP Host" defaultValue="smtp.mailtrap.io" />
            <Input label="SMTP Port" defaultValue="2525" />
            <Input label="From Email Address" defaultValue="noreply@cherdung.com" />
            <Input label="Environment" defaultValue="Development / Console Fallback" disabled />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-400" /> Database & ORM Engine
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="ORM Provider" defaultValue="Prisma ORM (v6.19)" disabled />
            <Input label="Database Connection" defaultValue="SQLite (dev.db)" disabled />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
