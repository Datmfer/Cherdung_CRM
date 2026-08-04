interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon?: string;
  color?: string;
}

export default function StatCard({ title, value, change, icon, color = "indigo" }: StatCardProps) {
  const colorClasses = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    green: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };

  const isPositive = change?.startsWith('+');

  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {change && (
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}