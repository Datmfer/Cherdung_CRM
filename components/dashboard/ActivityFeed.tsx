interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'user' | 'investment' | 'support' | 'system';
}

const activities: ActivityItem[] = [
  { id: '1', user: 'John Doe', action: 'Created new investment account', time: '2 minutes ago', type: 'user' },
  { id: '2', user: 'System', action: 'Investment plan updated', time: '15 minutes ago', type: 'system' },
  { id: '3', user: 'Support Team', action: 'Resolved ticket #1234', time: '1 hour ago', type: 'support' },
  { id: '4', user: 'Jane Smith', action: 'Upgraded to Growth Plan', time: '2 hours ago', type: 'investment' },
  { id: '5', user: 'Admin', action: 'Added new user', time: '3 hours ago', type: 'user' },
];

const typeIcons = {
  user: '👤',
  investment: '💰',
  support: '💬',
  system: '⚙️',
};

const typeColors = {
  user: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  investment: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  support: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  system: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-[#111827] rounded-lg">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${typeColors[activity.type]}`}>
            {typeIcons[activity.type]}
          </div>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium text-gray-900 dark:text-white">{activity.user}</span>
              <span className="text-gray-600 dark:text-gray-400"> {activity.action}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}