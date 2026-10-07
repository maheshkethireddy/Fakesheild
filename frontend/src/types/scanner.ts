export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type FindingSeverity = 'SAFE' | 'INFO' | 'WARNING' | 'HIGH';

export interface ScanFinding {
  id?: number;
  scanId?: number;
  category: string;
  title: string;
  severity: FindingSeverity;
  description: string;
  riskPoints: number;
}

export interface AnalysisResult {
  id?: number | null;
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
  id: number;
  userId?: number;
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
