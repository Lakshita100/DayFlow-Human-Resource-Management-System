import type {
  LeaveBalanceSummary,
  LeaveRequest,
  UpcomingLeave,
  LeavePaginatedResponse,
  LeaveQueryParams,
} from '@/types/leave.types';

export const mockLeaveBalance: LeaveBalanceSummary = {
  totalAvailable: 12,
  balances: [
    { type: 'paid', label: 'Paid Leave', total: 12, used: 4, pending: 0, available: 8, color: '#7c3aed' },
    { type: 'sick', label: 'Sick Leave', total: 6, used: 3, pending: 0, available: 3, color: '#f59e0b' },
    { type: 'unpaid', label: 'Unpaid Leave', total: 3, used: 2, pending: 0, available: 1, color: '#6b7280' },
  ],
};

const mockRequests: LeaveRequest[] = [
  {
    id: 'lr-001',
    leaveType: 'sick',
    leaveTypeLabel: 'Sick Leave',
    startDate: '2026-05-22',
    endDate: '2026-05-24',
    days: 3,
    appliedOn: '2026-05-18',
    status: 'pending',
    remarks: 'Medical appointment and recovery',
    attachmentUrl: null,
    attachmentName: null,
  },
  {
    id: 'lr-002',
    leaveType: 'paid',
    leaveTypeLabel: 'Paid Leave',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    days: 3,
    appliedOn: '2026-06-02',
    status: 'approved',
    remarks: 'Personal work',
    approvedBy: 'Priya Mehta',
    approvedOn: '2026-06-03',
  },
  {
    id: 'lr-003',
    leaveType: 'sick',
    leaveTypeLabel: 'Sick Leave',
    startDate: '2026-04-15',
    endDate: '2026-04-16',
    days: 2,
    appliedOn: '2026-04-14',
    status: 'approved',
    remarks: 'Fever and cold',
    approvedBy: 'Priya Mehta',
    approvedOn: '2026-04-14',
  },
  {
    id: 'lr-004',
    leaveType: 'paid',
    leaveTypeLabel: 'Paid Leave',
    startDate: '2026-03-20',
    endDate: '2026-03-20',
    days: 1,
    appliedOn: '2026-03-15',
    status: 'rejected',
    remarks: 'Family function',
    rejectionReason: 'Please coordinate with the team as there is a sprint deadline on that date.',
  },
  {
    id: 'lr-005',
    leaveType: 'unpaid',
    leaveTypeLabel: 'Unpaid Leave',
    startDate: '2026-02-10',
    endDate: '2026-02-11',
    days: 2,
    appliedOn: '2026-02-05',
    status: 'approved',
    remarks: 'Personal travel',
    approvedBy: 'Priya Mehta',
    approvedOn: '2026-02-06',
  },
  {
    id: 'lr-006',
    leaveType: 'paid',
    leaveTypeLabel: 'Paid Leave',
    startDate: '2026-07-01',
    endDate: '2026-07-03',
    days: 3,
    appliedOn: '2026-06-25',
    status: 'pending',
    remarks: 'Vacation',
  },
  {
    id: 'lr-007',
    leaveType: 'sick',
    leaveTypeLabel: 'Sick Leave',
    startDate: '2026-01-10',
    endDate: '2026-01-10',
    days: 1,
    appliedOn: '2026-01-09',
    status: 'approved',
    remarks: 'Migraine',
    approvedBy: 'Priya Mehta',
    approvedOn: '2026-01-09',
  },
  {
    id: 'lr-008',
    leaveType: 'paid',
    leaveTypeLabel: 'Paid Leave',
    startDate: '2026-05-05',
    endDate: '2026-05-07',
    days: 3,
    appliedOn: '2026-05-01',
    status: 'approved',
    remarks: 'Family event',
    approvedBy: 'Priya Mehta',
    approvedOn: '2026-05-02',
  },
];

export const mockUpcomingLeaves: UpcomingLeave[] = [
  {
    id: 'lr-001',
    leaveType: 'Sick Leave',
    startDate: '2026-05-22',
    endDate: '2026-05-24',
    days: 3,
    status: 'pending',
  },
  {
    id: 'lr-006',
    leaveType: 'Paid Leave',
    startDate: '2026-07-01',
    endDate: '2026-07-03',
    days: 3,
    status: 'pending',
  },
];

export function getMockLeavePage(params: LeaveQueryParams): LeavePaginatedResponse {
  let filtered = mockRequests;

  if (params.status !== 'all') {
    filtered = filtered.filter((r) => r.status === params.status);
  }
  if (params.leaveType !== 'all') {
    filtered = filtered.filter((r) => r.leaveType === params.leaveType);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / params.limit);
  const start = (params.page - 1) * params.limit;
  const requests = filtered.slice(start, start + params.limit);

  return { requests, total, page: params.page, limit: params.limit, totalPages };
}

export function getMockAllLeaveRequests(): LeaveRequest[] {
  return mockRequests;
}
