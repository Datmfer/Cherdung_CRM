"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { Plus, Trash2, Check, AlertCircle, Pencil, X } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New plan form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [interval, setInterval] = useState("monthly");
  const [featureInput, setFeatureInput] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit plan form state
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editInterval, setEditInterval] = useState("monthly");
  const [editFeatureInput, setEditFeatureInput] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setError("");

    try {
      const featuresArray = featureInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          interval,
          features: featuresArray.length > 0 ? featuresArray : ["Standard Features Included"],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create plan");

      setName("");
      setPrice("");
      setFeatureInput("");
      setShowModal(false);
      fetchPlans();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setEditName(plan.name);
    setEditPrice(plan.price.toString());
    setEditInterval(plan.interval);
    setEditFeatureInput(Array.isArray(plan.features) ? plan.features.join(", ") : "");
    setEditError("");
  };

  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    setEditLoading(true);
    setEditError("");

    try {
      const featuresArray = editFeatureInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/plans/${editingPlan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          price: parseFloat(editPrice),
          interval: editInterval,
          features: featuresArray,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update plan");

      setEditingPlan(null);
      fetchPlans();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPlans();
      } else {
        alert("Failed to delete plan");
      }
    } catch (err) {
      alert("Failed to delete plan");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Investment Plans Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure subscription tiers, pricing, and features stored in Prisma DB
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create New Plan
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading investment plans...</div>
      ) : plans.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-400 mb-4">No investment plans configured yet.</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Create First Plan
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-all border border-slate-700/50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <Badge variant="success" className="mt-2">
                      Active Tier
                    </Badge>
                  </div>
                  <span className="text-2xl font-extrabold text-indigo-400">
                    ${plan.price}
                    <span className="text-xs text-slate-400 font-normal"> / {plan.interval}</span>
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Included Features:</p>
                  {Array.isArray(plan.features) && plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => openEditModal(plan)} className="flex items-center gap-1.5 text-xs">
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeletePlan(plan.id)} className="flex items-center gap-1.5 text-xs">
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Create Investment Plan</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <Input
                label="Plan Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Executive Growth Tier"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="99.00"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Billing Interval</label>
                  <select
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Features (comma-separated)
                </label>
                <textarea
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="24/7 Priority Support, Unlimited Usage, Custom Analytics"
                  className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? "Creating..." : "Save Plan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Pencil className="h-5 w-5 text-indigo-400" /> Edit Investment Plan
              </h3>
              <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {editError}
              </div>
            )}

            <form onSubmit={handleEditPlan} className="space-y-4">
              <Input
                label="Plan Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Billing Interval</label>
                  <select
                    value={editInterval}
                    onChange={(e) => setEditInterval(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Features (comma-separated)
                </label>
                <textarea
                  value={editFeatureInput}
                  onChange={(e) => setEditFeatureInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="secondary" onClick={() => setEditingPlan(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Updating..." : "Update Plan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

