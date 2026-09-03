import React from 'react';

interface ScoreBarProps {
  score: number;
  max?: number;
  label: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, max = 100, label }) => {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));
  
  let color = 'bg-red-500';
  if (percentage >= 70) color = 'bg-green-500';
  else if (percentage >= 40) color = 'bg-yellow-500';

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold">{score}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ScoreBar;
