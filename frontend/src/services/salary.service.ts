import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type { SalaryRecord } from '@/types/salary.types';

export async function getSalaryRecord(month: string, year: number): Promise<SalaryRecord> {
  const res = await apiClient.get<ApiResponse<SalaryRecord>>('/salary', {
    params: { month, year },
  });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch salary record');
  return res.data.data;
}

export async function getSalaryHistory(): Promise<SalaryRecord[]> {
  const res = await apiClient.get<ApiResponse<SalaryRecord[]>>('/salary/history');
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch salary history');
  return res.data.data;
}

export async function downloadPayslip(month: string, year: number): Promise<Blob> {
  const res = await apiClient.get(`/salary/payslip/${month}/${year}`, {
    responseType: 'blob',
  });
  return res.data;
}
