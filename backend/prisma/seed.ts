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
  // USERS
  // ============================================

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.ADMIN,
      mustChangePassword: false,
      isActive: true,
    },
  });

  const hrUser = await prisma.user.create({
    data: {
      email: 'hr@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.HR,
      mustChangePassword: false,
      isActive: true,
    },
  });

  const employeeUser1 = await prisma.user.create({
    data: {
      email: 'john.doe@dayflow.com',
      passwordHash: tempPassword,
      role: Role.EMPLOYEE,
      mustChangePassword: true,
      isActive: true,
    },
  });

  const employeeUser2 = await prisma.user.create({
    data: {
      email: 'jane.smith@dayflow.com',
      passwordHash: tempPassword,
      role: Role.EMPLOYEE,
      mustChangePassword: true,
      isActive: true,
    },
  });

  const employeeUser3 = await prisma.user.create({
    data: {
      email: 'bob.wilson@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.EMPLOYEE,
      mustChangePassword: false,
      isActive: true,
    },
  });

  console.log('Users created');

  // ============================================
  // EMPLOYEES
  // ============================================

  const adminEmployee = await prisma.employee.create({
    data: {
      employeeId: 'EMP001',
      userId: adminUser.id,
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

  const hrEmployee = await prisma.employee.create({
    data: {
      employeeId: 'EMP002',
      userId: hrUser.id,
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

  const employee1 = await prisma.employee.create({
    data: {
      employeeId: 'EMP003',
      userId: employeeUser1.id,
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

  const employee2 = await prisma.employee.create({
    data: {
      employeeId: 'EMP004',
      userId: employeeUser2.id,
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

  const employee3 = await prisma.employee.create({
    data: {
      employeeId: 'EMP005',
      userId: employeeUser3.id,
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

  console.log('Employees created');

  // ============================================
  // EMPLOYEE PRIVATE INFO
  // ============================================

  await prisma.employeePrivateInfo.createMany({
    data: [
      {
        employeeId: employee1.id,
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
        employeeId: employee2.id,
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
        employeeId: employee3.id,
        dateOfBirth: new Date('1990-12-10'),
        gender: 'Male',
        address: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        emergencyContactName: 'Sarah Wilson',
        emergencyContactPhone: '+1234567897',
      },
    ],
  });

  console.log('Private info created');

  // ============================================
  // SKILLS
  // ============================================

  const skillJavaScript = await prisma.skill.create({
    data: { name: 'JavaScript', category: 'Programming' },
  });

  const skillTypeScript = await prisma.skill.create({
    data: { name: 'TypeScript', category: 'Programming' },
  });

  const skillReact = await prisma.skill.create({
    data: { name: 'React', category: 'Frontend' },
  });

  const skillNodeJS = await prisma.skill.create({
    data: { name: 'Node.js', category: 'Backend' },
  });

  const skillPython = await prisma.skill.create({
    data: { name: 'Python', category: 'Programming' },
  });

  const skillSQL = await prisma.skill.create({
    data: { name: 'SQL', category: 'Database' },
  });

  const skillDocker = await prisma.skill.create({
    data: { name: 'Docker', category: 'DevOps' },
  });

  const skillAWS = await prisma.skill.create({
    data: { name: 'AWS', category: 'Cloud' },
  });

  console.log('Skills created');

  // ============================================
  // EMPLOYEE SKILLS
  // ============================================

  await prisma.employeeSkill.createMany({
    data: [
      { employeeId: employee1.id, skillId: skillJavaScript.id, proficiency: 'ADVANCED' },
      { employeeId: employee1.id, skillId: skillTypeScript.id, proficiency: 'ADVANCED' },
      { employeeId: employee1.id, skillId: skillReact.id, proficiency: 'INTERMEDIATE' },
      { employeeId: employee1.id, skillId: skillNodeJS.id, proficiency: 'INTERMEDIATE' },
      { employeeId: employee2.id, skillId: skillJavaScript.id, proficiency: 'EXPERT' },
      { employeeId: employee2.id, skillId: skillTypeScript.id, proficiency: 'EXPERT' },
      { employeeId: employee2.id, skillId: skillReact.id, proficiency: 'ADVANCED' },
      { employeeId: employee2.id, skillId: skillPython.id, proficiency: 'INTERMEDIATE' },
      { employeeId: employee2.id, skillId: skillSQL.id, proficiency: 'ADVANCED' },
      { employeeId: employee3.id, skillId: skillPython.id, proficiency: 'BEGINNER' },
    ],
  });

  console.log('Employee skills created');

  // ============================================
  // LEAVE ALLOCATIONS
  // ============================================

  const currentYear = new Date().getFullYear();

  await prisma.leaveAllocation.createMany({
    data: [
      // Employee 1 allocations
      { employeeId: employee1.id, type: LeaveType.PAID, total: 12, used: 2, year: currentYear },
      { employeeId: employee1.id, type: LeaveType.SICK, total: 6, used: 0, year: currentYear },
      { employeeId: employee1.id, type: LeaveType.UNPAID, total: 0, used: 0, year: currentYear },
      // Employee 2 allocations
      { employeeId: employee2.id, type: LeaveType.PAID, total: 15, used: 5, year: currentYear },
      { employeeId: employee2.id, type: LeaveType.SICK, total: 8, used: 1, year: currentYear },
      { employeeId: employee2.id, type: LeaveType.UNPAID, total: 0, used: 0, year: currentYear },
      // Employee 3 allocations
      { employeeId: employee3.id, type: LeaveType.PAID, total: 12, used: 0, year: currentYear },
      { employeeId: employee3.id, type: LeaveType.SICK, total: 6, used: 0, year: currentYear },
      { employeeId: employee3.id, type: LeaveType.UNPAID, total: 0, used: 0, year: currentYear },
    ],
  });

  console.log('Leave allocations created');

  // ============================================
  // ATTENDANCE RECORDS
  // ============================================

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.attendance.createMany({
    data: [
      {
        employeeId: employee1.id,
        date: yesterday,
        checkIn: new Date(yesterday.setHours(9, 0, 0, 0)),
        checkOut: new Date(yesterday.setHours(17, 30, 0, 0)),
        workHours: 8.5,
        extraHours: 0.5,
        status: AttendanceStatus.PRESENT,
      },
      {
        employeeId: employee2.id,
        date: yesterday,
        checkIn: new Date(yesterday.setHours(8, 45, 0, 0)),
        checkOut: new Date(yesterday.setHours(17, 15, 0, 0)),
        workHours: 8.5,
        extraHours: 0.5,
        status: AttendanceStatus.PRESENT,
      },
      {
        employeeId: employee3.id,
        date: yesterday,
        checkIn: new Date(yesterday.setHours(9, 15, 0, 0)),
        checkOut: new Date(yesterday.setHours(17, 0, 0, 0)),
        workHours: 7.75,
        extraHours: 0,
        status: AttendanceStatus.PRESENT,
      },
    ],
  });

  console.log('Attendance records created');

  // ============================================
  // NOTIFICATIONS
  // ============================================

  await prisma.notification.createMany({
    data: [
      {
        userId: hrUser.id,
        title: 'Welcome to Dayflow',
        message: 'Your HR account has been set up successfully.',
        isRead: true,
      },
      {
        userId: employeeUser1.id,
        title: 'Welcome to Dayflow',
        message: 'Your employee account has been created. Please change your temporary password.',
        isRead: false,
      },
      {
        userId: employeeUser2.id,
        title: 'Welcome to Dayflow',
        message: 'Your employee account has been created. Please change your temporary password.',
        isRead: false,
      },
    ],
  });

  console.log('Notifications created');

  console.log('\nSeed completed successfully!');
  console.log('\nTest accounts:');
  console.log('  Admin:    admin@dayflow.com / password123');
  console.log('  HR:       hr@dayflow.com / password123');
  console.log('  Employee: john.doe@dayflow.com / temp123');
  console.log('  Employee: jane.smith@dayflow.com / temp123');
  console.log('  Employee: bob.wilson@dayflow.com / password123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
