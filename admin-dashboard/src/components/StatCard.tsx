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
    <div className="bg-white dark:bg-[#242624] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A] p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B706A] dark:text-[#A3A8A2] mb-1.5">{title}</p>
          <h3 className="text-3xl font-bold text-[#30332F] dark:text-[#E5E7E3] tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-[#F0F1EC] dark:bg-[#2E302E] text-[#5F7563] dark:text-[#7AA37F] rounded-xl border border-[#DCDDD7] dark:border-[#3A3D3A]">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span className={`font-semibold ${trend.isPositive ? 'text-[#62806A]' : 'text-[#A96861]'}`}>
            {trend.isPositive ? '↑ +' : '↓ -'}{Math.abs(trend.value)}%
          </span>
          <span className="text-[#8A8F89] dark:text-[#7A7F79] ml-2">vs last cycle</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
