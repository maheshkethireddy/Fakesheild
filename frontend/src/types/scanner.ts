export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type FindingSeverity = 'SAFE' | 'INFO' | 'WARNING' | 'HIGH';

export interface ScanFinding {
  id?: string | number;
  scanId?: string | number;
  category: string;
  title: string;
  severity: FindingSeverity;
  description: string;
  riskPoints: number;
}

export interface AnalysisResult {
  id?: string | number | null;
  url: string;
  domain: string;
  riskScore: number;
  riskLevel: RiskLevel;
  findings: ScanFinding[];
  explanation: string;
  recommendations: string[];
  analyzedAt: string;
}

export interface StoredScanItem {
  id: string | number;
  userId?: string | number;
  url: string;
  domain: string;
  riskScore: number;
  riskLevel: RiskLevel;
  createdAt: string;
  findingsCount?: number;
}

export interface DashboardStats {
  totalScans: number;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  recentScans?: StoredScanItem[];
}
