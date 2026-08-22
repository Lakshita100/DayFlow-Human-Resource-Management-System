import { useState, useMemo } from 'react';
import { Search, Plus, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Mail, Phone, Briefcase, X } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { mockEmployees } from '@/data/adminEmployeesMock';
import type { EmployeeListItem } from '@/types/admin-pages.types';
import EmployeeResponsiveCard from '@/components/employee/EmployeeResponsiveCard';

const departments = ['All Departments', 'Engineering', 'Marketing', 'Design', 'Finance', 'Operations', 'HR', 'Management'];
const statuses = ['All Status', 'ACTIVE', 'INACTIVE'] as const;
const PAGE_SIZE = 8;

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

const deptColors: Record<string, string> = {
  Engineering: 'bg-blue-50 text-blue-700',
  Design: 'bg-violet-50 text-violet-700',
  Marketing: 'bg-amber-50 text-amber-700',
  HR: 'bg-emerald-50 text-emerald-700',
  Finance: 'bg-rose-50 text-rose-700',
  Operations: 'bg-gray-50 text-gray-600',
  Management: 'bg-indigo-50 text-indigo-700',
};

export default function AdminEmployeesPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [status, setStatus] = useState<'All Status' | 'ACTIVE' | 'INACTIVE'>('All Status');
  const [page, setPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeListItem | null>(null);

  const filtered = useMemo(() => {
    return mockEmployees.filter((emp) => {
      const matchSearch =
        !search ||
        emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = department === 'All Departments' || emp.department === department;
      const matchStatus = status === 'All Status' || emp.status === status;
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, department, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Employees</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your organization&apos;s employees.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 w-full sm:w-auto">
            <Plus size={16} />
            Add Employee
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-card lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} className="shrink-0 text-gray-400" />
              <select
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s === 'All Status' ? s : s.charAt(0) + s.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile View: Card Grid */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {paginated.map((emp) => (
            <EmployeeResponsiveCard
              key={emp.id}
              employee={emp}
              onSelect={setSelectedEmployee}
              deptColors={deptColors}
            />
          ))}
          {paginated.length === 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-card">
              <p className="text-sm font-medium text-gray-900">No employees found.</p>
              <p className="mt-1 text-xs text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden rounded-xl border border-gray-100 bg-white shadow-card md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">Employee</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">Department</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 lg:table-cell">Designation</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 xl:table-cell">Joined</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((emp) => (
                  <tr
                    key={emp.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50/50"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                          {getInitials(emp.firstName, emp.lastName)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{emp.employeeId}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${deptColors[emp.department] ?? 'bg-gray-50 text-gray-600'}`}>
                        {emp.department}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-gray-600 lg:table-cell">{emp.designation}</td>
                    <td className="hidden px-6 py-4 text-xs text-gray-500 xl:table-cell">{emp.dateOfJoining}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${emp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
                        {emp.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-900">No employees found.</p>
                      <p className="mt-1 text-xs text-gray-500">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 bg-white p-4 rounded-xl shadow-card">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} employees
            </p>
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[28px] rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                    p === page ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs" onClick={() => setSelectedEmployee(null)}>
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-base sm:text-lg font-bold text-brand-700">
                    {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-mono">{selectedEmployee.employeeId} &middot; {selectedEmployee.designation}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEmployee(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 space-y-3.5 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                  <Mail size={16} className="shrink-0 text-gray-400" />
                  <span className="truncate">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                  <Phone size={16} className="shrink-0 text-gray-400" />
                  <span>{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                  <Briefcase size={16} className="shrink-0 text-gray-400" />
                  <span>{selectedEmployee.department} &middot; {selectedEmployee.employmentType.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Edit Employee
                </button>
                <button className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${selectedEmployee.status === 'ACTIVE' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  {selectedEmployee.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
