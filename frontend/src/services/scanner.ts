import { supabase } from '../lib/supabase';
import { AnalysisResult, DashboardStats, StoredScanItem, ScanFinding } from '../types/scanner';
import { analyzeUrl, getExplanationsAndRecommendations } from './urlAnalyzer';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

const LOCAL_SCANS_KEY = 'fakeshield_local_scans';

function getLocalScansFromStorage(): StoredScanItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_SCANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalScanToStorage(scan: AnalysisResult, userId?: string | null): StoredScanItem {
  const scans = getLocalScansFromStorage();
  const id = scan.id ? String(scan.id) : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  
  const storedItem: StoredScanItem = {
    id,
    userId: userId || undefined,
    url: scan.url,
    domain: scan.domain,
    riskScore: scan.riskScore,
    riskLevel: scan.riskLevel,
    createdAt: scan.analyzedAt || new Date().toISOString(),
    findingsCount: scan.findings?.length || 0
  };

  try {
    localStorage.setItem(`fakeshield_scan_detail_${id}`, JSON.stringify({ ...scan, id }));
    const filtered = scans.filter((s) => String(s.id) !== id);
    filtered.unshift(storedItem);
    localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(filtered.slice(0, 100)));
  } catch (err) {
    console.warn('LocalStorage save note:', err);
  }

  return storedItem;
}

function getLocalScanDetailFromStorage(id: string): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(`fakeshield_scan_detail_${id}`);
    if (raw) return JSON.parse(raw);
    
    const scans = getLocalScansFromStorage();
    const item = scans.find((s) => String(s.id) === id);
    if (item) {
      const { explanation, recommendations } = getExplanationsAndRecommendations(item.riskLevel);
      return {
        id: item.id,
        url: item.url,
        domain: item.domain,
        riskScore: item.riskScore,
        riskLevel: item.riskLevel,
        findings: [],
        explanation,
        recommendations,
        analyzedAt: item.createdAt
      };
    }
  } catch {}
  return null;
}

function deleteLocalScanFromStorage(id: string): void {
  try {
    localStorage.removeItem(`fakeshield_scan_detail_${id}`);
    const scans = getLocalScansFromStorage().filter((s) => String(s.id) !== id);
    localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(scans));
  } catch {}
}

