import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'System Alert',
  onRetry
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#0B1324] border border-[#F43F5E]/30 text-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4 shadow-[0_4px_20px_rgba(244,63,94,0.08)]">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E] shrink-0 mt-0.5 sm:mt-0">
          <AlertOctagon className="w-4 h-4" />
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#F43F5E]">
            {title}
          </h5>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-[#101A2E] hover:bg-[#101A2E]/80 text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-[rgba(148,163,184,0.18)] hover:border-[#00D9FF]/40 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
