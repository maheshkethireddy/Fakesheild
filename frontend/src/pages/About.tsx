import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  SlidersHorizontal, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  HelpCircle,
  Binary,
  Layers,
  Server,
  Globe,
  Terminal,
  FileWarning
} from 'lucide-react';
import { ScoreRing } from '../components/RiskScore';

export const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-[#050914] text-[#F8FAFC] space-y-14">
      {/* 24. HERO */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101A2E] border border-[rgba(0,217,255,0.3)] text-[11px] font-semibold text-[#00D9FF]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CYBERSECURITY INTELLIGENCE PLATFORM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Inter']">
          Understand the signals <br />
          <span className="bg-gradient-to-r from-[#00D9FF] via-[#008CFF] to-[#2563EB] bg-clip-text text-transparent">
            behind website risk.
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
          Transparent, deterministic risk heuristics designed to help users identify deceptive web destinations before submitting sensitive data.
        </p>
      </div>

      {/* 1. What FakeShield Does */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D9FF]">OVERVIEW</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              What FakeShield Does
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          In modern social engineering campaigns, adversaries exploit structural illusions: unencrypted transmission, raw numeric IP addresses, Punycode lookalikes, stacked subdomains, and authentication keywords.
        </p>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          FakeShield breaks down observable URL characteristics in real-time, computing an indicative 0–100 risk score and presenting actionable security recommendations without downloading malicious payloads.
        </p>
      </div>

      {/* 2. How Analysis Works (Visual Grid) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#008CFF]/10 border border-[#008CFF]/20 text-[#008CFF]">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#008CFF]">ARCHITECTURE</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              How Analysis Works
            </h2>
          </div>
        </div>

        {/* 6 Visual Intelligence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.12)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#00D9FF]" />
                Encryption Scheme
              </span>
              <span className="text-[10px] font-mono-code text-[#F43F5E] bg-[#F43F5E]/10 px-2 py-0.5 rounded border border-[#F43F5E]/20">+20 pts</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Detects plaintext HTTP protocols vulnerable to eavesdropping and MITM attacks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.12)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Server className="w-4 h-4 text-[#F43F5E]" />
                IP Address Hostname
              </span>
              <span className="text-[10px] font-mono-code text-[#F43F5E] bg-[#F43F5E]/10 px-2 py-0.5 rounded border border-[#F43F5E]/20">+25 pts</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Flags direct numeric IPv4/IPv6 hosts bypassing registered DNS domains.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.12)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#F59E0B]" />
                Punycode & Encoding
              </span>
              <span className="text-[10px] font-mono-code text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">+15 pts</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Catches internationalized character spoofing (xn--) engineered to impersonate trusted brands.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.12)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-[#00D9FF]" />
                Authority Disguise (@)
              </span>
              <span className="text-[10px] font-mono-code text-[#F43F5E] bg-[#F43F5E]/10 px-2 py-0.5 rounded border border-[#F43F5E]/20">+20 pts</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Identifies embedded userinfo tokens used to mask the actual landing server.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.12)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#F59E0B]" />
                Sensitive Keywords
              </span>
              <span className="text-[10px] font-mono-code text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">+5 to 15 pts</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Scores high-urgency keywords like &lsquo;login&rsquo;, &lsquo;verify&rsquo;, &lsquo;bonus&rsquo;, and &lsquo;update&rsquo;.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.12)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileWarning className="w-4 h-4 text-[#F43F5E]" />
                Executable Files
              </span>
              <span className="text-[10px] font-mono-code text-[#F43F5E] bg-[#F43F5E]/10 px-2 py-0.5 rounded border border-[#F43F5E]/20">+15 pts</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Discovers binary payloads (.exe, .scr, .apk) targeted directly in URL paths.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Risk Scoring (Horizontal Spectrum) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">SCORING</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Risk Scoring Engine
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-xl bg-[#080F1D] border border-[#10B981]/25">
            <span className="text-xs font-mono-code font-bold text-[#10B981] block mb-1">SCORE 0 — 29</span>
            <h4 className="text-base font-bold text-white mb-1.5">LOW RISK</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Standard HTTPS protocol with conventional hostname anatomy. No deceptive markers identified.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#080F1D] border border-[#F59E0B]/25">
            <span className="text-xs font-mono-code font-bold text-[#F59E0B] block mb-1">SCORE 30 — 59</span>
            <h4 className="text-base font-bold text-white mb-1.5">MEDIUM RISK</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Noticeable anomalies detected such as long hostnames, multiple subdomains, or unencrypted HTTP.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#080F1D] border border-[#F43F5E]/25">
            <span className="text-xs font-mono-code font-bold text-[#F43F5E] block mb-1">SCORE 60 — 100</span>
            <h4 className="text-base font-bold text-white mb-1.5">HIGH RISK</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Compounding threat indicators: direct numeric IP address, credential lure keywords, or dangerous file downloads.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Limitations */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]">TRANSPARENCY</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              System Limitations
            </h2>
          </div>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="text-[#00D9FF] font-bold">•</span>
            <span>FakeShield analyzes observable syntactic attributes without executing remote untrusted JavaScript to protect against browser exploits.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#00D9FF] font-bold">•</span>
            <span>A recently registered domain configured with clean TLS may initially produce a low score prior to inclusion in threat intelligence blocklists.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#00D9FF] font-bold">•</span>
            <span>Internal enterprise or development addresses (e.g., local LAN IPs) receive elevated risk scores due to their unencrypted or numeric composition.</span>
          </li>
        </ul>
      </div>

      {/* 5. Security Disclaimer */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(0,217,255,0.25)] text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#101A2E] border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] mx-auto">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-white">
          INDICATIVE RISK ASSESSMENT
        </h3>
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          &ldquo;FakeShield analyzes observable website characteristics to provide an indicative risk assessment. A low score does not guarantee that a website is safe, and a high score does not by itself prove that a website is malicious.&rdquo;
        </p>
      </div>
    </div>
  );
};
