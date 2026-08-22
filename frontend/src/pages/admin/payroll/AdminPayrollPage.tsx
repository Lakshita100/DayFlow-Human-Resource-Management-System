import { useState, useMemo } from 'react';
import { Search, Plus, Download, DollarSign, TrendingUp, TrendingDown, Wallet, X, ChevronRight } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { mockPayrollRecords } from '@/data/adminPayrollMock';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function AdminPayrollPage() {
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<typeof mockPayrollRecords[0] | null>(null);

  const filtered = useMemo(() => {
    return mockPayrollRecords.filter((r) => {
      return (
        !search ||
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        r.department.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  const summary = useMemo(() => {
    const total = mockPayrollRecords.length;
    const totalSalary = mockPayrollRecords.reduce((s, r) => s + r.netSalary, 0);
    const avgSalary = total > 0 ? totalSalary / total : 0;
    const maxSalary = Math.max(...mockPayrollRecords.map((r) => r.netSalary));
    return { total, totalSalary, avgSalary, maxSalary };
  }, []);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Payroll Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage salary structures for all employees.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <Download size={16} />
              Export
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700">
              <Plus size={16} />
              Add Salary
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Employees', value: String(summary.total), icon: Wallet, iconBg: 'bg-brand-50', iconColor: 'text-brand-600', valueColor: 'text-gray-900' },
            { label: 'Total Payroll', value: formatCurrency(summary.totalSalary), icon: DollarSign, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', valueColor: 'text-emerald-600' },
            { label: 'Average Salary', value: formatCurrency(summary.avgSalary), icon: TrendingUp, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', valueColor: 'text-blue-600' },
            { label: 'Highest Salary', value: formatCurrency(summary.maxSalary), icon: TrendingDown, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', valueColor: 'text-amber-600' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className={`mt-2 text-lg font-bold ${stat.valueColor}`}>{stat.value}</p>
                  </div>
                  <div className={`rounded-lg ${stat.iconBg} p-2.5`}>
                    <Icon size={20} className={stat.iconColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {/* Mobile View: Payroll Cards */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {filtered.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-card transition-all hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{record.employeeName}</h3>
                  <p className="text-xs text-gray-500 font-mono">{record.employeeId} &middot; {record.department}</p>
                </div>
                <span className="text-base font-bold text-emerald-600">{formatCurrency(record.netSalary)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2.5 text-xs text-gray-500">
                <span>Basic: {formatCurrency(record.basicSalary)}</span>
                <span className="inline-flex items-center text-brand-600 font-medium">
                  View Breakdown <ChevronRight size={14} className="ml-0.5" />
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-card">
              <p className="text-sm font-medium text-gray-900">No payroll records found.</p>
              <p className="mt-1 text-xs text-gray-500">Try adjusting your search query.</p>
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
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 md:table-cell">Department</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 lg:table-cell">Basic</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 lg:table-cell">HRA</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 xl:table-cell">Allowances</th>
                  <th className="hidden px-6 py-3 text-xs font-medium text-gray-500 xl:table-cell">Deductions</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">Net Salary</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((record) => (
                  <tr
                    key={record.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50/50"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{record.employeeName}</p>
                        <p className="text-xs text-gray-400 font-mono">{record.employeeId}</p>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-gray-600 md:table-cell">{record.department}</td>
                    <td className="hidden px-6 py-4 text-sm text-gray-600 lg:table-cell">{formatCurrency(record.basicSalary)}</td>
                    <td className="hidden px-6 py-4 text-sm text-gray-600 lg:table-cell">{formatCurrency(record.hra)}</td>
                    <td className="hidden px-6 py-4 text-sm text-gray-600 xl:table-cell">{formatCurrency(record.allowances)}</td>
                    <td className="hidden px-6 py-4 text-sm text-rose-600 xl:table-cell">-{formatCurrency(record.deductions)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{formatCurrency(record.netSalary)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-md bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-900">No payroll records found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs" onClick={() => setSelectedRecord(null)}>
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Salary Details</h2>
                <button onClick={() => setSelectedRecord(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900">{selectedRecord.employeeName} &middot; <span className="font-mono text-gray-500">{selectedRecord.employeeId}</span></p>
                <p className="text-xs text-gray-400">{selectedRecord.department} &middot; {selectedRecord.designation}</p>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { label: 'Basic Salary', value: formatCurrency(selectedRecord.basicSalary), color: 'text-gray-900' },
                  { label: 'HRA', value: formatCurrency(selectedRecord.hra), color: 'text-gray-900' },
                  { label: 'Allowances', value: formatCurrency(selectedRecord.allowances), color: 'text-emerald-600' },
                  { label: 'Deductions', value: `-${formatCurrency(selectedRecord.deductions)}`, color: 'text-rose-600' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-gray-900">Net Salary</span>
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(selectedRecord.netSalary)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400">Effective from: {selectedRecord.effectiveFrom}</p>
              <button
                onClick={() => setSelectedRecord(null)}
                className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
