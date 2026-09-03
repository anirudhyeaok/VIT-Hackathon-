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
    <div className="bg-white rounded-xl border border-[#DCDDD7] p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B706A] mb-1.5">{title}</p>
          <h3 className="text-3xl font-bold text-[#30332F] tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-[#F0F1EC] text-[#5F7563] rounded-xl border border-[#DCDDD7]">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span className={`font-semibold ${trend.isPositive ? 'text-[#62806A]' : 'text-[#A96861]'}`}>
            {trend.isPositive ? '↑ +' : '↓ -'}{Math.abs(trend.value)}%
          </span>
          <span className="text-[#8A8F89] ml-2">vs last cycle</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
