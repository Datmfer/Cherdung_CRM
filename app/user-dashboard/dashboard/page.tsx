import StatCard from "@/components/dashboard/StatCard";
import SimpleChart from "@/components/dashboard/SimpleChart";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function UserDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's your investment overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Balance"
          value="NPR 12,450"
          change="+8.5%"
          icon="💰"
          color="indigo"
        />
        <StatCard
          title="Active Investments"
          value="3"
          change="+1"
          icon="📈"
          color="green"
        />
        <StatCard
          title="Total Profit"
          value="NPR 2,340"
          change="+12.3%"
          icon="💵"
          color="blue"
        />
        <StatCard
          title="Pending Withdrawals"
          value="NPR 500"
          change="0%"
          icon="⏳"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Portfolio Performance
            </h3>
            <SimpleChart
              data={[10000, 10500, 11200, 10800, 11500, 12100, 11800, 12450]}
              color="green"
              label="Portfolio value over time"
            />
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button variant="primary" className="w-full">
              New Investment
            </Button>
            <Button variant="secondary" className="w-full">
              Withdraw Funds
            </Button>
            <Button variant="secondary" className="w-full">
              View Statements
            </Button>
            <Button variant="secondary" className="w-full">
              Contact Support
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Investments
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111827] rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Growth Plan
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Started: Jan 15, 2024
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  NPR 5,000
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +12.5%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111827] rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Premium Plan
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Started: Dec 1, 2023
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  NPR 7,450
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +8.3%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111827] rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Deposit
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jan 20, 2024
                </p>
              </div>
              <p className="font-semibold text-green-600 dark:text-green-400">
                +NPR 1,000
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111827] rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Withdrawal
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jan 18, 2024
                </p>
              </div>
              <p className="font-semibold text-red-600 dark:text-red-400">
                -NPR 500
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111827] rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Profit Payout
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jan 15, 2024
                </p>
              </div>
              <p className="font-semibold text-green-600 dark:text-green-400">
                +NPR 340
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
