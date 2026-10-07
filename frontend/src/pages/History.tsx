import React, { useEffect, useState } from 'react';
import { scannerService } from '../services/scanner';
import type { StoredScanItem, RiskLevel } from '../types/scanner';
import { ScanCard } from '../components/ScanCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { History as HistoryIcon, Search, Filter, Trash2, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const [scans, setScans] = useState<StoredScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchScans = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await scannerService.getScans();
      if (res.success && res.data) {
        setScans(res.data);
      } else {
        setError(res.message || 'Failed to load scan history.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error loading scan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this scan record? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      await scannerService.deleteScan(id);
      // Remove from state immediately
      setScans(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete scan.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredScans = scans.filter(scan => {
    const matchesSearch =
      scan.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.url.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterLevel === 'ALL' || scan.riskLevel === filterLevel;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-semibold text-cyan-400 mb-2">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>SQLite Database Archive</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Scan History
          </h1>
          <p className="text-sm text-slate-400">
            Review and manage your previously analyzed website risk assessments.
          </p>
        </div>

        <Link
          to="/scanner"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-md shadow-cyan-500/20 transition-all"
        >
          Analyze New Website
        </Link>
      </div>

      {/* Filter and Search Bar */}
      {scans.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by domain or URL..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 self-start sm:self-auto overflow-x-auto">
            {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${filterLevel === lvl
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {lvl === 'ALL' ? 'All Risks' : `${lvl}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={fetchScans} />}

      {/* Content Area */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 font-mono text-sm">
          Loading scan records from database...
        </div>
      ) : scans.length === 0 ? (
        <EmptyState
          title="You haven't saved any scans yet."
          description="Every time you analyze a website URL while logged in, your assessment and heuristic findings will appear here."
          actionText="Analyze Website"
          actionLink="/scanner"
        />
      ) : filteredScans.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <p className="text-slate-300 font-semibold mb-2">No matching scan records found.</p>
          <p className="text-xs text-slate-400 mb-4">Try clearing your search query or changing the risk level filter.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterLevel('ALL');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-cyan-400 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <span>Showing {filteredScans.length} of {scans.length} total saved scans</span>
            <span>Sorted newest first</span>
          </div>

          {filteredScans.map((scan) => (
            <ScanCard
              key={scan.id}
              scan={scan}
              onDelete={handleDelete}
              isDeleting={deletingId === scan.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
