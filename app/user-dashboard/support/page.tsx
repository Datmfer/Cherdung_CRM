"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MessageSquare, Send, CheckCircle } from "lucide-react";

export default function UserSupport() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setSubject("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Client Help & Support Tickets
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Have a question about your investments or account? Contact our support agents.
        </p>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle className="h-5 w-5" /> Support ticket submitted successfully! A support agent will respond shortly.
        </div>
      )}

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject / Topic"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Question about 2FA setup or billing"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Message Details
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your inquiry in detail..."
              required
              className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              <Send className="h-4 w-4" /> {loading ? "Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
