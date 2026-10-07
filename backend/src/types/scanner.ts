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
  url: string;
  domain: string;
  riskScore: number;
  riskLevel: RiskLevel;
  findings: ScanFinding[];
  explanation: string;
  recommendations: string[];
  analyzedAt: string;
}

export interface StoredScan {
  id: number;
  userId?: number | null;
  url: string;
  domain: string;
  riskScore: number;
  riskLevel: RiskLevel;
  createdAt: string;
  findings?: ScanFinding[];
}

export interface DashboardStats {
  totalScans: number;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
}
