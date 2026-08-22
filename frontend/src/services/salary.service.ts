import apiClient from '@/api/client';
import type { ApiResponse } from '@/types/common.types';
import type { SalaryRecord } from '@/types/salary.types';

export interface BackendSalaryComponent {
  id?: string;
  code: string;
  name: string;
  calculationType: 'FIXED_AMOUNT' | 'PERCENTAGE';
  calculationBasis?: 'WAGE' | 'BASIC_SALARY' | 'GROSS_SALARY' | null;
  value: number | string;
  amount?: number | string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface BackendPFConfig {
  employeeRate?: number | string;
  employerRate?: number | string;
  isActive?: boolean;
}

export interface BackendTaxConfig {
  professionalTax?: number | string;
  isActive?: boolean;
}

export interface UpdateSalaryStructurePayload {
  monthlyWage?: number | string;
  wageType?: 'FIXED';
  workingDaysPerWeek?: number;
  breakTimeHours?: number | string;
  components?: BackendSalaryComponent[];
  pf?: BackendPFConfig;
  tax?: BackendTaxConfig;
}

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

export async function getEmployeeSalaryStructure(employeeId: string) {
  const res = await apiClient.get<ApiResponse<any>>(`/employees/${employeeId}/salary`);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch salary structure');
  return res.data.data;
}

export async function updateEmployeeSalaryStructure(employeeId: string, payload: UpdateSalaryStructurePayload) {
  const res = await apiClient.put<ApiResponse<any>>(`/employees/${employeeId}/salary`, payload);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to update salary structure');
  return res.data.data;
}

export async function updateEmployeeSalaryComponents(employeeId: string, components: BackendSalaryComponent[]) {
  const res = await apiClient.put<ApiResponse<any>>(`/employees/${employeeId}/salary/components`, { components });
  if (!res.data.data) throw new Error(res.data.message || 'Failed to update salary components');
  return res.data.data;
}

export async function updateEmployeePFConfig(employeeId: string, pf: BackendPFConfig) {
  const res = await apiClient.put<ApiResponse<any>>(`/employees/${employeeId}/salary/pf`, pf);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to update PF config');
  return res.data.data;
}

export async function updateEmployeeTaxConfig(employeeId: string, tax: BackendTaxConfig) {
  const res = await apiClient.put<ApiResponse<any>>(`/employees/${employeeId}/salary/tax`, tax);
  if (!res.data.data) throw new Error(res.data.message || 'Failed to update tax config');
  return res.data.data;
}
