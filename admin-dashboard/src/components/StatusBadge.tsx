import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'loan' | 'risk' | 'platform';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'loan' }) => {
  const getStyles = () => {
    const s = status.toLowerCase();
    
    if (type === 'loan') {
      if (['grace_period', 'active'].includes(s)) return 'bg-[#F6EFE5] text-[#A78655] border-[#DCDDD7]';
      if (['repaid', 'completed'].includes(s)) return 'bg-[#E9EFEA] text-[#62806A] border-[#DCDDD7]';
      if (['overdue'].includes(s)) return 'bg-[#F8EDEB] text-[#A96861] border-[#DCDDD7]';
      if (['rolled_over'].includes(s)) return 'bg-[#F0F1EC] text-[#7C8768] border-[#DCDDD7]';
      if (['penalty_escalated'].includes(s)) return 'bg-[#F8EDEB] text-[#A96861] border-[#DCDDD7]';
    } else if (type === 'risk') {
      if (s === 'safe') return 'bg-[#E9EFEA] text-[#62806A] border-[#DCDDD7]';
      if (s === 'caution') return 'bg-[#F6EFE5] text-[#A78655] border-[#DCDDD7]';
      if (s === 'high_risk') return 'bg-[#F8EDEB] text-[#A96861] border-[#DCDDD7]';
    }
    
    return 'bg-[#F0F1EC] text-[#6B706A] border-[#DCDDD7]';
  };

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`px-2 py-0.5 inline-flex text-xs font-medium rounded-md border ${getStyles()}`}>
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;
