import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmailInput } from '../utils/validation';
import { ShieldCheck, Lock, Mail, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }

    if (!validateEmailInput(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword
      });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-[#050914] text-[#F8FAFC]">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN: Visual & Value Props */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1324] border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.2)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">FakeShield</span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#00D9FF]">
                ANALYZE BEFORE YOU TRUST
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Start monitoring website risks with confidence.
            </h2>
            <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
              Create a free account to automatically save your scan history, inspect recurring security signals, and view risk analytics.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Full audit history logged securely to Supabase</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Transparent 0–100 risk signal breakdown</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Zero third-party trackers or telemetry cookies</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(148,163,184,0.1)] text-xs text-[#64748B]">
            Problem ID: CS6 • Fake Website Detection Platform
          </div>
        </div>

        {/* RIGHT COLUMN: Register Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#00D9FF] block">
                GET STARTED
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Create your FakeShield account
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Set up your security analyst account in seconds.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/25 text-[#F43F5E] text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="register-fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Hunter"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.14)] text-xs sm:text-sm text-slate-100 placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.14)] text-xs sm:text-sm text-slate-100 placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF]/50 font-mono-code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.14)] text-xs sm:text-sm text-slate-100 placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF]/50 font-mono-code"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="register-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080F1D] border border-[rgba(148,163,184,0.14)] text-xs sm:text-sm text-slate-100 placeholder-[#64748B] focus:outline-none focus:border-[#00D9FF]/50 font-mono-code"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="register-submit-button"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold btn-primary-gradient disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[rgba(148,163,184,0.1)] text-center text-xs text-[#94A3B8]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#00D9FF] hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
