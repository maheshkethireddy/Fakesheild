import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, LogIn, LogOut, Menu, X, Sparkles, LayoutDashboard, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Scanner', path: '/scanner' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#050914]/85 backdrop-blur-xl border-b border-[rgba(148,163,184,0.12)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Shield logo + FakeShield + small tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 via-[#008CFF]/20 to-transparent border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.2)] group-hover:scale-105 group-hover:border-[#00D9FF] transition-all duration-300">
              <ShieldCheck className="w-5 h-5 text-[#00D9FF]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 font-['Inter']">
                FakeShield
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse"></span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-[#94A3B8]">
                ANALYZE BEFORE YOU TRUST
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-[#080F1D]/60 px-3 py-1.5 rounded-full border border-[rgba(148,163,184,0.1)]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-white bg-[#101A2E] border border-[rgba(0,217,255,0.3)] shadow-[0_0_12px_rgba(0,217,255,0.15)] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A2E]/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT: Auth actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1324] border border-[rgba(148,163,184,0.16)] hover:border-[#00D9FF]/40 transition-all text-xs text-[#F8FAFC]"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#2563EB] flex items-center justify-center text-[#050914] font-bold text-[10px]">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="font-medium text-slate-200 truncate max-w-[120px]">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#F43F5E] hover:bg-[#F43F5E]/10 border border-transparent hover:border-[#F43F5E]/20 flex items-center gap-1.5 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold btn-primary-gradient flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#0B1324] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[rgba(148,163,184,0.12)] bg-[#050914] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-[#00D9FF] bg-[#101A2E]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#0B1324]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-[rgba(148,163,184,0.12)]">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-1 text-xs text-[#94A3B8]">
                  <div className="w-5 h-5 rounded-full bg-[#00D9FF] text-[#050914] font-bold text-[10px] flex items-center justify-center">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#F43F5E] hover:bg-[#F43F5E]/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-center text-sm font-medium text-slate-200 bg-[#0B1324] border border-[rgba(148,163,184,0.14)]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-center text-sm font-semibold btn-primary-gradient"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
