import React from 'react';
import { RiskLevel, FindingSeverity } from '../types/scanner';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const configs = {
    LOW: {
      text: 'LOW RISK',
      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
      icon: ShieldCheck
    },
    MEDIUM: {
      text: 'MEDIUM RISK',
      bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
      icon: AlertTriangle
    },
    HIGH: {
      text: 'HIGH RISK',
      bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      glow: 'shadow-[0_0_12px_rgba(239,68,68,0.2)]',
      icon: AlertOctagon
    }
  };

  const current = configs[level] || configs.LOW;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5 font-bold tracking-wide'
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${current.bg} ${current.glow} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      <span>{current.text}</span>
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: FindingSeverity }> = ({ severity }) => {
  const configs = {
    SAFE: {
      text: 'SAFE',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      icon: ShieldCheck
    },
    INFO: {
      text: 'INFO',
      bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      icon: Info
    },
    WARNING: {
      text: 'WARNING',
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      icon: AlertTriangle
    },
    HIGH: {
      text: 'HIGH SEVERITY',
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      icon: AlertOctagon
    }
  };

  const current = configs[severity] || configs.INFO;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg}`}>
      <Icon className="w-3 h-3" />
      {current.text}
    </span>
  );
};
