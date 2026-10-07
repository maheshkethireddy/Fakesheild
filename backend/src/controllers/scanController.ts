import { Request, Response } from 'express';
import { db } from '../database/db';
import { analyzeUrl } from '../services/urlAnalyzer';
import { ScanFinding } from '../types/scanner';

export class ScanController {
  static async analyze(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.body;
      if (!url) {
        res.status(400).json({
          success: false,
          message: 'Website URL is required for analysis.'
        });
        return;
      }

      const result = analyzeUrl(url);
      let savedScanId: number | null = null;

      // If user is authenticated, persist the scan and its findings
      if (req.user && req.user.userId) {
        const insertScan = db.prepare(`
          INSERT INTO scans (user_id, url, domain, risk_score, risk_level, created_at)
          VALUES (?, ?, ?, ?, ?, datetime('now'))
        `);

        const scanInsertResult = insertScan.run(
          req.user.userId,
          result.url,
          result.domain,
          result.riskScore,
          result.riskLevel
        );

        savedScanId = Number(scanInsertResult.lastInsertRowid);

        // Insert findings
        const insertFinding = db.prepare(`
          INSERT INTO scan_findings (scan_id, category, title, severity, description, risk_points, created_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `);

        const insertMany = db.transaction((findings: ScanFinding[], scanId: number) => {
          for (const finding of findings) {
            insertFinding.run(
              scanId,
              finding.category,
              finding.title,
              finding.severity,
              finding.description,
              finding.riskPoints
            );
          }
        });

        insertMany(result.findings, savedScanId);
      }

      res.status(200).json({
        success: true,
        data: {
          id: savedScanId,
          ...result
        }
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to analyze website URL.'
      });
    }
  }

  static async getUserScans(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const scans = db.prepare(`
        SELECT s.id, s.user_id, s.url, s.domain, s.risk_score as riskScore, s.risk_level as riskLevel, s.created_at as createdAt,
               COUNT(f.id) as findingsCount
        FROM scans s
        LEFT JOIN scan_findings f ON f.scan_id = s.id
        WHERE s.user_id = ?
        GROUP BY s.id
        ORDER BY s.created_at DESC
      `).all(userId);

      res.status(200).json({
        success: true,
        data: scans
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to retrieve scan history.'
      });
    }
  }

  static async getScanById(req: Request, res: Response): Promise<void> {
    try {
      const scanId = Number(req.params.id);
      const userId = req.user!.userId;

      if (!scanId || isNaN(scanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid scan ID.'
        });
        return;
      }

      const scan = db.prepare(`
        SELECT id, user_id, url, domain, risk_score as riskScore, risk_level as riskLevel, created_at as createdAt
        FROM scans
        WHERE id = ?
      `).get(scanId) as any;

      if (!scan) {
        res.status(404).json({
          success: false,
          message: 'Scan record not found.'
        });
        return;
      }

      // Check authorization - scan must belong to the logged-in user
      if (scan.user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'You are not authorized to view this scan record.'
        });
        return;
      }

      // Fetch findings
      const findings = db.prepare(`
        SELECT id, scan_id as scanId, category, title, severity, description, risk_points as riskPoints, created_at as createdAt
        FROM scan_findings
        WHERE scan_id = ?
        ORDER BY risk_points DESC, id ASC
      `).all(scanId) as any[];

      // Reconstruct explanation and recommendations based on risk level
      let explanation = '';
      const recommendations: string[] = [];

      if (scan.riskLevel === 'LOW') {
        explanation = 'The submitted URL uses HTTPS and follows a conventional domain structure. No major suspicious URL characteristics were identified by the current analysis rules.';
        recommendations.push(
          'No major suspicious URL characteristics were detected. Continue to use normal browsing precautions.',
          'Always double-check the browser address bar to verify that the domain name matches your intended destination.',
          'Ensure your browser and operating system security updates are kept current.'
        );
      } else if (scan.riskLevel === 'MEDIUM') {
        explanation = 'The URL contains some characteristics that require caution. Review the domain carefully before entering credentials or personal information.';
        recommendations.push(
          'Use caution. Verify the domain independently before entering credentials, financial information, or personal data.',
          'Check if the domain name has unusual spellings, unexpected subdomains, or extra hyphens compared to the official brand.',
          'If you received this URL via an unexpected email, SMS, or direct message, navigate to the service directly via a bookmark or trusted search engine.'
        );
      } else {
        explanation = 'The URL contains multiple characteristics commonly associated with suspicious links. Exercise strong caution and independently verify the website before entering sensitive information.';
        recommendations.push(
          'Exercise strong caution. Avoid entering passwords, financial information, or sensitive personal data unless the website\'s legitimacy is independently verified.',
          'Do not download or execute files from this link.',
          'Never trust security alerts, urgent account suspension notices, or unexpected prize claims received via unsolicited messages.',
          'If this link claims to be from your bank, email provider, or workplace, contact them through an official, verified support channel.'
        );
      }

      res.status(200).json({
        success: true,
        data: {
          id: scan.id,
          url: scan.url,
          domain: scan.domain,
          riskScore: scan.riskScore,
          riskLevel: scan.riskLevel,
          findings,
          explanation,
          recommendations,
          analyzedAt: scan.createdAt
        }
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to retrieve scan details.'
      });
    }
  }

  static async deleteScan(req: Request, res: Response): Promise<void> {
    try {
      const scanId = Number(req.params.id);
      const userId = req.user!.userId;

      if (!scanId || isNaN(scanId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid scan ID.'
        });
        return;
      }

      const scan = db.prepare('SELECT id, user_id FROM scans WHERE id = ?').get(scanId) as any;
      if (!scan) {
        res.status(404).json({
          success: false,
          message: 'Scan record not found.'
        });
        return;
      }

      if (scan.user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this scan record.'
        });
        return;
      }

      db.prepare('DELETE FROM scans WHERE id = ?').run(scanId);

      res.status(200).json({
        success: true,
        message: 'Scan record deleted successfully.'
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to delete scan record.'
      });
    }
  }
}
