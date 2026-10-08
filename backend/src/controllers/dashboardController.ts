import { Request, Response } from 'express';
import { supabase, getAuthenticatedSupabaseClient } from '../database/db';

export class DashboardController {
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const client = req.token ? getAuthenticatedSupabaseClient(req.token) : supabase;

      const { data: scans, error } = await client
        .from('scans')
        .select('id, url, domain, risk_score, risk_level, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const allScans = scans || [];
      const totalScans = allScans.length;
      let lowRisk = 0;
      let mediumRisk = 0;
      let highRisk = 0;

      for (const s of allScans) {
        if (s.risk_level === 'LOW') lowRisk++;
        else if (s.risk_level === 'MEDIUM') mediumRisk++;
        else if (s.risk_level === 'HIGH') highRisk++;
      }

      const recentScans = allScans.slice(0, 5).map((s: any) => ({
        id: s.id,
        url: s.url,
        domain: s.domain,
        riskScore: s.risk_score,
        riskLevel: s.risk_level,
        createdAt: s.created_at
      }));

      res.status(200).json({
        success: true,
        data: {
          totalScans,
          lowRisk,
          mediumRisk,
          highRisk,
          recentScans
        }
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to retrieve dashboard statistics.'
      });
    }
  }
}