export const scannerService = {
  /**
   * Analyzes a URL using the deterministic heuristic analyzer.
   * If currentUser is provided, attempts to persist to Supabase with seamless local fallback.
   * If anonymous, returns the assessment immediately.
   */
  async analyze(url: string, currentUserId?: string | null): Promise<ApiResponse<AnalysisResult>> {
    try {
      if (!url || !url.trim()) {
        return {
          success: false,
          message: 'Website URL is required for analysis.'
        };
      }

      // Run deterministic analysis locally in frontend
      const result = analyzeUrl(url);

      let savedScanId: string | null = null;

      // If user is authenticated, attempt persistence
      if (currentUserId) {
        try {
          // 1. Insert into public.scans
          const { data: scanRow, error: scanError } = await supabase
            .from('scans')
            .insert({
              user_id: currentUserId,
              url: result.url,
              domain: result.domain,
              risk_score: result.riskScore,
              risk_level: result.riskLevel
            })
            .select('id')
            .single();

          if (!scanError && scanRow?.id) {
            savedScanId = scanRow.id;

            // 2. Insert scan findings into public.scan_findings
            if (result.findings && result.findings.length > 0) {
              const findingsRows = result.findings.map((f) => ({
                scan_id: savedScanId,
                category: f.category,
                title: f.title,
                severity: f.severity,
                description: f.description,
                risk_points: f.riskPoints
              }));

              const { error: findingsError } = await supabase
                .from('scan_findings')
                .insert(findingsRows);

              if (findingsError) {
                console.warn('Supabase scan_findings note:', findingsError.message);
              }
            }
          } else if (scanError) {
            console.warn(
              'Supabase scans table note: Could not persist to remote Supabase (run supabase/schema.sql in Supabase SQL Editor). Falling back to local persistence.',
              scanError.message
            );
          }
        } catch (sbErr: any) {
          console.warn('Supabase connection note, using local persistence fallback:', sbErr?.message || sbErr);
        }

        // Always ensure saved locally so report page and history work seamlessly
        const localItem = saveLocalScanToStorage(
          { ...result, id: savedScanId || undefined },
          currentUserId
        );
        if (!savedScanId) {
          savedScanId = String(localItem.id);
        }
      }

      return {
        success: true,
        data: {
          id: savedScanId,
          ...result
        }
      };
    } catch (err: any) {
      console.error('Analysis error:', err);
      return {
        success: false,
        message: err.message || 'An unexpected error occurred while analyzing the website.'
      };
    }
  },

  /**
   * Fetches scan records for the current authenticated user from Supabase with local fallback.
   */
  async getScans(): Promise<ApiResponse<StoredScanItem[]>> {
    try {
      let formatted: StoredScanItem[] = [];

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: scans, error } = await supabase
            .from('scans')
            .select(`
              id,
              user_id,
              url,
              domain,
              risk_score,
              risk_level,
              created_at,
              scan_findings (id)
            `)
            .order('created_at', { ascending: false });

          if (!error && scans) {
            formatted = scans.map((s: any) => ({
              id: s.id,
              userId: s.user_id,
              url: s.url,
              domain: s.domain,
              riskScore: s.risk_score,
              riskLevel: s.risk_level,
              createdAt: s.created_at,
              findingsCount: Array.isArray(s.scan_findings) ? s.scan_findings.length : 0
            }));
          }
        }
      } catch (err) {
        console.warn('Supabase scan fetch note:', err);
      }

      // Merge with locally stored scans
      const localScans = getLocalScansFromStorage();
      const existingIds = new Set(formatted.map((s) => String(s.id)));
      for (const loc of localScans) {
        if (!existingIds.has(String(loc.id))) {
          formatted.push(loc);
        }
      }

      // Sort by creation date descending
      formatted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        success: true,
        data: formatted
      };
    } catch (err: any) {
      console.error('getScans error:', err);
      return {
        success: true,
        data: getLocalScansFromStorage()
      };
    }
  },

  /**
   * Fetches an individual scan and its associated findings by ID from Supabase or local cache.
   */
  async getScanById(id: string | number): Promise<ApiResponse<AnalysisResult>> {
    try {
      const strId = String(id);

      // 1. Try Supabase
      try {
        const { data: scan, error: scanError } = await supabase
          .from('scans')
          .select('*')
          .eq('id', strId)
          .maybeSingle();

        if (!scanError && scan) {
          // Fetch findings
          const { data: findingsRows } = await supabase
            .from('scan_findings')
            .select('*')
            .eq('scan_id', strId)
            .order('risk_points', { ascending: false });

          const findings: ScanFinding[] = (findingsRows || []).map((f: any) => ({
            id: f.id,
            scanId: f.scan_id,
            category: f.category,
            title: f.title,
            severity: f.severity,
            description: f.description,
            riskPoints: f.risk_points
          }));

          const { explanation, recommendations } = getExplanationsAndRecommendations(scan.risk_level);

          return {
            success: true,
            data: {
              id: scan.id,
              url: scan.url,
              domain: scan.domain,
              riskScore: scan.risk_score,
              riskLevel: scan.risk_level,
              findings,
              explanation,
              recommendations,
              analyzedAt: scan.created_at
            }
          };
        }
      } catch (sbErr) {
        console.warn('Supabase getScanById note:', sbErr);
      }

      // 2. Fallback to local storage
      const localDetail = getLocalScanDetailFromStorage(strId);
      if (localDetail) {
        return {
          success: true,
          data: localDetail
        };
      }

      return {
        success: false,
        message: 'Scan record was not found or you do not have permission to view it.'
      };
    } catch (err: any) {
      console.error('getScanById error:', err);
      return {
        success: false,
        message: err?.message || 'Failed to load scan details.'
      };
    }
  },

  /**
   * Deletes a scan record from Supabase and local cache.
   */
  async deleteScan(id: string | number): Promise<ApiResponse<null>> {
    try {
      const strId = String(id);
      deleteLocalScanFromStorage(strId);

      try {
        await supabase
          .from('scans')
          .delete()
          .eq('id', strId);
      } catch (err) {
        console.warn('Supabase deleteScan note:', err);
      }

      return {
        success: true,
        data: null
      };
    } catch (err: any) {
      console.error('deleteScan error:', err);
      return {
        success: false,
        message: err?.message || 'Error occurred while deleting scan record.'
      };
    }
  },

  /**
   * Computes real statistics from scan history for the current authenticated user.
   */
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const scansRes = await this.getScans();
      const allScans = scansRes.data || [];
      const totalScans = allScans.length;
      let lowRisk = 0;
      let mediumRisk = 0;
      let highRisk = 0;

      for (const s of allScans) {
        if (s.riskLevel === 'LOW') lowRisk++;
        else if (s.riskLevel === 'MEDIUM') mediumRisk++;
        else if (s.riskLevel === 'HIGH') highRisk++;
      }

      const recentScans: StoredScanItem[] = allScans.slice(0, 5);

      return {
        success: true,
        data: {
          totalScans,
          lowRisk,
          mediumRisk,
          highRisk,
          recentScans
        }
      };
    } catch (err: any) {
      console.error('getDashboardStats error:', err);
      return {
        success: false,
        message: err?.message || 'Error loading dashboard statistics.'
      };
    }
  }
};
