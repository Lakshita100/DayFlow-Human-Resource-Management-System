export type LeaveType = 'paid' | 'sick' | 'unpaid';
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
  pending: number;
  available: number;
  color: string;
}

export interface LeaveBalanceSummary {
  totalAvailable: number;
  balances: LeaveBalance[];
}

export interface LeaveRequest {
  id: string;
  leaveType: LeaveType;
  leaveTypeLabel: string;
  startDate: string;
  endDate: string;
  days: number;
  appliedOn: string;
  status: LeaveRequestStatus;
  remarks: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  rejectionReason?: string | null;
  approvedBy?: string | null;
  approvedOn?: string | null;
  adminComment?: string | null;
}

export interface UpcomingLeave {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveRequestStatus;
}

export interface LeaveRequestFilters {
  status: LeaveRequestStatus | 'all';
  leaveType: LeaveType | 'all';
}

export interface LeaveQueryParams {
  page: number;
  limit: number;
  status: LeaveRequestStatus | 'all';
  leaveType: LeaveType | 'all';
}

export interface LeavePaginatedResponse {
  requests: LeaveRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateLeavePayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  remarks: string;
  attachment?: File | null;
}
