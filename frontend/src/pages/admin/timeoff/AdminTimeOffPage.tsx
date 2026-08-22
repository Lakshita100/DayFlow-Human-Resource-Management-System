import { useState, useMemo } from 'react';
import { Search, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { mockTimeOffRequests } from '@/data/adminTimeOffMock';
import type { AdminTimeOffRequest } from '@/types/admin-pages.types';

const statusConfig = {
  PENDING: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  APPROVED: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  REJECTED: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-400' },
};

const typeConfig: Record<string, string> = {
  PAID: 'bg-violet-50 text-violet-700',
  SICK: 'bg-amber-50 text-amber-700',
  UNPAID: 'bg-gray-50 text-gray-600',
};

export default function AdminTimeOffPage() {
  const [requests, setRequests] = useState<AdminTimeOffRequest[]>(mockTimeOffRequests);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        !search ||
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        r.department.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchTab = activeTab === 'pending' ? r.status === 'PENDING' : true;
      return matchSearch && matchStatus && matchTab;
    });
  }, [requests, search, statusFilter, activeTab]);

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  function handleAction(id: string, action: 'APPROVED' | 'REJECTED') {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time-Off Management</h1>
          <p className="mt-1 text-sm text-gray-500">Review and manage employee leave requests.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending', value: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
            { label: 'Approved', value: requests.filter((r) => r.status === 'APPROVED').length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
            { label: 'Rejected', value: requests.filter((r) => r.status === 'REJECTED').length, color: 'text-rose-600', bg: 'bg-rose-50', icon: XCircle },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg ${stat.bg} p-2`}>
                    <Icon size={16} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'pending' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'all' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              All Requests
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((req) => {
            const status = statusConfig[req.status];
            return (
              <div key={req.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-card transition-all hover:shadow-md">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                      {req.employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{req.employeeName}</p>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${typeConfig[req.type]}`}>
                          {req.type} Leave
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">{req.employeeId} &middot; {req.department} &middot; {req.designation}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {req.startDate} &ndash; {req.endDate} ({req.days} day{req.days > 1 ? 's' : ''})
                      </p>
                      {req.reason && (
                        <p className="mt-1 text-xs text-gray-400 italic">&quot;{req.reason}&quot;</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.bg} ${status.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                    {req.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(req.id, 'REJECTED')}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'APPROVED')}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white py-12 text-center shadow-card">
              <CheckCircle size={40} className="mb-3 text-emerald-400" />
              <p className="text-sm font-medium text-gray-900">You&apos;re all caught up.</p>
              <p className="mt-1 text-xs text-gray-500">No leave requests to review.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
