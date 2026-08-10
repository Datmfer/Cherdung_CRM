"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { TrendingUp, Check, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

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
    <div className="p-8 space-y-8">
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
                      <span className="text-2xl font-extrabold text-emerald-400">${plan.price}</span>
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
                      : `Subscribe for $${plan.price}`}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
