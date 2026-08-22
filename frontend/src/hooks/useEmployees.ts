import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as employeeApi from '@/services/employee.service';
import type {
  EmployeeQueryParams,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from '@/services/employee.service';

export function useEmployees(params?: EmployeeQueryParams) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeeApi.getEmployees(params),
  });
}

export function useEmployeeById(id: string) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: !!id,
  });
}

export function useCurrentEmployee() {
  return useQuery({
    queryKey: ['employees', 'me'],
    queryFn: () => employeeApi.getCurrentEmployee(),
  });
}

export function useCompanyStats() {
  return useQuery({
    queryKey: ['employees', 'stats'],
    queryFn: () => employeeApi.getCompanyStats(),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeeApi.createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeePayload }) =>
      employeeApi.updateEmployee(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', variables.id] });
    },
  });
}

export function useUpdateEmployeeStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' }) =>
      employeeApi.updateEmployeeStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', variables.id] });
    },
  });
}
