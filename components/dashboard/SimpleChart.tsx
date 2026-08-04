interface SimpleChartProps {
  data: number[];
  color?: string;
  label?: string;
}

export default function SimpleChart({ data, color = 'indigo', label }: SimpleChartProps) {
  const maxValue = Math.max(...data);
  const heightClass = 'h-36';
  
  const colorClasses = {
    indigo: ['bg-indigo-300', 'bg-indigo-400', 'bg-indigo-500', 'bg-indigo-600'],
    green: ['bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600'],
    blue: ['bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600'],
    purple: ['bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600'],
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <div>
      <div className={`flex items-end gap-3 ${heightClass}`}>
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          const colorIndex = Math.floor((index / data.length) * (colors.length - 1));
          return (
            <div
              key={index}
              className="w-8 rounded-t transition-all duration-300 hover:opacity-80"
              style={{
                height: `${height}%`,
                backgroundColor: colors[colorIndex]?.replace('bg-', '') || colors[0].replace('bg-', '')
              }}
            />
          );
        })}
      </div>
      {label && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          {label}
        </p>
      )}
    </div>
  );
}