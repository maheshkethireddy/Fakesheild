import React from 'react';
import { Link } from 'react-router-dom';
import { StoredScanItem } from '../types/scanner';
import { RiskBadge } from './RiskBadge';
import { Calendar, Trash2, ArrowUpRight, Globe } from 'lucide-react';

interface ScanCardProps {
  scan: StoredScanItem;
  onDelete?: (id: string | number) => void;
  isDeleting?: boolean;
}

export const ScanCard: React.FC<ScanCardProps> = ({
  scan,
  onDelete,
  isDeleting = false
}) => {
  const formattedDate = new Date(scan.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] hover:border-[rgba(0,217,255,0.3)] transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#00D9FF] shrink-0" />
            <h4 className="text-sm sm:text-base font-bold text-white truncate font-mono-code">
              {scan.domain}
            </h4>
          </div>
          <RiskBadge level={scan.riskLevel} size="sm" />
          <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-[#101A2E] text-slate-300 border border-[rgba(148,163,184,0.12)]">
            {scan.riskScore}/100
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
          {scan.findingsCount !== undefined && (
            <>
              <span>•</span>
              <span>{scan.findingsCount} signals</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <Link
          to={`/scan/${scan.id}`}
          className="px-3.5 py-1.5 rounded-lg bg-[#101A2E] hover:bg-[#101A2E]/80 text-[#00D9FF] hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-[rgba(0,217,255,0.25)] transition-all"
        >
          <span>View</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(scan.id)}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F43F5E] hover:bg-[#F43F5E]/10 border border-transparent hover:border-[#F43F5E]/20 transition-all disabled:opacity-40"
            title="Delete this record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
