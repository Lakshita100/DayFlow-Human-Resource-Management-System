import type { FullEmployeeProfile } from '@/types/profile.types';

export const mockEmployeeProfile: FullEmployeeProfile = {
  employee: {
    id: 'emp-001',
    employeeId: 'EMP1024',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@dayflow.com',
    phone: '+91 98765 43210',
    avatar: null,
    department: 'Engineering',
    designation: 'Software Engineer',
    dateOfJoining: '2026-06-01',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    workLocation: 'Mumbai',
    reportingTo: 'Priya Mehta',
  },
  personalInfo: {
    dateOfBirth: '2004-03-15',
    gender: 'Male',
    address: '42, Hill Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400050',
    country: 'India',
  },
  privateInfo: {
    emergencyContactName: 'Suresh Sharma',
    emergencyContactPhone: '+91 98765 12345',
    privateEmail: 'rahul.personal@gmail.com',
    privateAddress: '42, Hill Road, Bandra West, Mumbai 400050',
  },
  skills: [
    { id: 's1', name: 'TypeScript', category: 'Programming', proficiency: 'Advanced' },
    { id: 's2', name: 'React', category: 'Frontend', proficiency: 'Advanced' },
    { id: 's3', name: 'Node.js', category: 'Backend', proficiency: 'Intermediate' },
    { id: 's4', name: 'Python', category: 'Programming', proficiency: 'Intermediate' },
    { id: 's5', name: 'PostgreSQL', category: 'Database', proficiency: 'Intermediate' },
    { id: 's6', name: 'Git', category: 'Tools', proficiency: 'Advanced' },
    { id: 's7', name: 'Docker', category: 'DevOps', proficiency: 'Beginner' },
  ],
};
