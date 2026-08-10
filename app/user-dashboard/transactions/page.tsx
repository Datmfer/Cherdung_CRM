"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";

interface Transaction {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "PROFIT_PAYOUT";
  amount: number;
  date: string;
  status: "COMPLETED" | "PENDING";
}

const transactions: Transaction[] = [
  { id: "TXN-901", type: "PROFIT_PAYOUT", amount: 1240, date: new Date().toLocaleDateString(), status: "COMPLETED" },
  { id: "TXN-902", type: "DEPOSIT", amount: 5000, date: "2024-01-20", status: "COMPLETED" },
  { id: "TXN-903", type: "WITHDRAWAL", amount: 500, date: "2024-01-18", status: "COMPLETED" },
  { id: "TXN-904", type: "PROFIT_PAYOUT", amount: 340, date: "2024-01-15", status: "COMPLETED" },
];

export default function UserTransactions() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transactions & Ledger
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Complete history of your account deposits, profit distributions, and withdrawals
        </p>
      </div>

      <div className="space-y-4">
        {transactions.map((txn) => (
          <Card key={txn.id} className="border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    txn.type === "WITHDRAWAL"
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {txn.type === "WITHDRAWAL" ? (
                    <ArrowDownRight className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {txn.type.replace(/_/g, " ")}
                    <span className="font-mono text-xs text-slate-400 font-normal">({txn.id})</span>
                  </h3>
                  <p className="text-xs text-slate-400">{txn.date}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    txn.type === "WITHDRAWAL" ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {txn.type === "WITHDRAWAL" ? "-" : "+"}NPR {txn.amount.toLocaleString()}
                </p>
                <Badge variant="success">Completed</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
