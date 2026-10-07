import React, { useState } from 'react';
import { UrlInput } from '../components/UrlInput';
import { LoadingScanner } from '../components/LoadingScanner';
import { ScoreRing } from '../components/RiskScore';
import { RiskBadge } from '../components/RiskBadge';
import { FindingCard } from '../components/FindingCard';
import { scannerService } from '../services/scanner';
import { AnalysisResult } from '../types/scanner';
import { useAuth } from '../hooks/useAuth';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  History, 
  UserPlus, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Lock,
  Globe,
  Binary,
  Terminal,
  Server,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Scanner: React.FC = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (url: string) => {
    setIsScanning(true);
    setError(null);

    try {
      const response = await scannerService.analyze(url);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.message || 'Failed to analyze URL.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred while analyzing URL.');
    } finally {
      setIsScanning(false);
    }
  };

  const copyReport = () => {
    if (!result) return;
    const reportText = `FakeShield Risk Assessment:
URL: ${result.url}
Domain: ${result.domain}
Risk Score: ${result.riskScore}/100 (${result.riskLevel} RISK)
Explanation: ${result.explanation}
Findings: ${result.findings.length} characteristics evaluated.
Disclaimer: FakeShield provides an indicative risk assessment based on observable website characteristics.`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const supportedAnalysis = [
    { label: 'HTTPS', icon: Lock },
    { label: 'Domain structure', icon: Globe },
    { label: 'URL patterns', icon: Binary },
    { label: 'Suspicious keywords', icon: Terminal },
    { label: 'IP hostname', icon: Server },
    { label: 'Encoding patterns', icon: Layers }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-[#050914] text-[#F8FAFC]">
      {/* 13. Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
        <Link to="/" className="hover:text-[#00D9FF] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#94A3B8] font-medium">Scanner</span>
      </nav>

      {/* Heading & Subtitle */}
      <div className="text-left mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Inter']">
          Website Risk Scanner
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-2xl">
          Analyze a URL and understand the security signals behind its risk score.
        </p>
      </div>

      {/* Central Product Scanner Card */}
      <div className="mb-8">
        <UrlInput onAnalyze={handleAnalyze} isLoading={isScanning} />

        {/* Supported Analysis Chips */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#0B1324] border border-[rgba(148,163,184,0.12)] flex flex-wrap items-center justify-between gap-3 max-w-3xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Supported Analysis:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {supportedAnalysis.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#101A2E] border border-[rgba(148,163,184,0.12)] text-[11px] font-medium text-slate-300"
              >
                <item.icon className="w-3 h-3 text-[#00D9FF]" />
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scanning Animation */}
      {isScanning && <LoadingScanner />}

      {/* Error State */}
      {error && (
        <div className="max-w-3xl mx-auto p-4 rounded-xl bg-[#0B1324] border border-[#F43F5E]/30 text-[#F43F5E] text-xs sm:text-sm mb-8 flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 14, 15, 16, 17. SCAN RESULT DISPLAY */}
      {result && !isScanning && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D9FF] block">
                Website Risk Assessment
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-mono-code break-all">
                {result.domain}
              </h2>
              <p className="text-xs text-[#94A3B8] font-mono-code truncate max-w-xl">
                {result.url}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={copyReport}
                className="px-3 py-1.5 rounded-lg bg-[#101A2E] hover:bg-[#101A2E]/80 text-[#94A3B8] hover:text-white border border-[rgba(148,163,184,0.16)] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share Report'}</span>
              </button>

              {user && (
                <Link
                  to="/history"
                  className="px-3.5 py-1.5 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 text-xs font-semibold hover:bg-[#00D9FF]/20 transition-all flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                </Link>
              )}
            </div>
          </div>

          {/* 15. TWO-COLUMN RESULT LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN (lg:col-span-5): Score Ring & "Why This Score?" breakdown */}
            <div className="lg:col-span-5 space-y-6">
              {/* Score Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] flex flex-col items-center justify-center text-center shadow-lg">
                <ScoreRing score={result.riskScore} level={result.riskLevel} size={190} />
              </div>

              {/* 17. "WHY THIS SCORE?" BREAKDOWN CARD */}
              <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(148,163,184,0.1)]">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#00D9FF]">
                    Why This Score?
                  </h3>
                  <span className="text-[11px] text-[#64748B] font-mono-code">
                    Transparent Signal Weights
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono-code">
                  {result.findings.filter(f => f.riskPoints > 0).length === 0 ? (
                    <div className="text-[#10B981] p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                      ✓ No adverse risk penalties applied. Base security baseline verified.
                    </div>
                  ) : (
                    result.findings
                      .filter(f => f.riskPoints > 0)
                      .map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-[rgba(148,163,184,0.06)]">
                          <span className="text-[#94A3B8] truncate mr-2 font-sans text-xs">
                            {f.title}
                          </span>
                          <span className="text-[#F43F5E] font-bold shrink-0">
                            +{f.riskPoints}
                          </span>
                        </div>
                      ))
                  )}

                  <div className="pt-3 flex items-center justify-between font-bold text-sm border-t border-[rgba(148,163,184,0.14)] text-white">
                    <span>Total Calculated Risk:</span>
                    <span className="font-mono-code text-[#00D9FF]">{result.riskScore} / 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (lg:col-span-7): Risk Summary & Recommendations */}
            <div className="lg:col-span-7 space-y-6">
              {/* Risk Summary */}
              <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)]">
                <div className="flex items-center gap-2 mb-3">
                  <RiskBadge level={result.riskLevel} size="sm" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                    Assessment Summary
                  </span>
                </div>
                <p className="text-sm text-[#F8FAFC] leading-relaxed">
                  {result.explanation}
                </p>

                <div className="mt-6 pt-5 border-t border-[rgba(148,163,184,0.1)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#00D9FF] mb-3">
                    Safety Recommendations
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#94A3B8]">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Guest / Account Callout */}
              {!user && (
                <div className="p-4 rounded-xl bg-[#101A2E] border border-[rgba(0,217,255,0.2)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-[#94A3B8]">
                    Scanned as guest. Create an account to log scans and monitor your personal security history.
                  </span>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold btn-primary-gradient shrink-0 flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Account</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 16. FINDINGS SECTION: SECURITY SIGNALS */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Security Signals ({result.findings.length})
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Granular threat intelligence signals discovered during URL structural analysis.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {result.findings.map((finding, idx) => (
                <FindingCard key={idx} finding={finding} />
              ))}
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="p-4 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.1)] text-[11px] text-[#64748B] text-center">
            &ldquo;FakeShield analyzes observable website characteristics to provide an indicative risk assessment. A low score does not guarantee that a website is safe, and a high score does not by itself prove that a website is malicious.&rdquo;
          </div>
        </div>
      )}
    </div>
  );
};
