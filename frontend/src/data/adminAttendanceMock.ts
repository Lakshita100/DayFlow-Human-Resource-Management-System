import type { AdminAttendanceRecord } from '@/types/admin-pages.types';

export const mockAttendanceRecords: AdminAttendanceRecord[] = [
  { id: '1', employeeId: 'EMP001', employeeName: 'Admin User', department: 'Management', date: '22 Aug 2026', checkIn: '08:00 AM', checkOut: '06:00 PM', workHours: 10.0, status: 'PRESENT' },
  { id: '2', employeeId: 'EMP002', employeeName: 'HR Manager', department: 'Human Resources', date: '22 Aug 2026', checkIn: '08:55 AM', checkOut: '05:45 PM', workHours: 8.83, status: 'PRESENT' },
  { id: '3', employeeId: 'EMP003', employeeName: 'John Doe', department: 'Engineering', date: '22 Aug 2026', checkIn: '09:00 AM', checkOut: '05:30 PM', workHours: 8.5, status: 'PRESENT' },
  { id: '4', employeeId: 'EMP004', employeeName: 'Jane Smith', department: 'Engineering', date: '22 Aug 2026', checkIn: '08:45 AM', checkOut: '05:15 PM', workHours: 8.5, status: 'PRESENT' },
  { id: '5', employeeId: 'EMP005', employeeName: 'Bob Wilson', department: 'Marketing', date: '22 Aug 2026', checkIn: '09:15 AM', checkOut: '05:00 PM', workHours: 7.75, status: 'PRESENT' },
  { id: '6', employeeId: 'EMP006', employeeName: 'Priya Sharma', department: 'Engineering', date: '22 Aug 2026', checkIn: null, checkOut: null, workHours: null, status: 'LEAVE' },
  { id: '7', employeeId: 'EMP007', employeeName: 'Amit Patel', department: 'Marketing', date: '22 Aug 2026', checkIn: '09:00 AM', checkOut: '01:00 PM', workHours: 4.0, status: 'HALF_DAY' },
  { id: '8', employeeId: 'EMP008', employeeName: 'Neha Gupta', department: 'Design', date: '22 Aug 2026', checkIn: '09:30 AM', checkOut: '06:00 PM', workHours: 8.5, status: 'PRESENT' },
  { id: '9', employeeId: 'EMP009', employeeName: 'Rohit Verma', department: 'Finance', date: '22 Aug 2026', checkIn: null, checkOut: null, workHours: null, status: 'ABSENT' },
  { id: '10', employeeId: 'EMP010', employeeName: 'Ananya Singh', department: 'Engineering', date: '22 Aug 2026', checkIn: null, checkOut: null, workHours: null, status: 'ABSENT' },
  { id: '11', employeeId: 'EMP011', employeeName: 'Vikram Rao', department: 'Operations', date: '22 Aug 2026', checkIn: '08:30 AM', checkOut: '05:30 PM', workHours: 9.0, status: 'PRESENT' },
  { id: '12', employeeId: 'EMP012', employeeName: 'Sneha Iyer', department: 'HR', date: '22 Aug 2026', checkIn: '09:00 AM', checkOut: '05:00 PM', workHours: 8.0, status: 'PRESENT' },
];
