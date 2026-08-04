import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Investment {
  id: string;
  planName: string;
  amount: number;
  roi: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "pending";
  profit: number;
  progress: number;
}

const investments: Investment[] = [
  {
    id: "1",
    planName: "Growth Plan",
    amount: 5000,
    roi: "8%",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    status: "active",
    profit: 400,
    progress: 45,
  },
  {
    id: "2",
    planName: "Premium Plan",
    amount: 15000,
    roi: "12%",
    startDate: "2023-12-01",
    endDate: "2024-03-01",
    status: "active",
    profit: 1800,
    progress: 75,
  },
  {
    id: "3",
    planName: "Starter Plan",
    amount: 500,
    roi: "5%",
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    status: "completed",
    profit: 25,
    progress: 100,
  },
  {
    id: "4",
    planName: "VIP Plan",
    amount: 50000,
    roi: "15%",
    startDate: "2024-02-01",
    endDate: "2024-08-01",
    status: "pending",
    profit: 0,
    progress: 0,
  },
];

export default function UserInvestments() {
  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Investments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your investment portfolio
          </p>
        </div>
        <Button variant="primary">New Investment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Invested
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            NPR 70,500
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Profit
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            NPR 2,225
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Active Plans
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
        </Card>
      </div>

      <div className="space-y-6">
        {investments.map((investment) => (
          <Card key={investment.id}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {investment.planName}
                  </h3>
                  <Badge
                    variant={
                      investment.status === "active"
                        ? "success"
                        : investment.status === "completed"
                          ? "info"
                          : "warning"
                    }
                  >
                    {investment.status.charAt(0).toUpperCase() +
                      investment.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Invested Amount
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      NPR {investment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expected ROI
                    </p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {investment.roi}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current Profit
                    </p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      NPR {investment.profit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      End Date
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {investment.endDate}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {investment.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${investment.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary">Details</Button>
                {investment.status === "active" && (
                  <Button variant="danger">Withdraw</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
