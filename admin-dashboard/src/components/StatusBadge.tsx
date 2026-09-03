import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'loan' | 'risk' | 'platform';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'loan' }) => {
  const getStyles = () => {
    const s = status.toLowerCase();
    
    if (type === 'loan') {
      if (['grace_period', 'active'].includes(s)) return 'bg-blue-100 text-blue-800';
      if (['repaid', 'completed'].includes(s)) return 'bg-green-100 text-green-800';
      if (['overdue'].includes(s)) return 'bg-red-100 text-red-800';
      if (['rolled_over'].includes(s)) return 'bg-orange-100 text-orange-800';
      if (['blocked'].includes(s)) return 'bg-gray-100 text-gray-800';
    } else if (type === 'risk') {
      if (s === 'safe') return 'bg-green-100 text-green-800';
      if (s === 'caution') return 'bg-yellow-100 text-yellow-800';
      if (s === 'high_risk') return 'bg-red-100 text-red-800';
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStyles()}`}>
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;
