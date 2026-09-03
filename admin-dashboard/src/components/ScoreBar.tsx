import React from 'react';

interface ScoreBarProps {
  score: number;
  max?: number;
  label: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, max = 100, label }) => {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));
  
  let color = 'bg-[#A96861]';
  if (percentage >= 70) color = 'bg-[#5F7563]';
  else if (percentage >= 40) color = 'bg-[#A78655]';

  return (
    <div className="mb-3.5">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-[#30332F]">{label}</span>
        <span className="font-bold font-mono text-[#30332F]">{score} / {max}</span>
      </div>
      <div className="w-full bg-[#F0F1EC] rounded-full h-2 border border-[#DCDDD7]">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ScoreBar;
