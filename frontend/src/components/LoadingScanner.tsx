import React, { useEffect, useState } from 'react';
import { ShieldCheck, Check, Loader2 } from 'lucide-react';

export const LoadingScanner: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [
    'Parsing URL syntax & protocol',
    'Inspecting domain structure & authority',
    'Evaluating risk signals & heuristic patterns',
    'Generating indicative assessment report'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 350);
    const timer2 = setTimeout(() => setStep(2), 700);
    const timer3 = setTimeout(() => setStep(3), 1050);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto my-10 p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(0,217,255,0.3)] shadow-[0_0_35px_rgba(0,217,255,0.12)] text-center relative overflow-hidden">
      {/* Top subtle scan line */}
      <div className="scan-line" />

      {/* Center Radar Scanner Icon */}
      <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#00D9FF]/20 animate-ping" />
        <div className="absolute -inset-1.5 rounded-full border border-[#00D9FF]/40 animate-pulse" />
        <div className="relative w-14 h-14 rounded-2xl bg-[#101A2E] border border-[#00D9FF]/50 flex items-center justify-center text-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.25)]">
          <ShieldCheck className="w-7 h-7 text-[#00D9FF]" />
        </div>
      </div>

      <span className="text-[11px] font-bold tracking-widest uppercase text-[#00D9FF] block mb-1">
        ANALYZING WEBSITE
      </span>
      <h3 className="text-lg font-bold text-[#F8FAFC] mb-5">
        Security Signals In Progress
      </h3>

      {/* Step Indicators */}
      <div className="space-y-2.5 text-left max-w-sm mx-auto bg-[#080F1D] p-4 rounded-xl border border-[rgba(148,163,184,0.1)] font-mono-code text-xs">
        {steps.map((label, idx) => {
          const isDone = step > idx;
          const isCurrent = step === idx;

          return (
            <div
              key={label}
              className={`flex items-center gap-2.5 transition-colors duration-300 ${
                isDone
                  ? 'text-[#10B981]'
                  : isCurrent
                  ? 'text-[#00D9FF] font-semibold'
                  : 'text-[#64748B]'
              }`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5 shrink-0 text-[#10B981]" />
              ) : isCurrent ? (
                <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-[#00D9FF]" />
              ) : (
                <span className="w-3.5 h-3.5 shrink-0 text-center font-bold text-[10px]">○</span>
              )}
              <span className="truncate">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
