import { Request, Response } from 'express';
import { supabase, getAuthenticatedSupabaseClient } from '../database/db';
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
      let savedScanId: string | null = null;

      // If user is authenticated, persist the scan and its findings to Supabase
      if (req.user && req.user.userId) {
        const client = req.token ? getAuthenticatedSupabaseClient(req.token) : supabase;

        const { data: scanRow, error: scanError } = await client
          .from('scans')
          .insert({
            user_id: req.user.userId,
            url: result.url,
            domain: result.domain,
            risk_score: result.riskScore,
            risk_level: result.riskLevel
          })
          .select('id')
          .single();

        if (!scanError && scanRow?.id) {
          savedScanId = scanRow.id;

          // Insert findings if present
          if (result.findings && result.findings.length > 0) {
            const findingsRows = result.findings.map((f) => ({
              scan_id: savedScanId,
              category: f.category,
              title: f.title,
              severity: f.severity,
              description: f.description,
              risk_points: f.riskPoints
            }));

            const { error: findingsError } = await client
              .from('scan_findings')
              .insert(findingsRows);

            if (findingsError) {
              console.warn('Supabase scan_findings insert note:', findingsError.message);
            }
          }
        } else if (scanError) {
          console.warn('Supabase scan insert note:', scanError.message);
        }
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
      const client = req.token ? getAuthenticatedSupabaseClient(req.token) : supabase;

      const { data: scans, error } = await client
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
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formatted = (scans || []).map((s: any) => ({
        id: s.id,
        userId: s.user_id,
        url: s.url,
        domain: s.domain,
        riskScore: s.risk_score,
        riskLevel: s.risk_level,
        createdAt: s.created_at,
        findingsCount: Array.isArray(s.scan_findings) ? s.scan_findings.length : 0
      }));

      res.status(200).json({
        success: true,
        data: formatted
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
      const scanId = req.params.id;
      const userId = req.user!.userId;

      if (!scanId) {
        res.status(400).json({
          success: false,
          message: 'Invalid scan ID.'
        });
        return;
      }

      const client = req.token ? getAuthenticatedSupabaseClient(req.token) : supabase;

      const { data: scan, error: scanError } = await client
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .maybeSingle();

      if (scanError || !scan) {
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
      const { data: findingsRows } = await client
        .from('scan_findings')
        .select('*')
        .eq('scan_id', scanId)
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

      // Reconstruct explanation and recommendations based on risk level
      let explanation = '';
      const recommendations: string[] = [];

      if (scan.risk_level === 'LOW') {
        explanation =
          'The submitted URL uses HTTPS and follows a conventional domain structure. No major suspicious URL characteristics were identified by the current analysis rules.';
        recommendations.push(
          'No major suspicious URL characteristics were detected. Continue to use normal browsing precautions.',
          'Always double-check the browser address bar to verify that the domain name matches your intended destination.',
          'Ensure your browser and operating system security updates are kept current.'
        );
      } else if (scan.risk_level === 'MEDIUM') {
        explanation =
          'The URL contains some characteristics that require caution. Review the domain carefully before entering credentials or personal information.';
        recommendations.push(
          'Use caution. Verify the domain independently before entering credentials, financial information, or personal data.',
          'Check if the domain name has unusual spellings, unexpected subdomains, or extra hyphens compared to the official brand.',
          'If you received this URL via an unexpected email, SMS, or direct message, navigate to the service directly via a bookmark or trusted search engine.'
        );
      } else {
        explanation =
          'The URL contains multiple characteristics commonly associated with suspicious links. Exercise strong caution and independently verify the website before entering sensitive information.';
        recommendations.push(
          "Exercise strong caution. Avoid entering passwords, financial information, or sensitive personal data unless the website's legitimacy is independently verified.",
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
          riskScore: scan.risk_score,
          riskLevel: scan.risk_level,
          findings,
          explanation,
          recommendations,
          analyzedAt: scan.created_at
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
      const scanId = req.params.id;
      const userId = req.user!.userId;

      if (!scanId) {
        res.status(400).json({
          success: false,
          message: 'Invalid scan ID.'
        });
        return;
      }

      const client = req.token ? getAuthenticatedSupabaseClient(req.token) : supabase;

      const { data: scan } = await client
        .from('scans')
        .select('id, user_id')
        .eq('id', scanId)
        .maybeSingle();

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

      await client.from('scans').delete().eq('id', scanId);

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
