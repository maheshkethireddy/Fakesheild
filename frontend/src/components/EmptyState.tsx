import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No assessments yet',
  description = 'Analyze your first website to start building your risk history.',
  actionText = 'Analyze Website',
  actionHref,
  actionLink,
  onAction
}) => {
  const targetHref = actionHref || actionLink || '/scanner';

  return (
    <div className="py-12 px-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] text-center flex flex-col items-center justify-center max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#101A2E] border border-[rgba(0,217,255,0.25)] flex items-center justify-center text-[#00D9FF] mb-4 shadow-[0_0_20px_rgba(0,217,255,0.1)]">
        <ShieldCheck className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[#F8FAFC] mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-[#94A3B8] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {targetHref && !onAction ? (
        <Link
          to={targetHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold btn-primary-gradient"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold btn-primary-gradient cursor-pointer"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ) : null}
    </div>
  );
};
