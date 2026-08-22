import type { AdminProfile, AdminSalaryInfo, AdminResume } from '@/types/admin-pages.types';

export const mockAdminProfile: AdminProfile = {
  id: '1',
  name: 'Admin User',
  loginId: 'ADM-001',
  email: 'admin@dayflow.com',
  mobile: '+91 98765 43210',
  avatar: null,
  company: 'Dayflow Technologies',
  department: 'Management',
  manager: null,
  location: 'Mumbai, India',
};

export const mockAdminResume: AdminResume = {
  about:
    'Experienced administrator focused on building efficient teams and streamlined HR processes. Passionate about creating a productive, people-first workplace.',
  jobLove: 'Helping people grow in their careers while building systems that make work simpler for everyone.',
  interests: ['Technology', 'Photography', 'Travel', 'Reading'],
  skills: ['Leadership', 'Project Management', 'Strategic Planning', 'Team Building', 'Communication'],
  certifications: [
    { id: 'c1', name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2026' },
    { id: 'c2', name: 'Certified HR Manager', issuer: 'HR Certification Institute', year: '2025' },
  ],
};

export const mockAdminSalaryInfo: AdminSalaryInfo = {
  monthlyWage: 50000,
  yearlyWage: 600000,
  workingDaysPerWeek: 5,
  breakTime: '1 hr',
  components: [
    {
      name: 'Basic Salary',
      amount: 25000,
      percentage: 50,
      description: 'Defined basic salary based on the monthly wage structure.',
    },
    {
      name: 'House Rent Allowance',
      amount: 12500,
      percentage: 25,
      description: 'House rent allowance provided as a percentage of basic salary.',
    },
    {
      name: 'Standard Allowance',
      amount: 4167,
      percentage: 8.33,
      description: 'Predefined fixed allowance included in the salary structure.',
    },
    {
      name: 'Performance Bonus',
      amount: 2083,
      percentage: 4.17,
      description: 'Variable component included according to the configured salary structure.',
    },
    {
      name: 'Leave Travel Allowance',
      amount: 2083,
      percentage: 4.17,
      description: 'Allowance provided for eligible travel expenses.',
    },
    {
      name: 'Fixed Allowance',
      amount: 2500,
      percentage: 5,
      description: 'Fixed component included after calculating the configured salary components.',
    },
  ],
  providentFund: {
    employeeAmount: 3000,
    employeePercentage: 12,
    employerAmount: 3000,
    employerPercentage: 12,
    description: 'PF is calculated based on the basic salary.',
  },
  taxDeductions: [
    {
      name: 'Professional Tax',
      amount: 200,
      percentage: null,
    },
  ],
};
