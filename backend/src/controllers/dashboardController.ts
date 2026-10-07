import { Request, Response } from 'express';
import { db } from '../database/db';

export class DashboardController {
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const totalRow = db.prepare(`
        SELECT COUNT(*) as count FROM scans WHERE user_id = ?
      `).get(userId) as any;

      const lowRow = db.prepare(`
        SELECT COUNT(*) as count FROM scans WHERE user_id = ? AND risk_level = 'LOW'
      `).get(userId) as any;

      const mediumRow = db.prepare(`
        SELECT COUNT(*) as count FROM scans WHERE user_id = ? AND risk_level = 'MEDIUM'
      `).get(userId) as any;

      const highRow = db.prepare(`
        SELECT COUNT(*) as count FROM scans WHERE user_id = ? AND risk_level = 'HIGH'
      `).get(userId) as any;

      const recentScans = db.prepare(`
        SELECT id, url, domain, risk_score as riskScore, risk_level as riskLevel, created_at as createdAt
        FROM scans
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 5
      `).all(userId);

      res.status(200).json({
        success: true,
        data: {
          totalScans: totalRow?.count || 0,
          lowRisk: lowRow?.count || 0,
          mediumRisk: mediumRow?.count || 0,
          highRisk: highRow?.count || 0,
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
