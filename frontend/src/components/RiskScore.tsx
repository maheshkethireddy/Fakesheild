import React from 'react';
import { RiskLevel } from '../types/scanner';

interface ScoreRingProps {
  score: number;
  level: RiskLevel;
  size?: number;
  showDetails?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  level,
  size = 200,
  showDetails = true
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const colorConfig = {
    LOW: {
      stroke: '#10B981',
      glow: 'rgba(16, 185, 129, 0.4)',
      text: 'text-[#10B981]',
      badgeBg: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
      label: 'LOW RISK'
    },
    MEDIUM: {
      stroke: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.4)',
      text: 'text-[#F59E0B]',
      badgeBg: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
      label: 'MEDIUM RISK'
    },
    HIGH: {
      stroke: '#F43F5E',
      glow: 'rgba(244, 63, 94, 0.4)',
      text: 'text-[#F43F5E]',
      badgeBg: 'bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30',
      label: 'HIGH RISK'
    }
  };

  const current = colorConfig[level] || colorConfig.LOW;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Subtle background radar ring */}
        <div
          className="absolute inset-2 rounded-full border border-[rgba(148,163,184,0.08)] pointer-events-none"
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#101A2E"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Gauge */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={current.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0 0 10px ${current.glow})`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-5xl font-black tracking-tight ${current.text} font-mono-code`}>
            {score}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#94A3B8] mt-0.5">
            / 100
          </span>
          <div className="mt-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider border ${current.badgeBg}`}>
              {current.label}
            </span>
          </div>
        </div>
      </div>

      {showDetails && (
        <span className="mt-3 text-[11px] font-bold tracking-widest uppercase text-[#64748B]">
          INDICATIVE RISK SCORE
        </span>
      )}
    </div>
  );
};

// Backwards compatibility alias
export const RiskScore = ScoreRing;
