export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  department: string;
  designation: string;
  dateOfJoining: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  workLocation: string;
  reportingTo: string | null;
}

export interface EmployeePersonalInfo {
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string;
}

export interface EmployeePrivateInfo {
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  privateEmail: string | null;
  privateAddress: string | null;
}

export interface EmployeeSkill {
  id: string;
  name: string;
  category: string | null;
  proficiency: string | null;
}

export interface ProfileUpdatePayload {
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface FullEmployeeProfile {
  employee: EmployeeProfile;
  personalInfo: EmployeePersonalInfo;
  privateInfo: EmployeePrivateInfo;
  skills: EmployeeSkill[];
}
