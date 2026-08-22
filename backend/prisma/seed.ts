import { PrismaClient, Role, EmployeeStatus, LeaveType, AttendanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('Seeding database...');

  const defaultPassword = await hashPassword('password123');
  const tempPassword = await hashPassword('temp123');

  // ============================================
  // COMPANY A - Dayflow
  // ============================================

  const companyA = await prisma.company.upsert({
    where: { name: 'Dayflow' },
    update: {},
    create: {
      id: 'company-a-id',
      name: 'Dayflow',
      prefix: 'DF',
      logoUrl: 'https://example.com/dayflow-logo.png',
    },
  });

  // ============================================
  // COMPANY B - Odoo India
  // ============================================

  const companyB = await prisma.company.upsert({
    where: { name: 'Odoo India' },
    update: {},
    create: {
      id: 'company-b-id',
      name: 'Odoo India',
      prefix: 'OI',
      logoUrl: 'https://example.com/odoo-logo.png',
    },
  });

  console.log('Companies created');

  // ============================================
  // COMPANY A USERS
  // ============================================

  const adminUserA = await prisma.user.upsert({
    where: { email: 'admin@dayflow.com' },
    update: { loginId: 'DFADUN20240001', companyId: companyA.id },
    create: {
      loginId: 'DFADUN20240001',
      email: 'admin@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.ADMIN,
      companyId: companyA.id,
      mustChangePassword: false,
      isActive: true,
    },
  });

  const hrUserA = await prisma.user.upsert({
    where: { email: 'hr@dayflow.com' },
    update: { loginId: 'DFHRMA20240002', companyId: companyA.id },
    create: {
      loginId: 'DFHRMA20240002',
      email: 'hr@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.HR,
      companyId: companyA.id,
      mustChangePassword: false,
      isActive: true,
    },
  });

  const employeeUserA1 = await prisma.user.upsert({
    where: { email: 'john.doe@dayflow.com' },
    update: { loginId: 'DFJODO20240003', passwordHash: tempPassword, mustChangePassword: true, companyId: companyA.id },
    create: {
      loginId: 'DFJODO20240003',
      email: 'john.doe@dayflow.com',
      passwordHash: tempPassword,
      role: Role.EMPLOYEE,
      companyId: companyA.id,
      mustChangePassword: true,
      isActive: true,
    },
  });

  const employeeUserA2 = await prisma.user.upsert({
    where: { email: 'jane.smith@dayflow.com' },
    update: { loginId: 'DFJASM20240004', passwordHash: tempPassword, mustChangePassword: true, companyId: companyA.id },
    create: {
      loginId: 'DFJASM20240004',
      email: 'jane.smith@dayflow.com',
      passwordHash: tempPassword,
      role: Role.EMPLOYEE,
      companyId: companyA.id,
      mustChangePassword: true,
      isActive: true,
    },
  });

  const employeeUserA3 = await prisma.user.upsert({
    where: { email: 'bob.wilson@dayflow.com' },
    update: { loginId: 'DFBOWI20240005', companyId: companyA.id },
    create: {
      loginId: 'DFBOWI20240005',
      email: 'bob.wilson@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.EMPLOYEE,
      companyId: companyA.id,
      mustChangePassword: false,
      isActive: true,
    },
  });

  console.log('Company A users created');

  // ============================================
  // COMPANY B USERS
  // ============================================

  const adminUserB = await prisma.user.upsert({
    where: { email: 'admin@odooindia.com' },
    update: { loginId: 'OIADUN20240001', companyId: companyB.id },
    create: {
      loginId: 'OIADUN20240001',
      email: 'admin@odooindia.com',
      passwordHash: defaultPassword,
      role: Role.ADMIN,
      companyId: companyB.id,
      mustChangePassword: false,
      isActive: true,
    },
  });

  const hrUserB = await prisma.user.upsert({
    where: { email: 'hr@odooindia.com' },
    update: { loginId: 'OIHRMA20240002', companyId: companyB.id },
    create: {
      loginId: 'OIHRMA20240002',
      email: 'hr@odooindia.com',
      passwordHash: defaultPassword,
      role: Role.HR,
      companyId: companyB.id,
      mustChangePassword: false,
      isActive: true,
    },
  });

  const employeeUserB1 = await prisma.user.upsert({
    where: { email: 'alice.johnson@odooindia.com' },
    update: { loginId: 'OIALJO20240003', companyId: companyB.id },
    create: {
      loginId: 'OIALJO20240003',
      email: 'alice.johnson@odooindia.com',
      passwordHash: tempPassword,
      role: Role.EMPLOYEE,
      companyId: companyB.id,
      mustChangePassword: true,
      isActive: true,
    },
  });

  console.log('Company B users created');

  // ============================================
  // COMPANY A EMPLOYEES
  // ============================================

  const adminEmployeeA = await prisma.employee.upsert({
    where: { userId: adminUserA.id },
    update: { companyId: companyA.id },
    create: {
      employeeId: 'DFEMP001',
      userId: adminUserA.id,
      companyId: companyA.id,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      department: 'Management',
      designation: 'System Administrator',
      dateOfJoining: new Date('2024-01-01'),
      employmentType: 'FULL_TIME',
      status: EmployeeStatus.ACTIVE,
    },
  });

  const hrEmployeeA = await prisma.employee.upsert({
    where: { userId: hrUserA.id },
    update: { companyId: companyA.id },
    create: {
      employeeId: 'DFEMP002',
      userId: hrUserA.id,
      companyId: companyA.id,
      firstName: 'HR',
      lastName: 'Manager',
      phone: '+1234567891',
      department: 'Human Resources',
      designation: 'HR Manager',
      dateOfJoining: new Date('2024-01-15'),
      employmentType: 'FULL_TIME',
      status: EmployeeStatus.ACTIVE,
    },
  });

  const employeeA1 = await prisma.employee.upsert({
    where: { userId: employeeUserA1.id },
    update: { companyId: companyA.id },
    create: {
      employeeId: 'DFEMP003',
      userId: employeeUserA1.id,
      companyId: companyA.id,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567892',
      department: 'Engineering',
      designation: 'Software Developer',
      dateOfJoining: new Date('2024-02-01'),
      employmentType: 'FULL_TIME',
      status: EmployeeStatus.ACTIVE,
    },
  });

  const employeeA2 = await prisma.employee.upsert({
    where: { userId: employeeUserA2.id },
    update: { companyId: companyA.id },
    create: {
      employeeId: 'DFEMP004',
      userId: employeeUserA2.id,
      companyId: companyA.id,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567893',
      department: 'Engineering',
      designation: 'Senior Software Developer',
      dateOfJoining: new Date('2024-02-15'),
      employmentType: 'FULL_TIME',
      status: EmployeeStatus.ACTIVE,
    },
  });

  const employeeA3 = await prisma.employee.upsert({
    where: { userId: employeeUserA3.id },
    update: { companyId: companyA.id },
    create: {
      employeeId: 'DFEMP005',
      userId: employeeUserA3.id,
      companyId: companyA.id,
      firstName: 'Bob',
      lastName: 'Wilson',
      phone: '+1234567894',
      department: 'Marketing',
      designation: 'Marketing Specialist',
      dateOfJoining: new Date('2024-03-01'),
      employmentType: 'FULL_TIME',
      status: EmployeeStatus.ACTIVE,
    },
  });

  console.log('Company A employees created');

  // ============================================
  // COMPANY B EMPLOYEES
  // ============================================

  const adminEmployeeB = await prisma.employee.upsert({
    where: { userId: adminUserB.id },
    update: { companyId: companyB.id },
    create: {
      employeeId: 'OIEMP001',
      userId: adminUserB.id,
      companyId: companyB.id,
      firstName: 'Admin',
      lastName: 'B',
      phone: '+9876543210',
      department: 'Management',
      designation: 'Company Admin',
      dateOfJoining: new Date('2024-01-01'),
      employmentType: 'FULL_TIME',
      status: EmployeeStatus.ACTIVE,
    },
  });

  const hrEmployeeB = await prisma.employee.upsert({
    where: { userId: hrUserB.id },
    update: { companyId: companyB.id },
    create: {
      employeeId: 'OIEMP002',
      userId: hrUserB.id,
      companyId: companyB.id,
      firstName: 'HR',
      lastName: 'B',
      phone: '+9876543211',
      department: 'Human Resources',
      designation: 'HR Manager',
      dateOfJoining: new Date('2024-01-15'),
      employmentType: 'FULL_TIME',
      status: EmployeeStatus.ACTIVE,
    },
  });

  const employeeB1 = await prisma.employee.upsert({
    where: { userId: employeeUserB1.id },
    update: { companyId: companyB.id },
    create: {
      employeeId: 'OIEMP003',
      userId: employeeUserB1.id,
      companyId: companyB.id,
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '+9876543212',
      department: 'Engineering',
      designation: 'Software Developer',
      dateOfJoining: new Date('2024-02-01'),
      employmentType: 'FULL_TIME',
      status: EmployeeStatus.ACTIVE,
    },
  });

  console.log('Company B employees created');

  // ============================================
  // YEARLY SERIALS
  // ============================================

  await prisma.yearlySerial.upsert({
    where: { companyId_year: { companyId: companyA.id, year: 2024 } },
    update: { lastSerial: 5 },
    create: {
      companyId: companyA.id,
      year: 2024,
      lastSerial: 5,
    },
  });

  await prisma.yearlySerial.upsert({
    where: { companyId_year: { companyId: companyB.id, year: 2024 } },
    update: { lastSerial: 3 },
    create: {
      companyId: companyB.id,
      year: 2024,
      lastSerial: 3,
    },
  });

  console.log('Yearly serials created');

  // ============================================
  // EMPLOYEE PRIVATE INFO (skip if exists)
  // ============================================

  const existingPrivateInfo = await prisma.employeePrivateInfo.findFirst({
    where: { employeeId: employeeA1.id },
  });

  if (!existingPrivateInfo) {
    await prisma.employeePrivateInfo.createMany({
      data: [
        {
          employeeId: employeeA1.id,
          dateOfBirth: new Date('1995-05-15'),
          gender: 'Male',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          emergencyContactName: 'Mary Doe',
          emergencyContactPhone: '+1234567899',
        },
        {
          employeeId: employeeA2.id,
          dateOfBirth: new Date('1992-08-20'),
          gender: 'Female',
          address: '456 Oak Ave',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          emergencyContactName: 'John Smith',
          emergencyContactPhone: '+1234567898',
        },
        {
          employeeId: employeeA3.id,
          dateOfBirth: new Date('1990-12-10'),
          gender: 'Male',
          address: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          emergencyContactName: 'Sarah Wilson',
          emergencyContactPhone: '+1234567897',
        },
        {
          employeeId: employeeB1.id,
          dateOfBirth: new Date('1993-03-25'),
          gender: 'Female',
          address: '321 Elm St',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          emergencyContactName: 'Robert Johnson',
          emergencyContactPhone: '+9876543219',
        },
      ],
    });
  }

  console.log('Private info created');

  // ============================================
  // SKILLS (skip if exists)
  // ============================================

  const existingSkill = await prisma.skill.findFirst();
  if (!existingSkill) {
    await prisma.skill.createMany({
      data: [
        { name: 'JavaScript', category: 'Programming' },
        { name: 'TypeScript', category: 'Programming' },
        { name: 'React', category: 'Frontend' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'Python', category: 'Programming' },
        { name: 'SQL', category: 'Database' },
        { name: 'Docker', category: 'DevOps' },
        { name: 'AWS', category: 'Cloud' },
      ],
    });
  }

  console.log('Skills created');

  console.log('\nSeed completed successfully!');
  console.log('\n=== COMPANY A (Dayflow) ===');
  console.log('  Admin:    DFADUN20240001 / password123');
  console.log('  HR:       DFHRMA20240002 / password123');
  console.log('  Employee: DFJODO20240003 / temp123 (must change password)');
  console.log('  Employee: DFJASM20240004 / temp123 (must change password)');
  console.log('  Employee: DFBOWI20240005 / password123');
  console.log('\n=== COMPANY B (Odoo India) ===');
  console.log('  Admin:    OIADUN20240001 / password123');
  console.log('  HR:       OIHRMA20240002 / password123');
  console.log('  Employee: OIALJO20240003 / temp123 (must change password)');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
