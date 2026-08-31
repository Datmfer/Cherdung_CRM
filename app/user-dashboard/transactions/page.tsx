"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/dashboard/StatCard";
import { ArrowUpRight, ArrowDownRight, PlusCircle, ArrowDownLeft, X, Filter, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Transaction {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "PROFIT_PAYOUT";
  amount: number;
  date: string;
  status: "COMPLETED" | "PENDING";
}

function TransactionsContent() {
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"DEPOSIT" | "WITHDRAWAL">("DEPOSIT");
  const [amountInput, setAmountInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isKhaltiLoading, setIsKhaltiLoading] = useState(false);

  // Payment Feedback Toast State
  const [paymentToast, setPaymentToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchData();

    // Check payment URL query parameters
    const payment = searchParams.get("payment");
    const amount = searchParams.get("amount");

    if (payment === "success") {
      setPaymentToast({
        type: "success",
        message: `Khalti Payment Successful! NPR ${Number(amount || 0).toLocaleString()} has been added to your portfolio balance.`,
      });
      setTimeout(() => setPaymentToast(null), 8000);
    } else if (payment === "failed" || payment === "error") {
      setPaymentToast({
        type: "error",
        message: "Khalti payment was not completed or failed verification.",
      });
      setTimeout(() => setPaymentToast(null), 8000);
    }
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/portfolio");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Error loading portfolio transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: "DEPOSIT" | "WITHDRAWAL") => {
    setModalType(type);
    setAmountInput("");
    setShowModal(true);
  };

  const handleKhaltiDeposit = async () => {
    const numAmount = Number(amountInput);
    if (!numAmount || numAmount <= 0) {
      alert("Please enter a valid positive amount in NPR");
      return;
    }

    setIsKhaltiLoading(true);
    try {
      const res = await fetch("/api/khalti/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          purchase_order_id: `DEP-${Date.now()}`,
          purchase_order_name: "Cherdung CRM Capital Deposit",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Khalti initialization failed");

      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (err: any) {
      alert(err.message || "Failed to start Khalti payment");
    } finally {
      setIsKhaltiLoading(false);
    }
  };

  const handleNewTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amountInput);
    if (!numAmount || numAmount <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: modalType,
          amount: numAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transaction failed");

      setShowModal(false);
      setAmountInput("");
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to process transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (activeFilter === "ALL") return true;
    return t.type === activeFilter;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Payment Toast Notification */}
      {paymentToast && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            paymentToast.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/80 border-red-500/40 text-red-300"
          } shadow-xl animate-fade-in`}
        >
          {paymentToast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{paymentToast.message}</span>
        </div>
      )}

      {/* Header with Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transactions & Ledger
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete history of your account deposits, profit distributions, and withdrawals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleOpenModal("DEPOSIT")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/20"
          >
            <PlusCircle className="h-4 w-4" /> Deposit Capital
          </Button>
          <Button
            onClick={() => handleOpenModal("WITHDRAWAL")}
            variant="secondary"
            className="flex items-center gap-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl"
          >
            <ArrowDownLeft className="h-4 w-4 text-rose-400" /> Request Withdrawal
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Capital Deposited"
          value={metrics ? `NPR ${metrics.totalInvested.toLocaleString()}` : "NPR 0"}
          change="Completed Lifetime Deposits"
          icon="📥"
          color="emerald"
        />
        <StatCard
          title="Total Dividends Received"
          value={metrics ? `NPR ${metrics.totalEarnings.toLocaleString()}` : "NPR 0"}
          change="Paid Out to Wallet"
          icon="💸"
          color="blue"
        />
        <StatCard
          title="Total Withdrawals"
          value={metrics ? `NPR ${metrics.totalWithdrawals.toLocaleString()}` : "NPR 0"}
          change="Completed Payouts"
          icon="📤"
          color="purple"
        />
      </div>

      {/* Ledger Section */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="h-4 w-4 text-slate-400 mr-1" />
            {["ALL", "DEPOSIT", "PROFIT_PAYOUT", "WITHDRAWAL"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {filter === "ALL"
                  ? "All Types"
                  : filter === "DEPOSIT"
                  ? "Deposits"
                  : filter === "PROFIT_PAYOUT"
                  ? "Dividends"
                  : "Withdrawals"}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Loading transaction history...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                      {t.id.substring(0, 8)}...
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-2 font-semibold text-slate-200">
                        {t.type === "DEPOSIT" && <ArrowUpRight className="h-4 w-4 text-emerald-400" />}
                        {t.type === "PROFIT_PAYOUT" && <ArrowUpRight className="h-4 w-4 text-blue-400" />}
                        {t.type === "WITHDRAWAL" && <ArrowDownRight className="h-4 w-4 text-rose-400" />}
                        {t.type === "DEPOSIT" ? "Deposit" : t.type === "PROFIT_PAYOUT" ? "Dividend Payout" : "Withdrawal"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{t.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      NPR {t.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge variant={t.status === "COMPLETED" ? "success" : "warning"}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Modal (with Khalti Gateway) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {modalType === "DEPOSIT" ? "Deposit Capital" : "Request Withdrawal"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Amount (NPR)
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder="Enter amount in NPR (e.g. 5000)"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {modalType === "WITHDRAWAL" && metrics && (
                <p className="text-xs text-slate-400 bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                  Available Portfolio Balance: <span className="font-bold text-emerald-400">NPR {metrics.totalPortfolioValue.toLocaleString()}</span>
                </p>
              )}

              {modalType === "DEPOSIT" && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select Payment Method:
                  </p>

                  {/* KHALTI PAYMENT BUTTON */}
                  <button
                    type="button"
                    onClick={handleKhaltiDeposit}
                    disabled={isKhaltiLoading || isSubmitting}
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-[#5c2d91] hover:bg-[#4a2475] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-purple-900/30 transition-all border border-purple-400/30 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center font-extrabold text-[#5c2d91] text-xs">
                        K
                      </div>
                      <span>Pay with Khalti 🇳🇵</span>
                    </div>
                    {isKhaltiLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <span className="text-xs font-medium bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-400/30">
                        Instant Wallet
                      </span>
                    )}
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleNewTransaction}
                  disabled={isSubmitting || isKhaltiLoading}
                  className={`w-full font-bold ${
                    modalType === "DEPOSIT"
                      ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                      : "bg-rose-600 hover:bg-rose-500 text-white"
                  }`}
                >
                  {isSubmitting
                    ? "Processing..."
                    : modalType === "DEPOSIT"
                    ? "Manual Deposit"
                    : "Confirm Withdrawal"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserTransactions() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading ledger...</div>}>
      <TransactionsContent />
    </Suspense>
  );
}
