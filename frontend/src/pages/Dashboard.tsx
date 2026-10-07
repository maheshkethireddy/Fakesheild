import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { scannerService } from '../services/scanner';
import { DashboardStats, StoredScanItem } from '../types/scanner';
import { StatCard } from '../components/StatCard';
import { RiskBadge } from '../components/RiskBadge';
import { EmptyState } from '../components/EmptyState';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Activity, 
  Search, 
  ArrowRight, 
  History, 
  Sparkles,
  ArrowUpRight,
  Globe,
  Calendar,
  Layers,
  BarChart3
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    lowRisk: 0,
    mediumRisk: 0,
    highRisk: 0,
    recentScans: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await scannerService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setError(res.message || 'Failed to load dashboard statistics.');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to the FakeShield service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.fullName || user?.email?.split('@')[0] || 'Analyst';

  // Compute percentages for Risk Overview chart
  const total = stats.totalScans || 0;
  const lowPercent = total > 0 ? Math.round((stats.lowRisk / total) * 100) : 0;
  const medPercent = total > 0 ? Math.round((stats.mediumRisk / total) * 100) : 0;
  const highPercent = total > 0 ? Math.round((stats.highRisk / total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-[#050914] text-[#F8FAFC] space-y-10">
      {/* 18. TOP SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[rgba(148,163,184,0.12)]">
        <div>
          <span className="text-xs font-semibold text-[#00D9FF] flex items-center gap-1.5 mb-1 font-mono-code">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse"></span>
            {getGreeting()}, {displayName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Inter']">
            Website Risk Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Monitor your recent website assessments and security signals.
          </p>
        </div>

        <div>
          <Link
            to="/scanner"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold btn-primary-gradient inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Analyze Website</span>
          </Link>
        </div>
      </div>

      {/* 19. DASHBOARD STATISTICS METRIC CARDS */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="TOTAL SCANS"
            value={stats.totalScans}
            icon={Activity}
            color="cyan"
            description={stats.totalScans > 0 ? `${stats.totalScans} assessments recorded` : 'No scans yet'}
          />
          <StatCard
            title="LOW RISK"
            value={stats.lowRisk}
            icon={ShieldCheck}
            color="emerald"
            description={stats.totalScans > 0 ? `${lowPercent}% of analyzed links` : 'No scans yet'}
          />
          <StatCard
            title="MEDIUM RISK"
            value={stats.mediumRisk}
            icon={AlertTriangle}
            color="amber"
            description={stats.totalScans > 0 ? `${medPercent}% of analyzed links` : 'No scans yet'}
          />
          <StatCard
            title="HIGH RISK"
            value={stats.highRisk}
            icon={AlertOctagon}
            color="rose"
            description={stats.totalScans > 0 ? `${highPercent}% of analyzed links` : 'No scans yet'}
          />
        </div>
      </div>

      {/* 20. DASHBOARD ANALYTICS: RISK OVERVIEW */}
      <div className="p-6 rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#00D9FF]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#F8FAFC]">
              RISK OVERVIEW
            </h3>
          </div>
          <span className="text-[11px] text-[#64748B] font-mono-code">
            Distribution Telemetry
          </span>
        </div>

        {total === 0 ? (
          <div className="py-8 text-center text-xs text-[#94A3B8]">
            <p>No telemetry recorded yet. Analyze URLs to populate risk distribution metrics.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Visual Multi-Segment Bar */}
            <div className="h-3 w-full rounded-full bg-[#101A2E] overflow-hidden flex">
              {lowPercent > 0 && (
                <div
                  style={{ width: `${lowPercent}%` }}
                  className="bg-[#10B981] h-full transition-all duration-500"
                  title={`Low Risk: ${lowPercent}%`}
                />
              )}
              {medPercent > 0 && (
                <div
                  style={{ width: `${medPercent}%` }}
                  className="bg-[#F59E0B] h-full transition-all duration-500"
                  title={`Medium Risk: ${medPercent}%`}
                />
              )}
              {highPercent > 0 && (
                <div
                  style={{ width: `${highPercent}%` }}
                  className="bg-[#F43F5E] h-full transition-all duration-500"
                  title={`High Risk: ${highPercent}%`}
                />
              )}
            </div>

            {/* Metrics Breakdown Legend */}
            <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                <span className="text-[#94A3B8]">Low: <strong className="text-white font-mono-code">{stats.lowRisk}</strong> ({lowPercent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                <span className="text-[#94A3B8]">Medium: <strong className="text-white font-mono-code">{stats.mediumRisk}</strong> ({medPercent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E] shrink-0" />
                <span className="text-[#94A3B8]">High: <strong className="text-white font-mono-code">{stats.highRisk}</strong> ({highPercent}%)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 21. RECENT SCANS TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Recent Scans
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Latest assessed web links stored in your security log.
            </p>
          </div>

          {stats.recentScans && stats.recentScans.length > 0 && (
            <Link
              to="/history"
              className="px-3 py-1.5 rounded-lg bg-[#101A2E] hover:bg-[#101A2E]/80 text-[#00D9FF] text-xs font-semibold flex items-center gap-1.5 border border-[rgba(0,217,255,0.25)] transition-all"
            >
              <span>View All ({stats.totalScans})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#94A3B8] text-xs font-mono-code rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.12)]">
            Loading recent assessments...
          </div>
        ) : stats.recentScans && stats.recentScans.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl bg-[#0B1324] border border-[rgba(148,163,184,0.16)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.12)] bg-[#080F1D] text-[10px] font-bold tracking-widest uppercase text-[#94A3B8]">
                    <th className="py-3.5 px-5">WEBSITE</th>
                    <th className="py-3.5 px-5">RISK</th>
                    <th className="py-3.5 px-5">SCORE</th>
                    <th className="py-3.5 px-5">DATE</th>
                    <th className="py-3.5 px-5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(148,163,184,0.08)] text-xs">
                  {stats.recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-[#101A2E]/40 transition-colors">
                      <td className="py-3.5 px-5 font-mono-code font-medium text-white flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-[#00D9FF] shrink-0" />
                        <span className="truncate max-w-xs">{scan.domain}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <RiskBadge level={scan.riskLevel} size="sm" />
                      </td>
                      <td className="py-3.5 px-5 font-mono-code font-semibold text-slate-200">
                        {scan.riskScore}/100
                      </td>
                      <td className="py-3.5 px-5 text-[#94A3B8] font-mono-code">
                        {new Date(scan.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          to={`/scan/${scan.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#101A2E] text-[#00D9FF] hover:text-white border border-[rgba(0,217,255,0.25)] text-xs font-semibold transition-all"
                        >
                          <span>View</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {stats.recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="p-4 rounded-xl bg-[#0B1324] border border-[rgba(148,163,184,0.14)] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-[#00D9FF] shrink-0" />
                      <span className="font-mono-code font-bold text-sm text-white truncate">
                        {scan.domain}
                      </span>
                    </div>
                    <RiskBadge level={scan.riskLevel} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>Score: <strong className="text-white font-mono-code">{scan.riskScore}/100</strong></span>
                    <span>{new Date(scan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <div className="pt-2 border-t border-[rgba(148,163,184,0.08)]">
                    <Link
                      to={`/scan/${scan.id}`}
                      className="w-full py-1.5 rounded-lg bg-[#101A2E] text-[#00D9FF] border border-[rgba(0,217,255,0.25)] text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <span>View Assessment</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No assessments yet"
            description="Analyze your first website to start building your risk history."
            actionText="Analyze Website"
            actionHref="/scanner"
          />
        )}
      </div>
    </div>
  );
};
