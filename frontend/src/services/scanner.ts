import { request, ApiResponse } from './api';
import { AnalysisResult, DashboardStats, StoredScanItem } from '../types/scanner';

export const scannerService = {
  async analyze(url: string): Promise<ApiResponse<AnalysisResult>> {
    return request<ApiResponse<AnalysisResult>>('/scans/analyze', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  },

  async getScans(): Promise<ApiResponse<StoredScanItem[]>> {
    return request<ApiResponse<StoredScanItem[]>>('/scans', {
      method: 'GET'
    });
  },

  async getScanById(id: number): Promise<ApiResponse<AnalysisResult>> {
    return request<ApiResponse<AnalysisResult>>(`/scans/${id}`, {
      method: 'GET'
    });
  },

  async deleteScan(id: number): Promise<ApiResponse<null>> {
    return request<ApiResponse<null>>(`/scans/${id}`, {
      method: 'DELETE'
    });
  },

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return request<ApiResponse<DashboardStats>>('/dashboard/stats', {
      method: 'GET'
    });
  }
};
