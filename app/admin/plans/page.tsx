import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface InvestmentPlan {
  id: string;
  name: string;
  minInvestment: number;
  maxInvestment: number;
  roi: string;
  duration: string;
  activeUsers: number;
  status: "active" | "inactive";
}

const plans: InvestmentPlan[] = [
  {
    id: "1",
    name: "Starter Plan",
    minInvestment: 100,
    maxInvestment: 1000,
    roi: "5%",
    duration: "30 days",
    activeUsers: 234,
    status: "active",
  },
  {
    id: "2",
    name: "Growth Plan",
    minInvestment: 1000,
    maxInvestment: 10000,
    roi: "8%",
    duration: "60 days",
    activeUsers: 567,
    status: "active",
  },
  {
    id: "3",
    name: "Premium Plan",
    minInvestment: 10000,
    maxInvestment: 50000,
    roi: "12%",
    duration: "90 days",
    activeUsers: 123,
    status: "active",
  },
  {
    id: "4",
    name: "VIP Plan",
    minInvestment: 50000,
    maxInvestment: 500000,
    roi: "15%",
    duration: "180 days",
    activeUsers: 45,
    status: "active",
  },
  {
    id: "5",
    name: "Legacy Plan",
    minInvestment: 50,
    maxInvestment: 500,
    roi: "3%",
    duration: "15 days",
    activeUsers: 0,
    status: "inactive",
  },
];

export default function AdminPlans() {
  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Investment Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage investment plans and their parameters
          </p>
        </div>
        <Button variant="primary">Create New Plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <Badge
                  variant={plan.status === "active" ? "success" : "default"}
                  className="mt-2"
                >
                  {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Min Investment
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  NPR {plan.minInvestment}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Max Investment
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  NPR {plan.maxInvestment}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">ROI</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {plan.roi}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Duration
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {plan.duration}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Active Users
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {plan.activeUsers}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="flex-1">
                Edit
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
