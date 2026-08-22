import { useState, useMemo } from 'react';
import { Search, Calendar, Download } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { mockAttendanceRecords } from '@/data/adminAttendanceMock';

const statusConfig = {
  PRESENT: { label: 'Present', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  ABSENT: { label: 'Absent', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-400' },
  HALF_DAY: { label: 'Half Day', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  LEAVE: { label: 'On Leave', bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
};

export default function AdminAttendancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [date] = useState('22 Aug 2026');

  const filtered = useMemo(() => {
    return mockAttendanceRecords.filter((r) => {
      const matchSearch =
        !search ||
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        r.department.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const summary = useMemo(() => {
    const total = mockAttendanceRecords.length;
    const present = mockAttendanceRecords.filter((r) => r.status === 'PRESENT').length;
    const absent = mockAttendanceRecords.filter((r) => r.status === 'ABSENT').length;
    const halfDay = mockAttendanceRecords.filter((r) => r.status === 'HALF_DAY').length;
    const leave = mockAttendanceRecords.filter((r) => r.status === 'LEAVE').length;
    return { total, present, absent, halfDay, leave };
  }, []);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
            <p className="mt-1 text-sm text-gray-500">View and manage attendance for all employees.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Present', value: summary.present, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Absent', value: summary.absent, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Half Day', value: summary.halfDay, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'On Leave', value: summary.leave, color: 'text-violet-600', bg: 'bg-violet-50' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border border-gray-100 bg-white p-4 shadow-card`}>
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${stat.bg} p-2`}>
                  <Calendar size={16} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-card sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700">{date}</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="ALL">All Status</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="LEAVE">On Leave</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">Employee</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">Department</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 sm:table-cell">Check In</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 sm:table-cell">Check Out</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 md:table-cell">Hours</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((record) => {
                  const cfg = statusConfig[record.status];
                  return (
                    <tr key={record.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{record.employeeName}</p>
                          <p className="text-xs text-gray-400">{record.employeeId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.department}</td>
                      <td className="hidden px-6 py-4 text-sm text-gray-600 sm:table-cell">{record.checkIn ?? '-'}</td>
                      <td className="hidden px-6 py-4 text-sm text-gray-600 sm:table-cell">{record.checkOut ?? '-'}</td>
                      <td className="hidden px-6 py-4 text-sm text-gray-600 md:table-cell">{record.workHours ? `${record.workHours}h` : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${cfg.bg} ${cfg.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-900">No records found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
