"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AssetPerformanceCard from "@/components/dashboard/AssetPerformanceCard";
import { PortfolioLineChart, HistoricalValuationChart, PortfolioGrowthChart } from "@/components/dashboard/InvestmentLineChart";
import { TrendingUp, Check, ShieldCheck, CreditCard, ArrowRight, Layers, BarChart2 } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  stripePriceId: string;
}

export default function UserInvestments() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchInvestmentsData();
  }, []);

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
      console.error("Failed to fetch investments data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    setCheckoutLoading(priceId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err.message || "Subscription failed");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Investment Plans & Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Choose an investment tier to maximize returns and unlock premium CRM tools
          </p>
        </div>
      </div>

      {/* Active Subscription Status Banner */}
      {subscription?.stripeStatus === "active" ? (
        <Card className="bg-emerald-500/10 border border-emerald-500/20 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <div>
                <h3 className="font-bold text-emerald-400">Active Investment Tier</h3>
                <p className="text-sm text-slate-300">
                  Subscription ID: {subscription.stripeSubscriptionId || "Active"}
                </p>
              </div>
            </div>
            <Badge variant="success">Active Status</Badge>
          </div>
        </Card>
      ) : null}

      {/* Portfolio Value Over Time */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-emerald-400" />
              Portfolio Value Over Time
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Combined investment portfolio growth — last 12 months
            </p>
          </div>
          <span className="text-emerald-400 text-sm font-semibold">+22.4% YTD</span>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <PortfolioLineChart
            color="emerald"
            prefix="रू "
            data={[
              { label: "Nov", value: 23940 },
              { label: "Dec", value: 25935 },
              { label: "Jan", value: 25004 },
              { label: "Feb", value: 26866 },
              { label: "Mar", value: 28595 },
              { label: "Apr", value: 27930 },
              { label: "May", value: 30324 },
              { label: "Jun", value: 31255 },
              { label: "Jul", value: 32319 },
              { label: "Aug", value: 31654 },
              { label: "Sep", value: 33516 },
              { label: "Oct", value: 34580 },
            ]}
          />
        </div>
      </div>

      {/* Available Plans */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading investment plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = subscription?.stripePriceId === plan.stripePriceId;
            return (
              <Card
                key={plan.id}
                className={`flex flex-col justify-between border ${
                  isCurrentPlan ? "border-emerald-500 bg-slate-800/90" : "border-slate-700/50 hover:border-slate-600"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      {isCurrentPlan && (
                        <Badge variant="success" className="mt-1">
                          Current Active Plan
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-emerald-400">रू {Math.round(plan.price * 133).toLocaleString()}</span>
                      <span className="text-xs text-slate-400 block">/ {plan.interval}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Included Benefits:</p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <Button
                    variant={isCurrentPlan ? "secondary" : "primary"}
                    disabled={isCurrentPlan || checkoutLoading === plan.stripePriceId}
                    onClick={() => handleSubscribe(plan.stripePriceId)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    {checkoutLoading === plan.stripePriceId
                      ? "Processing..."
                      : isCurrentPlan
                      ? "Active Tier"
                      : `Subscribe for रू ${Math.round(plan.price * 133).toLocaleString()}`}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Individual Investment Plan Performance & ROI Analytics */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-emerald-400" /> Plan Performance & Individual ROI Breakdown
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track historical valuations and individual return rates across each available investment tier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AssetPerformanceCard
            name="Professional Tier Plan"
            allocationShare={50}
            currentValue="रू 19,817 / mo"
            investedAmount="रू 19,817"
            gainLoss="+रू 3,777"
            roi="+19.1%"
            isPositive={true}
            trendData={[15960, 16625, 17556, 18620, 18886, 19418, 19817]}
            chartColor="indigo"
            isActive={subscription?.stripeStatus === "active"}
            riskTier="High Growth"
            payoutInterval="Monthly Payout"
          />

          <AssetPerformanceCard
            name="Growth Plan Tier"
            allocationShare={35}
            currentValue="रू 6,517 / mo"
            investedAmount="रू 6,517"
            gainLoss="+रू 825"
            roi="+12.6%"
            isPositive={true}
            trendData={[5320, 5586, 5719, 5985, 6118, 6251, 6517]}
            chartColor="green"
            isActive={false}
            riskTier="Balanced Growth"
            payoutInterval="Monthly Payout"
          />

          <AssetPerformanceCard
            name="Starter Plan Tier"
            allocationShare={15}
            currentValue="रू 2,527 / mo"
            investedAmount="रू 2,527"
            gainLoss="+रू 200"
            roi="+7.8%"
            isPositive={true}
            trendData={[1995, 2128, 2195, 2261, 2394, 2461, 2527]}
            chartColor="purple"
            isActive={false}
            riskTier="Conservative"
            payoutInterval="Monthly Payout"
          />
        </div>
      </div>

      {/* Historical Valuation Performance */}
      <div className="space-y-3 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-400" />
              Historical Valuation Performance
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Month-by-month NPR valuation for each investment tier
            </p>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <HistoricalValuationChart
            data={[
              { month: "Apr", professional: 18620, growth: 5985, starter: 2261 },
              { month: "May", professional: 18886, growth: 6118, starter: 2394 },
              { month: "Jun", professional: 19020, growth: 6200, starter: 2420 },
              { month: "Jul", professional: 19200, growth: 6310, starter: 2450 },
              { month: "Aug", professional: 19418, growth: 6251, starter: 2461 },
              { month: "Sep", professional: 19600, growth: 6400, starter: 2495 },
              { month: "Oct", professional: 19817, growth: 6517, starter: 2527 },
            ]}
          />
        </div>
      </div>

      {/* Portfolio Growth History */}
      <div className="space-y-3 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Portfolio Growth History
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Cumulative % growth per tier — last 7 months
            </p>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <PortfolioGrowthChart
            data={[
              { month: "Apr", professional: 0,   growth: 0,    starter: 0    },
              { month: "May", professional: 1.4,  growth: 2.2,  starter: 5.9  },
              { month: "Jun", professional: 2.2,  growth: 3.6,  starter: 7.0  },
              { month: "Jul", professional: 3.1,  growth: 5.4,  starter: 8.4  },
              { month: "Aug", professional: 4.3,  growth: 4.4,  starter: 8.8  },
              { month: "Sep", professional: 5.3,  growth: 6.9,  starter: 10.4 },
              { month: "Oct", professional: 6.4,  growth: 8.9,  starter: 11.8 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
