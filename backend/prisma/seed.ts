/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🎓 Seeding CampusCore ERP database...');

  const hashedAdminPass = await bcrypt.hash('Admin123!', 12);
  const hashedFacultyPass = await bcrypt.hash('User123!', 12);
  const hashedStudentPass = await bcrypt.hash('Student123!', 12);

  // ==================== ADMIN USER ====================
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: {
      email: 'admin@college.edu',
      password: hashedAdminPass,
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });

  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      firstName: 'Admin',
      lastName: 'User',
      phone: '9876543210',
    },
  });
  console.log('✅ Created admin:', adminUser.email);

  // ==================== DEPARTMENTS ====================
  const csDept = await prisma.department.upsert({
    where: { code: 'CSE' },
    update: {},
    create: {
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Department of Computer Science and Engineering',
    },
  });

  const eceDept = await prisma.department.upsert({
    where: { code: 'ECE' },
    update: {},
    create: {
      name: 'Electronics & Communication',
      code: 'ECE',
      description: 'Department of Electronics and Communication Engineering',
    },
  });

  const meDept = await prisma.department.upsert({
    where: { code: 'ME' },
    update: {},
    create: {
      name: 'Mechanical Engineering',
      code: 'ME',
      description: 'Department of Mechanical Engineering',
    },
  });
  console.log('✅ Created departments');

  // ==================== COURSES ====================
  const btechCSE = await prisma.course.upsert({
    where: { code: 'BTCSE' },
    update: {},
    create: {
      name: 'B.Tech Computer Science',
      code: 'BTCSE',
      duration: 4,
      totalSemesters: 8,
      departmentId: csDept.id,
    },
  });

  const btechECE = await prisma.course.upsert({
    where: { code: 'BTECE' },
    update: {},
    create: {
      name: 'B.Tech Electronics & Communication',
      code: 'BTECE',
      duration: 4,
      totalSemesters: 8,
      departmentId: eceDept.id,
    },
  });
  console.log('✅ Created courses');

  // ==================== BATCHES ====================
  const batch2024 = await prisma.batch.upsert({
    where: { name_courseId: { name: '2024-2028', courseId: btechCSE.id } },
    update: {},
    create: {
      name: '2024-2028',
      startYear: 2024,
      endYear: 2028,
      courseId: btechCSE.id,
    },
  });

  const sectionA = await prisma.section.upsert({
    where: { name_batchId: { name: 'A', batchId: batch2024.id } },
    update: {},
    create: {
      name: 'A',
      batchId: batch2024.id,
      maxStrength: 60,
    },
  });
  console.log('✅ Created batches & sections');

  // ==================== FACULTY USER ====================
  const facultyUser = await prisma.user.upsert({
    where: { email: 'faculty@college.edu' },
    update: {},
    create: {
      email: 'faculty@college.edu',
      password: hashedFacultyPass,
      role: 'FACULTY',
      isActive: true,
      emailVerified: true,
    },
  });

  await prisma.faculty.upsert({
    where: { userId: facultyUser.id },
    update: {},
    create: {
      userId: facultyUser.id,
      employeeId: 'FAC-001',
      firstName: 'Dr. Rajesh',
      lastName: 'Sharma',
      designation: 'Associate Professor',
      qualification: 'Ph.D. Computer Science',
      specialization: 'Machine Learning',
      experience: 12,
      gender: 'MALE',
      phone: '9876543211',
      departmentId: csDept.id,
      isHOD: true,
    },
  });
  console.log('✅ Created faculty:', facultyUser.email);

  // ==================== STUDENT USER ====================
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@college.edu' },
    update: {},
    create: {
      email: 'student@college.edu',
      password: hashedStudentPass,
      role: 'STUDENT',
      isActive: true,
      emailVerified: true,
    },
  });

  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      registrationNo: 'REG-2024-001',
      rollNo: 'CSE-001',
      firstName: 'Rahul',
      lastName: 'Kumar',
      dateOfBirth: new Date('2004-05-15'),
      gender: 'MALE',
      phone: '9876543212',
      fatherName: 'Suresh Kumar',
      motherName: 'Anita Kumar',
      departmentId: csDept.id,
      courseId: btechCSE.id,
      batchId: batch2024.id,
      sectionId: sectionA.id,
      currentSemester: 2,
      address: '123, Main Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
  });
  console.log('✅ Created student:', studentUser.email);

  // ==================== SUBJECTS ====================
  const dsSubject = await prisma.subject.upsert({
    where: { code: 'CS201' },
    update: {},
    create: {
      name: 'Data Structures',
      code: 'CS201',
      credits: 4,
      semester: 2,
      departmentId: csDept.id,
      courseId: btechCSE.id,
    },
  });

  const dbmsSubject = await prisma.subject.upsert({
    where: { code: 'CS202' },
    update: {},
    create: {
      name: 'Database Management Systems',
      code: 'CS202',
      credits: 3,
      semester: 2,
      departmentId: csDept.id,
      courseId: btechCSE.id,
    },
  });

  const osSubject = await prisma.subject.upsert({
    where: { code: 'CS301' },
    update: {},
    create: {
      name: 'Operating Systems',
      code: 'CS301',
      credits: 4,
      semester: 3,
      departmentId: csDept.id,
      courseId: btechCSE.id,
    },
  });
  console.log('✅ Created subjects');

  // ==================== ACADEMIC YEAR ====================
  await prisma.academicYear.upsert({
    where: { name: '2025-26' },
    update: {},
    create: {
      name: '2025-26',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2026-06-30'),
      isCurrent: true,
    },
  });
  console.log('✅ Created academic year');

  // ==================== NOTICES ====================
  await prisma.notice.create({
    data: {
      title: 'End Semester Examination Schedule',
      content: 'The end semester examinations for Even Semester 2025-26 will commence from March 15, 2026. Detailed schedule will be published on the notice board.',
      type: 'EXAMINATION',
      targetRoles: JSON.stringify(['STUDENT', 'FACULTY']),
      isPublished: true,
      isPinned: true,
      createdById: adminUser.id,
    },
  });

  await prisma.notice.create({
    data: {
      title: 'College Annual Day Celebration',
      content: 'The annual day celebration will be held on February 20, 2026. All students and faculty are requested to participate.',
      type: 'EVENT',
      targetRoles: JSON.stringify(['STUDENT', 'FACULTY', 'STAFF']),
      isPublished: true,
      createdById: adminUser.id,
    },
  });
  console.log('✅ Created notices');

  console.log('\n🎉 Seeding completed!\n');
  console.log('Demo Credentials:');
  console.log('  Admin:   admin@college.edu / Admin123!');
  console.log('  Faculty: faculty@college.edu / User123!');
  console.log('  Student: student@college.edu / Student123!\n');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
