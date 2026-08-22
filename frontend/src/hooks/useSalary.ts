import { useQuery, useMutation } from '@tanstack/react-query';
import * as salaryApi from '@/services/salary.service';
import { getMockSalaryRecord, getMockSalaryHistory, salaryMonths } from '@/data/mockSalary';
import type { SalaryRecord, SalaryMonth } from '@/types/salary.types';

const USE_MOCK = true;

export function useSalaryRecord(month: string, year: number) {
  return useQuery<SalaryRecord>({
    queryKey: ['salary', 'record', month, year],
    queryFn: () => salaryApi.getSalaryRecord(month, year),
    enabled: !USE_MOCK,
  });
}

export function useSalaryRecordMock(month: string, year: number): SalaryRecord | null {
  return getMockSalaryRecord(month, year);
}

export function useSalaryHistory() {
  return useQuery<SalaryRecord[]>({
    queryKey: ['salary', 'history'],
    queryFn: () => salaryApi.getSalaryHistory(),
    enabled: !USE_MOCK,
  });
}

export function useSalaryHistoryMock(): SalaryRecord[] {
  return getMockSalaryHistory();
}

export function useSalaryMonths(): SalaryMonth[] {
  return salaryMonths;
}

export function useDownloadPayslip() {
  return useMutation({
    mutationFn: ({ month, year }: { month: string; year: number }) =>
      salaryApi.downloadPayslip(month, year),
  });
}
