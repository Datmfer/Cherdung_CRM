"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Zap,
  Check,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Crown,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  stripePriceId: string;
}

export default function UpgradePlanPage() {
  return (
    <React.Suspense fallback={<div className="p-10 text-center text-slate-400">Loading plan options...</div>}>
      <UpgradePlanContent />
    </React.Suspense>
  );
}

function UpgradePlanContent() {
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    fetchInvestmentsData();

    if (searchParams.get("status") === "subscription_success") {
      setSuccessMsg("🎉 Congratulations! Your plan upgrade was successful.");
    }
  }, [searchParams]);

  const fetchInvestmentsData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/investments");
      if (res.ok) {
        const data = await res.json();
        setPlans(data.availablePlans || []);
        setSubscription(data.subscription || null);
      }
    } catch (err) {
      console.error("Failed to fetch investment plans:", err);
      setErrorMsg("Failed to load plan details. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (priceId: string, planName: string) => {
    setCheckoutLoading(priceId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upgrade failed");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initiate plan upgrade");
    } finally {
      setCheckoutLoading(null);
    }
  };

  // Static rich fallback plans if database has no seeded plans yet
  const displayPlans =
    plans.length > 0
      ? plans
      : [
          {
            id: "starter",
            name: "Starter Tier",
            price: 49,
            interval: "monthly",
            stripePriceId: "price_starter_mock",
            features: [
              "Up to 5 User Accounts",
              "Basic CRM & Lead Analytics",
              "Standard Email Support",
              "5 GB Secure File Storage",
              "Basic Investment Reports",
            ],
          },
          {
            id: "growth",
            name: "Professional Tier",
            price: 149,
            interval: "monthly",
            stripePriceId: "price_pro_mock",
            features: [
              "Up to 25 User Accounts",
              "Advanced AI-Driven CRM Insights",
              "Priority 24/7 Support Channel",
              "50 GB Secure Cloud Storage",
              "Custom Workflow Automation",
              "Portfolio Tax Optimization",
            ],
          },
          {
            id: "premium",
            name: "Enterprise Tier",
            price: 499,
            interval: "monthly",
            stripePriceId: "price_enterprise_mock",
            features: [
              "Unlimited User Accounts",
              "Dedicated Account Manager & Advisor",
              "Custom REST & Webhook Integrations",
              "Unlimited Secure Storage",
              "Guaranteed 99.99% SLA Uptime",
              "Daily Automated Risk Audits",
            ],
          },
        ];

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/40 p-8 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Account Upgrade Center
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Upgrade Your Investment Plan
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            Scale your financial management with higher return limits, advanced AI analytics, and dedicated support.
          </p>
        </div>

        {/* Current Active Plan Badge */}
        <div className="relative z-10 shrink-0 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Current Plan Status</p>
            <p className="text-sm font-bold text-white flex items-center gap-2">
              {subscription?.stripeStatus === "active" ? (
                <>
                  <span className="text-emerald-400">Subscribed Tier</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </>
              ) : (
                <span className="text-amber-400">Standard Free Account</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Status Notifications ── */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* ── Billing Cycle Toggle ── */}
      <div className="flex justify-center items-center gap-4">
        <span
          className={`text-sm font-medium ${
            billingCycle === "monthly" ? "text-white font-bold" : "text-slate-400"
          }`}
        >
          Monthly Billing
        </span>
        <button
          type="button"
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className="w-14 h-8 flex items-center bg-indigo-950 border border-indigo-500/30 rounded-full p-1 transition-colors cursor-pointer"
        >
          <div
            className={`w-6 h-6 rounded-full bg-indigo-500 shadow-md transform transition-transform ${
              billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium flex items-center gap-1.5 ${
            billingCycle === "yearly" ? "text-white font-bold" : "text-slate-400"
          }`}
        >
          Yearly Billing
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            Save 20%
          </span>
        </span>
      </div>

      {/* ── Plans Grid ── */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Fetching tier upgrade options...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {displayPlans.map((plan, index) => {
            const isCurrentPlan = subscription?.stripePriceId === plan.stripePriceId;
            const isPopular = plan.name.toLowerCase().includes("professional") || index === 1;
            const adjustedPrice =
              billingCycle === "yearly" ? Math.round(plan.price * 0.8) : plan.price;

            return (
              <div
                key={plan.id || plan.stripePriceId}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  isPopular
                    ? "bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-105"
                    : isCurrentPlan
                    ? "bg-slate-900/90 border-2 border-emerald-500/80 shadow-lg shadow-emerald-500/10"
                    : "bg-slate-900/70 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
                      Most Popular Tier
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Tagline */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {plan.name}
                      </h3>
                      {isCurrentPlan && (
                        <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active Plan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="border-b border-slate-800 pb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white">NPR {adjustedPrice}</span>
                      <span className="text-sm text-slate-400 font-medium">/ month</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {billingCycle === "yearly" ? "Billed annually" : "Billed monthly"}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Included Features:
                    </p>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upgrade Action Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-800 space-y-2.5">
                  <button
                    type="button"
                    disabled={isCurrentPlan || checkoutLoading === plan.stripePriceId}
                    onClick={() => handleUpgrade(plan.stripePriceId, plan.name)}
                    className={`w-full py-3 px-5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCurrentPlan
                        ? "bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                        : isPopular
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    {checkoutLoading === plan.stripePriceId
                      ? "Processing..."
                      : isCurrentPlan
                      ? "Current Active Tier"
                      : `Stripe / Card Checkout`}
                  </button>

                  {!isCurrentPlan && (
                    <button
                      type="button"
                      disabled={checkoutLoading === `khalti-${plan.id}`}
                      onClick={async () => {
                        setCheckoutLoading(`khalti-${plan.id}`);
                        try {
                          const res = await fetch("/api/khalti/initiate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              amount: adjustedPrice,
                              purchase_order_id: `PLAN-${plan.id}-${Date.now()}`,
                              purchase_order_name: `Upgrade: ${plan.name}`,
                            }),
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error || "Khalti checkout failed");
                          if (data.payment_url) {
                            window.location.href = data.payment_url;
                          }
                        } catch (err: any) {
                          setErrorMsg(err.message || "Failed to initiate Khalti payment");
                        } finally {
                          setCheckoutLoading(null);
                        }
                      }}
                      className="w-full py-3 px-5 bg-[#5c2d91] hover:bg-[#4a2475] border border-purple-400/30 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-900/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[#5c2d91] text-[10px] font-black">
                        K
                      </div>
                      <span>Pay with Khalti 🇳🇵</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Feature Comparison Table ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">Compare Plan Features</h2>
          <p className="text-sm text-slate-400">Detailed breakdown of capabilities across each investment tier.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-4 px-4 font-semibold">Feature / Capability</th>
                <th className="py-4 px-4 font-semibold text-center">Starter</th>
                <th className="py-4 px-4 font-semibold text-center text-indigo-400">Professional</th>
                <th className="py-4 px-4 font-semibold text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-4 px-4 font-medium text-white">Portfolio Analytics</td>
                <td className="py-4 px-4 text-center">Basic</td>
                <td className="py-4 px-4 text-center text-indigo-400 font-semibold">Advanced AI</td>
                <td className="py-4 px-4 text-center">Custom Predictive</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-white">Support Response Time</td>
                <td className="py-4 px-4 text-center">24 Hours</td>
                <td className="py-4 px-4 text-center text-indigo-400 font-semibold">&lt; 1 Hour</td>
                <td className="py-4 px-4 text-center">Instant 24/7 Hotline</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-white">Dedicated Financial Advisor</td>
                <td className="py-4 px-4 text-center text-slate-600">—</td>
                <td className="py-4 px-4 text-center text-slate-600">—</td>
                <td className="py-4 px-4 text-center text-emerald-400">✔ Included</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-white">Tax & Compliance Optimization</td>
                <td className="py-4 px-4 text-center text-slate-600">—</td>
                <td className="py-4 px-4 text-center text-emerald-400 font-semibold">✔ Included</td>
                <td className="py-4 px-4 text-center text-emerald-400">✔ Full Audit Support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FAQ & Support Help ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
            <HelpCircle className="h-5 w-5" /> Can I change or downgrade plans anytime?
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Yes! You can upgrade, downgrade, or cancel your subscription plan at any time directly from your user dashboard. Changes take effect on the next billing cycle.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
            <ShieldCheck className="h-5 w-5" /> Are payment methods secure?
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            All billing is processed securely through Stripe PCI-compliant encryption. Your payment details are never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
