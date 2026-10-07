import React from 'react';
import { ShieldCheck, Activity, Lock, Globe, Cpu, AlertTriangle } from 'lucide-react';

export const CyberHeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center p-4 select-none pointer-events-none">
      {/* Background glow and rings */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00D9FF]/10 via-[#008CFF]/5 to-transparent blur-2xl" />
      <div className="absolute inset-8 rounded-full border border-[rgba(0,217,255,0.12)] animate-[spin_40s_linear_infinite]" />
      <div className="absolute inset-20 rounded-full border border-dashed border-[rgba(148,163,184,0.15)] animate-[spin_60s_linear_infinite_reverse]" />

      {/* SVG Connecting Circuit Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
        {/* Node connectors */}
        <line x1="200" y1="200" x2="80" y2="120" stroke="rgba(0, 217, 255, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="200" y1="200" x2="320" y2="120" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="200" y1="200" x2="80" y2="280" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="200" y1="200" x2="320" y2="280" stroke="rgba(244, 63, 94, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Pulse dots */}
        <circle cx="140" cy="160" r="2.5" fill="#00D9FF" />
        <circle cx="260" cy="160" r="2.5" fill="#10B981" />
        <circle cx="140" cy="240" r="2.5" fill="#F59E0B" />
        <circle cx="260" cy="240" r="2.5" fill="#F43F5E" />
      </svg>

      {/* Central Shield Orb */}
      <div className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#101A2E] to-[#080F1D] border-2 border-[#00D9FF] flex flex-col items-center justify-center text-[#00D9FF] shadow-[0_0_35px_rgba(0,217,255,0.35)]">
        <ShieldCheck className="w-10 h-10 text-[#00D9FF]" />
        <span className="text-[9px] font-mono-code font-bold tracking-wider text-slate-300 mt-1 uppercase">
          SECURE
        </span>
      </div>

      {/* Satellite Node: URL Input / Globe (Top Left) */}
      <div className="absolute top-12 left-10 flex items-center gap-2 p-2.5 rounded-xl bg-[#0B1324]/90 border border-[rgba(0,217,255,0.25)] shadow-lg backdrop-blur-md">
        <div className="p-1.5 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF]">
          <Globe className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">INPUT</div>
          <div className="text-[11px] font-mono-code text-white">URL Syntax</div>
        </div>
      </div>

      {/* Satellite Node: Protocol Analysis (Top Right) */}
      <div className="absolute top-12 right-10 flex items-center gap-2 p-2.5 rounded-xl bg-[#0B1324]/90 border border-[rgba(16,185,129,0.25)] shadow-lg backdrop-blur-md">
        <div className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981]">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">PROTOCOL</div>
          <div className="text-[11px] font-mono-code text-[#10B981]">TLS / HTTPS</div>
        </div>
      </div>

      {/* Satellite Node: Signals / Heuristics (Bottom Left) */}
      <div className="absolute bottom-12 left-10 flex items-center gap-2 p-2.5 rounded-xl bg-[#0B1324]/90 border border-[rgba(245,158,11,0.25)] shadow-lg backdrop-blur-md">
        <div className="p-1.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">SIGNALS</div>
          <div className="text-[11px] font-mono-code text-[#F59E0B]">Heuristics</div>
        </div>
      </div>

      {/* Satellite Node: Risk Assessment Verdict (Bottom Right) */}
      <div className="absolute bottom-12 right-10 flex items-center gap-2 p-2.5 rounded-xl bg-[#0B1324]/90 border border-[rgba(244,63,94,0.25)] shadow-lg backdrop-blur-md">
        <div className="p-1.5 rounded-lg bg-[#F43F5E]/10 text-[#F43F5E]">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">VERDICT</div>
          <div className="text-[11px] font-mono-code text-white">Score: 0–100</div>
        </div>
      </div>
    </div>
  );
};
