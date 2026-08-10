"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { FileText, Download, ShieldCheck } from "lucide-react";

export default function UserDocuments() {
  const documents = [
    { title: "Terms of Service Agreement", date: "Jan 15, 2024", size: "245 KB" },
    { title: "Privacy & Data Protection Policy", date: "Jan 15, 2024", size: "180 KB" },
    { title: "Annual Tax Statement & Summary", date: "Dec 31, 2023", size: "520 KB" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Client Documents & Disclosures
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Access your legal agreements, tax statements, and account disclosures
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc, idx) => (
          <Card key={idx} className="border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{doc.title}</h3>
                  <p className="text-xs text-slate-400">Issued: {doc.date} • {doc.size}</p>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading ${doc.title}...`)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-indigo-400" /> Download PDF
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
