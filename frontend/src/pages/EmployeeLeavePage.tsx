import { useState, useCallback } from 'react';
import { Plus, CalendarOff } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import LeaveSummaryCards from '@/components/leave/LeaveSummaryCards';
import LeaveBalanceOverview from '@/components/leave/LeaveBalanceOverview';
import UpcomingLeave from '@/components/leave/UpcomingLeave';
import LeaveRequestTable from '@/components/leave/LeaveRequestTable';
import ApplyLeaveModal from '@/components/leave/ApplyLeaveModal';
import LeaveRequestDetails from '@/components/leave/LeaveRequestDetails';
import EmptyState from '@/components/ui/EmptyState';
import { LeaveSummarySkeleton, LeaveTableSkeleton } from '@/components/ui/LeaveSkeleton';
import {
  useLeaveBalanceMock,
  useLeaveRequestsMock,
  useUpcomingLeavesMock,
} from '@/hooks/useLeave';
import type {
  LeaveRequest,
  LeaveRequestFilters,
  LeaveRequestStatus,
  CreateLeavePayload,
} from '@/types/leave.types';

export default function EmployeeLeavePage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeaveRequestFilters>({
    status: 'all',
    leaveType: 'all',
  });
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isLoading = false;

  const balance = useLeaveBalanceMock();
  const upcoming = useUpcomingLeavesMock();
  const requestsData = useLeaveRequestsMock({
    page,
    limit: 5,
    status: filters.status,
    leaveType: filters.leaveType,
  });

  const handleViewDetails = useCallback((request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  }, []);

  const handleApplyLeave = useCallback(async (_payload: CreateLeavePayload) => {
    await new Promise((r) => setTimeout(r, 1000));
    setIsApplyOpen(false);
  }, []);

  const handleFilterChange = useCallback((status: LeaveRequestStatus | 'all') => {
    setFilters((prev) => ({ ...prev, status }));
    setPage(1);
  }, []);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave & Time-Off</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your leave requests, balances and time off.
            </p>
          </div>
          <button
            onClick={() => setIsApplyOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            <Plus size={16} />
            Apply for Leave
          </button>
        </div>

        {isLoading ? (
          <>
            <LeaveSummarySkeleton />
            <LeaveTableSkeleton />
          </>
        ) : (
          <>
            {/* Summary Cards */}
            <LeaveSummaryCards data={balance} />

            {/* Balance + Upcoming */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <LeaveBalanceOverview />
              </div>
              <div>
                <UpcomingLeave leaves={upcoming} />
              </div>
            </div>

            {/* Request History */}
            <div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-semibold text-gray-900">Leave Requests</h2>
                <div className="flex items-center gap-2">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleFilterChange(status)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        filters.status === status
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {requestsData.requests.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white">
                  <EmptyState
                    icon={<CalendarOff className="h-12 w-12" />}
                    title="No leave requests yet."
                    description="Your submitted leave requests will appear here."
                    action={
                      <button
                        onClick={() => setIsApplyOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                      >
                        <Plus size={16} />
                        Apply for Leave
                      </button>
                    }
                  />
                </div>
              ) : (
                <LeaveRequestTable
                  requests={requestsData.requests}
                  total={requestsData.total}
                  page={requestsData.page}
                  totalPages={requestsData.totalPages}
                  onPageChange={setPage}
                  onViewDetails={handleViewDetails}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSubmit={handleApplyLeave}
      />

      <LeaveRequestDetails
        request={selectedRequest}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedRequest(null);
        }}
      />
    </PageContainer>
  );
}
