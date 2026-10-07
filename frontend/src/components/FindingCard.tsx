import React from 'react';
import { ScanFinding } from '../types/scanner';
import { SeverityBadge } from './RiskBadge';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Lock, 
  Server, 
  Globe, 
  Binary, 
  Terminal, 
  FileWarning
} from 'lucide-react';

interface FindingCardProps {
  finding: ScanFinding;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
  const getCategoryIcon = () => {
    switch (finding.category.toLowerCase()) {
      case 'protocol & encryption':
        return finding.severity === 'SAFE' 
          ? <Lock className="w-4 h-4 text-[#10B981]" /> 
          : <Lock className="w-4 h-4 text-[#F43F5E]" />;
      case 'host identity':
        return <Server className="w-4 h-4 text-[#F43F5E]" />;
      case 'domain structure':
        return <Globe className="w-4 h-4 text-[#F59E0B]" />;
      case 'url structure':
      case 'url length':
        return <Binary className="w-4 h-4 text-[#00D9FF]" />;
      case 'content indicators':
        return <Terminal className="w-4 h-4 text-[#F59E0B]" />;
      case 'executable file download':
        return <FileWarning className="w-4 h-4 text-[#F43F5E]" />;
      default:
        return finding.severity === 'SAFE' 
          ? <ShieldCheck className="w-4 h-4 text-[#10B981]" /> 
          : finding.severity === 'HIGH' 
          ? <AlertOctagon className="w-4 h-4 text-[#F43F5E]" /> 
          : <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
    }
  };

  const getSeverityStyles = () => {
    switch (finding.severity) {
      case 'SAFE':
        return {
          cardBg: 'bg-[#0B1324]',
          border: 'border-[#10B981]/25 hover:border-[#10B981]/40',
          ptsBg: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25',
          iconBg: 'bg-[#10B981]/10 border-[#10B981]/20'
        };
      case 'HIGH':
        return {
          cardBg: 'bg-[#0B1324]',
          border: 'border-[#F43F5E]/30 hover:border-[#F43F5E]/50',
          ptsBg: 'bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30 font-bold',
          iconBg: 'bg-[#F43F5E]/10 border-[#F43F5E]/25'
        };
      case 'WARNING':
        return {
          cardBg: 'bg-[#0B1324]',
          border: 'border-[#F59E0B]/25 hover:border-[#F59E0B]/45',
          ptsBg: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30 font-bold',
          iconBg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20'
        };
      default:
        return {
          cardBg: 'bg-[#0B1324]',
          border: 'border-[rgba(148,163,184,0.15)] hover:border-[#00D9FF]/30',
          ptsBg: 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/20',
          iconBg: 'bg-[#101A2E] border-[rgba(148,163,184,0.15)]'
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div className={`p-4 sm:p-5 rounded-xl border ${styles.border} ${styles.cardBg} transition-all duration-200 group`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${styles.iconBg} flex items-center justify-center shrink-0`}>
            {getCategoryIcon()}
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#94A3B8] block">
              {finding.category}
            </span>
            <h4 className="text-sm sm:text-base font-semibold text-[#F8FAFC]">
              {finding.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <SeverityBadge severity={finding.severity} />
          {finding.riskPoints > 0 ? (
            <span className={`text-xs font-mono-code px-2 py-0.5 rounded-md border ${styles.ptsBg}`}>
              +{finding.riskPoints} pts
            </span>
          ) : (
            <span className="text-xs font-mono-code px-2 py-0.5 rounded-md border bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">
              0 pts
            </span>
          )}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed pl-0 sm:pl-11 mt-1">
        {finding.description}
      </p>
    </div>
  );
};
