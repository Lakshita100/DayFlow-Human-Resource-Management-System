import { useState, useMemo, useCallback } from 'react';
import { Search, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { PageTabs } from '@/components/ui/Tabs';
import Tabs from '@/components/ui/Tabs';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { mockTimeOffRequests, mockLeaveBalances } from '@/data/adminTimeOffMock';
import LeaveBalanceCards from './LeaveBalanceCards';
import TimeOffRequestTable from './TimeOffRequestTable';
import TimeOffRequestCard from './TimeOffRequestCard';
import { TimeOffBalanceSkeleton, TimeOffTableSkeleton } from './TimeOffSkeleton';
import type { AdminTimeOffRequest } from '@/types/admin-pages.types';

export default function AdminTimeOffPage() {
  const [requests, setRequests] = useState<AdminTimeOffRequest[]>(mockTimeOffRequests);
  const [search, setSearch] = useState('');
  const [pageTab, setPageTab] = useState('timeoff');
  const [requestTab, setRequestTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [rejectTarget, setRejectTarget] = useState<AdminTimeOffRequest | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        !search ||
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        r.type.toLowerCase().includes(search.toLowerCase());
      const matchTab = requestTab === 'pending' ? r.status === 'PENDING' : true;
      return matchSearch && matchTab;
    });
  }, [requests, search, requestTab]);

  const handleApprove = useCallback((id: string) => {
    setLoadingId(id);
    setTimeout(() => {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' as const } : r)));
      setLoadingId(null);
    }, 600);
  }, []);

  const handleRejectClick = useCallback((id: string) => {
    const req = requests.find((r) => r.id === id);
    if (req) setRejectTarget(req);
  }, [requests]);

  const handleRejectConfirm = useCallback(() => {
    if (!rejectTarget) return;
    setRejectLoading(true);
    setTimeout(() => {
      setRequests((prev) => prev.map((r) => (r.id === rejectTarget.id ? { ...r, status: 'REJECTED' as const } : r)));
      setRejectLoading(false);
      setRejectTarget(null);
    }, 600);
  }, [rejectTarget]);

  const handleRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, []);

  return (
    <PageContainer>
      <div className="space-y-5">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Off</h1>
          <p className="mt-0.5 text-sm text-gray-500">Review and manage employee leave requests.</p>
        </div>

        {/* Page Tabs: Time Off / Allocation */}
        <PageTabs
          tabs={[
            { key: 'timeoff', label: 'Time Off' },
            { key: 'allocation', label: 'Allocation' },
          ]}
          active={pageTab}
          onChange={setPageTab}
        />

        {pageTab === 'timeoff' && (
          <>
            {/* Toolbar: New + Search */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100">
                <Plus size={16} />
                New
              </button>
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white py-12 text-center shadow-card">
                <div className="mb-3 rounded-full bg-rose-50 p-3">
                  <AlertTriangle size={24} className="text-rose-500" />
                </div>
                <p className="text-sm font-medium text-gray-900">Unable to load time-off requests.</p>
                <p className="mt-1 text-xs text-gray-500">Something went wrong while fetching data.</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                  <RefreshCw size={14} />
                  Try Again
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && !error && (
              <div className="space-y-5">
                <TimeOffBalanceSkeleton />
                <TimeOffTableSkeleton />
              </div>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                {/* Leave Balance Cards */}
                <LeaveBalanceCards balances={mockLeaveBalances} />

                {/* Request Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Time Off Requests</h2>
                  </div>

                  <Tabs
                    tabs={[
                      { key: 'pending', label: 'Pending', count: pendingCount },
                      { key: 'all', label: 'All Requests' },
                    ]}
                    active={requestTab}
                    onChange={setRequestTab}
                  />

                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <TimeOffRequestTable
                      requests={filtered}
                      onApprove={handleApprove}
                      onReject={handleRejectClick}
                      loadingId={loadingId}
                    />
                  </div>

                  {/* Mobile Cards */}
                  <div className="space-y-3 md:hidden">
                    {filtered.map((req) => (
                      <TimeOffRequestCard
                        key={req.id}
                        request={req}
                        onApprove={handleApprove}
                        onReject={handleRejectClick}
                        loading={loadingId === req.id}
                      />
                    ))}
                    {filtered.length === 0 && (
                      <EmptyState
                        icon={<Search size={40} />}
                        title={search ? 'No matching requests found.' : requestTab === 'pending' ? "You're all caught up." : 'No time-off requests yet.'}
                        description={search ? 'Try searching by employee name or ID.' : requestTab === 'pending' ? 'No pending time-off requests require your attention.' : 'No time-off requests have been submitted.'}
                      />
                    )}
                  </div>

                  {/* Desktop Empty */}
                  {filtered.length === 0 && (
                    <div className="hidden md:block">
                      <EmptyState
                        icon={<Search size={40} />}
                        title={search ? 'No matching requests found.' : requestTab === 'pending' ? "You're all caught up." : 'No time-off requests yet.'}
                        description={search ? 'Try searching by employee name or ID.' : requestTab === 'pending' ? 'No pending time-off requests require your attention.' : 'No time-off requests have been submitted.'}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {pageTab === 'allocation' && (
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-card">
            <p className="text-sm font-medium text-gray-900">Allocation</p>
            <p className="mt-1 text-xs text-gray-500">Leave allocation management coming soon.</p>
          </div>
        )}
      </div>

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        open={rejectTarget !== null}
        title="Reject Leave Request?"
        description={
          rejectTarget
            ? `Are you sure you want to reject ${rejectTarget.employeeName}'s ${rejectTarget.type === 'PAID' ? 'Paid' : rejectTarget.type === 'SICK' ? 'Sick' : 'Unpaid'} Time Off request (${rejectTarget.startDate} - ${rejectTarget.endDate})?`
            : ''
        }
        confirmLabel="Reject Request"
        confirmColor="bg-rose-600 hover:bg-rose-700"
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectTarget(null)}
        loading={rejectLoading}
      />
    </PageContainer>
  );
}
