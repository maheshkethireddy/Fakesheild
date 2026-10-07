import React, { useState } from 'react';
import { UrlInput } from '../components/UrlInput';
import { LoadingScanner } from '../components/LoadingScanner';
import { CyberHeroVisual } from '../components/CyberHeroVisual';
import { scannerService } from '../services/scanner';
import { AnalysisResult } from '../types/scanner';
import { 
  ShieldCheck, 
  Search, 
  Lock, 
  Cpu, 
  History, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Binary,
  Layers,
  FileCheck2,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { ScoreRing } from '../components/RiskScore';
import { RiskBadge } from '../components/RiskBadge';
import { FindingCard } from '../components/FindingCard';

export const Home: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [inlineResult, setInlineResult] = useState<AnalysisResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsScanning(true);
    setScanError(null);
    setInlineResult(null);

    try {
      const response = await scannerService.analyze(url);
      if (response.success && response.data) {
        setInlineResult(response.data);
      } else {
        setScanError(response.message || 'Analysis failed. Please check the URL and try again.');
      }
    } catch (err: any) {
      setScanError(err.message || 'Unable to connect to security scanner. Please ensure the backend is running.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050914] text-[#F8FAFC]">
      {/* 7. HERO SECTION */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden radial-glow-cyan">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy & Input */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101A2E] border border-[rgba(0,217,255,0.3)] text-[11px] font-semibold text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
                <span>CYBERSECURITY • WEBSITE RISK INTELLIGENCE</span>
              </div>

              {/* Hero Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-['Inter']">
                Know Before <br />
                You <span className="bg-gradient-to-r from-[#00D9FF] via-[#008CFF] to-[#2563EB] bg-clip-text text-transparent">Trust.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl">
                Analyze suspicious website URLs using transparent security signals and receive an indicative risk assessment in seconds.
              </p>

              {/* Large Scanner Card with Demo Chips */}
              <div className="pt-2">
                <UrlInput onAnalyze={handleAnalyze} isLoading={isScanning} />
              </div>

              {/* Loading Scanner Animation */}
              {isScanning && <LoadingScanner />}

              {/* Scan Error Alert */}
              {scanError && (
                <div className="p-4 rounded-xl bg-[#0B1324] border border-[#F43F5E]/30 text-[#F43F5E] text-xs sm:text-sm flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{scanError}</span>
                </div>
              )}
            </div>

            {/* Right Column: 8. Cybersecurity Visualization */}
            <div className="lg:col-span-5 hidden lg:flex justify-center">
              <CyberHeroVisual />
            </div>
          </div>

          {/* Inline Scan Result (if analyzed directly on landing) */}
          {inlineResult && (
            <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(0,217,255,0.3)] shadow-[0_10px_40px_rgba(0,217,255,0.12)] max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-[rgba(148,163,184,0.12)]">
                <div className="space-y-2 text-center md:text-left flex-1 min-w-0">
                  <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                    <RiskBadge level={inlineResult.riskLevel} size="md" />
                    <span className="text-xs font-mono-code text-[#64748B]">
                      INDICATIVE RISK ASSESSMENT
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-mono-code break-all">
                    {inlineResult.domain}
                  </h3>
                  <p className="text-xs text-[#94A3B8] font-mono-code break-all">
                    {inlineResult.url}
                  </p>
                </div>
                <div className="shrink-0">
                  <ScoreRing score={inlineResult.riskScore} level={inlineResult.riskLevel} size={150} />
                </div>
              </div>

              {/* Summary & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-[rgba(148,163,184,0.12)]">
                <div>
                  <h4 className="text-xs font-bold text-[#00D9FF] uppercase tracking-wider mb-2">
                    Analysis Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {inlineResult.explanation}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#00D9FF] uppercase tracking-wider mb-2">
                    Recommendations
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                    {inlineResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Security Signals */}
              <div className="pt-6">
                <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Detected Security Signals ({inlineResult.findings.length})</span>
                </h4>
                <div className="space-y-3">
                  {inlineResult.findings.map((finding, idx) => (
                    <FindingCard key={idx} finding={finding} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 9. TRUST / VALUE SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[rgba(148,163,184,0.1)] bg-[#080F1D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#00D9FF] block mb-2">
              WHY FAKESHIELD?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Transparent Defense Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
              Auditable security signals designed for digital safety awareness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] hover:border-[rgba(0,217,255,0.4)] transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] mb-4 group-hover:scale-105 transition-transform">
                <Binary className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                URL Intelligence
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Analyze structural characteristics of URLs including protocols, domain depth, and encoding tactics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] hover:border-[rgba(0,217,255,0.4)] transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#008CFF]/10 border border-[#008CFF]/20 flex items-center justify-center text-[#008CFF] mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                Transparent Scoring
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Understand why a score was generated with granular risk weight contribution breakdowns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] hover:border-[rgba(0,217,255,0.4)] transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                Security Signals
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Identify suspicious patterns like raw IP addresses, credential traps, and executable attachments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] hover:border-[rgba(0,217,255,0.4)] transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] mb-4 group-hover:scale-105 transition-transform">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                Personal Scan History
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Review previously analyzed websites and track your personal risk telemetry over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. HOW IT WORKS (Horizontal 4-Step Process) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[rgba(148,163,184,0.1)] bg-[#050914]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#00D9FF] block mb-2">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Four-Step Risk Verification
            </h2>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,217,255,0.3)] to-transparent -translate-y-8 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono-code font-bold text-[#00D9FF] bg-[#101A2E] px-2.5 py-1 rounded-md border border-[rgba(0,217,255,0.25)] inline-block mb-4">
                    01
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">ENTER</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Paste a website URL into the FakeShield analysis console.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono-code font-bold text-[#00D9FF] bg-[#101A2E] px-2.5 py-1 rounded-md border border-[rgba(0,217,255,0.25)] inline-block mb-4">
                    02
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">ANALYZE</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    FakeShield checks observable characteristics and structural cues.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono-code font-bold text-[#00D9FF] bg-[#101A2E] px-2.5 py-1 rounded-md border border-[rgba(0,217,255,0.25)] inline-block mb-4">
                    03
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">SCORE</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Risk signals are converted into an indicative score between 0 and 100.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono-code font-bold text-[#00D9FF] bg-[#101A2E] px-2.5 py-1 rounded-md border border-[rgba(0,217,255,0.25)] inline-block mb-4">
                    04
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">DECIDE</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Use the result to make a safer browsing and authentication decision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. RISK EXPLANATION SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[rgba(148,163,184,0.1)] bg-[#080F1D]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#00D9FF] block mb-2">
              TRANSPARENT METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              HOW THE RISK SCORE WORKS
            </h2>
          </div>

          {/* Horizontal Risk Spectrum */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] shadow-xl">
            {/* Visual Color Gradient Bar */}
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#F43F5E] mb-6 shadow-inner" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-[#080F1D] border border-[#10B981]/25">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#10B981] tracking-wider uppercase font-mono-code">
                    0 — 29
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    LOW RISK
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  URL utilizes HTTPS and follows standard naming conventions without typical malicious markers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#080F1D] border border-[#F59E0B]/25">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#F59E0B] tracking-wider uppercase font-mono-code">
                    30 — 59
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                    MEDIUM RISK
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Elevated signals detected such as missing encryption, excessive subdomains, or misleading naming cues.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#080F1D] border border-[#F43F5E]/25">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#F43F5E] tracking-wider uppercase font-mono-code">
                    60 — 100
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30">
                    HIGH RISK
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Multiple compounding anomalies: raw numeric IP hostnames, authentication lures, or executable payloads.
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-[#64748B] italic">
              &ldquo;Risk scores are indicative and should not be treated as definitive security verdicts.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 12. COMPACT PROFESSIONAL SECURITY NOTICE / DISCLAIMER */}
      <section id="disclaimer" className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[rgba(148,163,184,0.1)] bg-[#050914]">
        <div className="max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-[#101A2E] border border-[rgba(0,217,255,0.25)] flex items-center justify-center text-[#00D9FF] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#00D9FF] mb-1">
              INDICATIVE RISK ASSESSMENT
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              FakeShield analyzes observable website characteristics to provide an indicative risk assessment. A low score does not guarantee that a website is safe, and a high score does not by itself prove that a website is malicious.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
