import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as salaryApi from '@/services/salary.service';
import { getMockSalaryRecord, getMockSalaryHistory, salaryMonths } from '@/data/mockSalary';
import type { SalaryRecord, SalaryMonth } from '@/types/salary.types';
import type {
  UpdateSalaryStructurePayload,
  BackendSalaryComponent,
  BackendPFConfig,
  BackendTaxConfig,
} from '@/services/salary.service';

export function useSalaryRecord(month: string, year: number) {
  return useQuery<SalaryRecord>({
    queryKey: ['salary', 'record', month, year],
    queryFn: () => salaryApi.getSalaryRecord(month, year),
  });
}

export function useSalaryRecordMock(month: string, year: number): SalaryRecord | null {
  const query = useSalaryRecord(month, year);
  return query.data ?? getMockSalaryRecord(month, year);
}

export function useSalaryHistory() {
  return useQuery<SalaryRecord[]>({
    queryKey: ['salary', 'history'],
    queryFn: () => salaryApi.getSalaryHistory(),
  });
}

export function useSalaryHistoryMock(): SalaryRecord[] {
  const query = useSalaryHistory();
  return query.data ?? getMockSalaryHistory();
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

// BACKEND-CONNECTED SALARY HOOKS

export function useEmployeeSalaryStructure(employeeId: string) {
  return useQuery({
    queryKey: ['salary', 'structure', employeeId],
    queryFn: () => salaryApi.getEmployeeSalaryStructure(employeeId),
    enabled: !!employeeId,
  });
}

export function useUpdateEmployeeSalaryStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, payload }: { employeeId: string; payload: UpdateSalaryStructurePayload }) =>
      salaryApi.updateEmployeeSalaryStructure(employeeId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['salary', 'structure', variables.employeeId] });
    },
  });
}

export function useUpdateEmployeeSalaryComponents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, components }: { employeeId: string; components: BackendSalaryComponent[] }) =>
      salaryApi.updateEmployeeSalaryComponents(employeeId, components),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['salary', 'structure', variables.employeeId] });
    },
  });
}

export function useUpdateEmployeePFConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, pf }: { employeeId: string; pf: BackendPFConfig }) =>
      salaryApi.updateEmployeePFConfig(employeeId, pf),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['salary', 'structure', variables.employeeId] });
    },
  });
}

export function useUpdateEmployeeTaxConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, tax }: { employeeId: string; tax: BackendTaxConfig }) =>
      salaryApi.updateEmployeeTaxConfig(employeeId, tax),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['salary', 'structure', variables.employeeId] });
    },
  });
}
