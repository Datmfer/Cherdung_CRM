import StatCard from "@/components/dashboard/StatCard";
import SimpleChart from "@/components/dashboard/SimpleChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value="2,543"
          change="+12.5%"
          icon="👥"
          color="indigo"
        />
        <StatCard
          title="Active Investments"
          value="1,234"
          change="+8.2%"
          icon="💰"
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value="NPR 45,678"
          change="+23.1%"
          icon="💵"
          color="blue"
        />
        <StatCard
          title="Open Tickets"
          value="23"
          change="-5.4%"
          icon="🎫"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Investment Growth
          </h3>
          <SimpleChart
            data={[65, 72, 68, 85, 92, 88, 95, 102, 98, 110, 115, 120]}
            color="indigo"
            label="Monthly investment trends"
          />
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Registrations
          </h3>
          <SimpleChart
            data={[45, 52, 38, 65, 72, 58, 82, 75, 90, 85, 95, 88]}
            color="green"
            label="New user signups"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <ActivityFeed />
      </div>
    </div>
  );
}
