import React, { useState } from 'react';
import { Search, X, ShieldAlert, ArrowRight, Globe, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { validateUrlInput } from '../utils/validation';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  showPresets?: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  onAnalyze,
  isLoading = false,
  initialValue = '',
  showPresets = true
}) => {
  const [url, setUrl] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateUrlInput(url);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid URL.');
      return;
    }

    onAnalyze(validation.normalized || url.trim());
  };

  const handlePreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setError(null);
    onAnalyze(presetUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.18)] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)] focus-within:border-[rgba(0,217,255,0.5)] focus-within:shadow-[0_0_30px_rgba(0,217,255,0.15)] transition-all duration-300">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#00D9FF] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse"></span>
            WEBSITE RISK SCANNER
          </span>
          <span className="text-[11px] text-[#64748B] font-mono-code hidden sm:inline">
            TLS • Domain • Heuristics
          </span>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.14)] p-1.5 transition-all">
            <div className="flex items-center flex-1 px-3 py-2">
              <Globe className="w-4 h-4 text-[#00D9FF] mr-3 shrink-0" />
              <input
                type="text"
                id="url-input"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://example.com"
                disabled={isLoading}
                className="w-full bg-transparent text-[#F8FAFC] placeholder-[#64748B] text-sm sm:text-base focus:outline-none font-mono-code"
              />
              {url && !isLoading && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="p-1 text-[#64748B] hover:text-[#F8FAFC] transition-colors"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              id="analyze-submit-button"
              disabled={isLoading || !url.trim()}
              className="mt-2 sm:mt-0 px-6 py-3 rounded-lg text-xs font-semibold btn-primary-gradient flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#050914] border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Website</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-3 px-3.5 py-2 bg-[#F43F5E]/10 border border-[#F43F5E]/25 rounded-lg text-[#F43F5E] text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {showPresets && (
          <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.08)] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-[#64748B]">Quick examples:</span>
            <button
              type="button"
              onClick={() => handlePreset('https://example.com')}
              className="px-2.5 py-1 rounded-md bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/25 text-[11px] font-medium font-mono-code transition-all flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3" />
              Safe HTTPS
            </button>
            <button
              type="button"
              onClick={() => handlePreset('http://192.168.1.10/login')}
              className="px-2.5 py-1 rounded-md bg-[#F43F5E]/10 hover:bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/25 text-[11px] font-medium font-mono-code transition-all flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3" />
              HTTP + IP
            </button>
            <button
              type="button"
              onClick={() => handlePreset('http://login.secure-verify-bonus.xyz/update-account')}
              className="px-2.5 py-1 rounded-md bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/25 text-[11px] font-medium font-mono-code transition-all flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3" />
              Suspicious URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
