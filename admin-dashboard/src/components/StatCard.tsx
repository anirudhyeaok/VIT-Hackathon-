import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-xl border border-[#DCDDD7] p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#6B706A] mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[#30332F] tracking-tight">{value}</h3>
        </div>
        <div className="p-2.5 bg-[#F0F1EC] text-[#5F7563] rounded-lg border border-[#DCDDD7]/60">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-xs">
          <span className={`font-semibold ${trend.isPositive ? 'text-[#62806A]' : 'text-[#A96861]'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-[#6B706A] ml-1.5">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
