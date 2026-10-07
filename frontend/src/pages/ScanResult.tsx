import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { scannerService } from '../services/scanner';
import { AnalysisResult } from '../types/scanner';
import { ScoreRing } from '../components/RiskScore';
import { RiskBadge } from '../components/RiskBadge';
import { FindingCard } from '../components/FindingCard';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertOctagon,
  ChevronRight,
  Globe
} from 'lucide-react';

export const ScanResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [scan, setScan] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchScan = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await scannerService.getScanById(id);
        if (response.success && response.data) {
          setScan(response.data);
        } else {
          setError(response.message || 'Scan record could not be found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load scan record.');
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this scan record from your history?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await scannerService.deleteScan(id);
      navigate('/history');
    } catch (err: any) {
      alert(err.message || 'Failed to delete scan record.');
      setIsDeleting(false);
    }
  };

  const copyReport = () => {
    if (!scan) return;
    const reportText = `FakeShield Risk Assessment Report:
URL: ${scan.url}
Domain: ${scan.domain}
Risk Score: ${scan.riskScore}/100 (${scan.riskLevel} RISK)
Assessment Date: ${new Date(scan.analyzedAt).toLocaleString()}
Explanation: ${scan.explanation}
Findings: ${scan.findings.length} evaluated.
Disclaimer: FakeShield provides an indicative risk assessment based on observable website characteristics.`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#0B1324] border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] mx-auto mb-4 animate-pulse shadow-[0_0_20px_rgba(0,217,255,0.2)]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-xs font-mono-code text-[#94A3B8]">Retrieving security intelligence telemetry...</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-6 rounded-2xl bg-[#0B1324] border border-[#F43F5E]/30 text-[#F8FAFC] mb-6 shadow-lg">
          <AlertOctagon className="w-8 h-8 text-[#F43F5E] mx-auto mb-3" />
          <h3 className="text-base font-bold mb-1">Assessment Not Found</h3>
          <p className="text-xs text-[#94A3B8]">{error || 'This scan record does not exist or you do not have permission to view it.'}</p>
        </div>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101A2E] text-white hover:bg-[#101A2E]/80 text-xs font-semibold border border-[rgba(148,163,184,0.18)] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Scan History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-[#050914] text-[#F8FAFC] space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs text-[#64748B]">
          <Link to="/" className="hover:text-[#00D9FF] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/history" className="hover:text-[#00D9FF] transition-colors">History</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#94A3B8] font-medium truncate max-w-[200px]">{scan.domain}</span>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={copyReport}
            className="px-3 py-1.5 rounded-lg bg-[#101A2E] hover:bg-[#101A2E]/80 text-[#94A3B8] hover:text-white border border-[rgba(148,163,184,0.16)] text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#F43F5E] hover:bg-[#F43F5E]/10 border border-[#F43F5E]/30 transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* Target Domain Assessment Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D9FF] block">
            Website Risk Assessment
          </span>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono-code break-all">
              {scan.domain}
            </h1>
            <RiskBadge level={scan.riskLevel} size="sm" />
          </div>
          <p className="text-xs text-[#94A3B8] font-mono-code truncate max-w-xl">
            {scan.url}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-[#64748B] bg-[#080F1D] px-3 py-1.5 rounded-lg border border-[rgba(148,163,184,0.1)] shrink-0 self-start sm:self-center">
          <Calendar className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>{new Date(scan.analyzedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* 15. TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Large Risk Score Card & "Why this score?" Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] flex flex-col items-center justify-center text-center shadow-lg">
            <ScoreRing score={scan.riskScore} level={scan.riskLevel} size={190} />
          </div>

          {/* 17. "WHY THIS SCORE?" SECTION */}
          <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(148,163,184,0.1)]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00D9FF]">
                Risk Contribution Breakdown
              </h3>
              <span className="text-[11px] text-[#64748B] font-mono-code">
                Points
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono-code">
              {scan.findings.filter(f => f.riskPoints > 0).length === 0 ? (
                <div className="text-[#10B981] p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                  ✓ Clean baseline signals. No adverse risk points assigned.
                </div>
              ) : (
                scan.findings
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
                <span>Total Score:</span>
                <span className="font-mono-code text-[#00D9FF]">{scan.riskScore} / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#00D9FF] mb-3">
              Risk Summary
            </h3>
            <p className="text-sm text-[#F8FAFC] leading-relaxed">
              {scan.explanation}
            </p>

            <div className="mt-6 pt-5 border-t border-[rgba(148,163,184,0.1)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00D9FF] mb-3">
                Security Recommendations
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#94A3B8]">
                {scan.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 16. SECURITY SIGNALS FINDINGS */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Security Signals ({scan.findings.length})
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Observable characteristics identified by the deterministic rule engine.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {scan.findings.map((finding, idx) => (
            <FindingCard key={idx} finding={finding} />
          ))}
        </div>
      </div>

      {/* Security Disclaimer */}
      <div className="p-4 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.1)] text-[11px] text-[#64748B] text-center">
        &ldquo;FakeShield analyzes observable website characteristics to provide an indicative risk assessment. A low score does not guarantee that a website is safe, and a high score does not by itself prove that a website is malicious.&rdquo;
      </div>
    </div>
  );
};
