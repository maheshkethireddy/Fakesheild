import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[rgba(148,163,184,0.12)] bg-[#050914] text-[#94A3B8] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-[#0B1324] border border-[rgba(0,217,255,0.3)] flex items-center justify-center text-[#00D9FF]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">FakeShield</span>
              <span className="mx-2 text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs text-[#94A3B8] font-medium tracking-wide">
                Analyze Before You Trust.
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <Link to="/" className="hover:text-[#00D9FF] transition-colors">
              Home
            </Link>
            <Link to="/scanner" className="hover:text-[#00D9FF] transition-colors">
              Scanner
            </Link>
            <Link to="/about" className="hover:text-[#00D9FF] transition-colors">
              About
            </Link>
            <a href="#disclaimer" onClick={(e) => { e.preventDefault(); alert("FakeShield evaluates observable website characteristics to deliver indicative risk assessments. Assessments do not constitute definitive cybersecurity audits."); }} className="hover:text-[#00D9FF] transition-colors">
              Disclaimer
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-[rgba(148,163,184,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Built for cybersecurity awareness and digital safety.</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} FakeShield Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
