import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'cyan' | 'emerald' | 'amber' | 'rose';
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  description
}) => {
  const colorMap = {
    cyan: {
      border: 'border-[rgba(148,163,184,0.14)] hover:border-[#00D9FF]/40',
      iconBg: 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20',
      valueColor: 'text-white',
      glow: 'hover:shadow-[0_4px_24px_-4px_rgba(0,217,255,0.15)]'
    },
    emerald: {
      border: 'border-[rgba(148,163,184,0.14)] hover:border-[#10B981]/40',
      iconBg: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20',
      valueColor: 'text-[#10B981]',
      glow: 'hover:shadow-[0_4px_24px_-4px_rgba(16,185,129,0.15)]'
    },
    amber: {
      border: 'border-[rgba(148,163,184,0.14)] hover:border-[#F59E0B]/40',
      iconBg: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
      valueColor: 'text-[#F59E0B]',
      glow: 'hover:shadow-[0_4px_24px_-4px_rgba(245,158,11,0.15)]'
    },
    rose: {
      border: 'border-[rgba(148,163,184,0.14)] hover:border-[#F43F5E]/40',
      iconBg: 'bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20',
      valueColor: 'text-[#F43F5E]',
      glow: 'hover:shadow-[0_4px_24px_-4px_rgba(244,63,94,0.15)]'
    }
  };

  const c = colorMap[color];

  return (
    <div
      className={`p-5 rounded-2xl bg-[#0B1324] border ${c.border} ${c.glow} transition-all duration-300 flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#94A3B8]">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${c.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-extrabold tracking-tight ${c.valueColor} font-mono-code`}>
          {value}
        </span>
      </div>
      {description && (
        <p className="mt-2 text-xs text-[#64748B] font-medium">
          {description}
        </p>
      )}
    </div>
  );
};
