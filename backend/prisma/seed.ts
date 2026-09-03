import { PrismaClient, Role, Semester, AssessmentType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password@123', 10);

  const faculty = await prisma.faculty.upsert({
    where: { email: 'jane.doe@university.edu' },
    update: {},
    create: {
      employeeCode: 'FAC001',
      name: 'Dr. Jane Doe',
      email: 'jane.doe@university.edu',
      password: passwordHash,
      department: 'Computer Science',
      designation: 'Associate Professor',
      role: Role.FACULTY,
    },
  });

  const course = await prisma.course.upsert({
    where: { code: 'CS301' },
    update: {},
    create: {
      code: 'CS301',
      title: 'Database Management Systems',
      department: 'Computer Science',
      credits: 4,
      semester: Semester.ODD,
      academicYear: '2025-2026',
      facultyId: faculty.id,
    },
  });

  const student = await prisma.student.upsert({
    where: { rollNumber: 'CS2023001' },
    update: {},
    create: {
      rollNumber: 'CS2023001',
      name: 'Alex Kumar',
      email: 'alex.kumar@university.edu',
      program: 'B.Tech CSE',
      batch: '2023-2027',
    },
  });

  await prisma.enrollment.upsert({
    where: { courseId_studentId: { courseId: course.id, studentId: student.id } },
    update: {},
    create: { courseId: course.id, studentId: student.id },
  });

  const assessment = await prisma.assessment.create({
    data: {
      courseId: course.id,
      title: 'Midterm Examination',
      type: AssessmentType.MIDTERM,
      maxMarks: 50,
      weightage: 30,
    },
  });

  await prisma.assessmentRecord.create({
    data: {
      assessmentId: assessment.id,
      studentId: student.id,
      marksObtained: 42,
      remarks: 'Good understanding of normalization',
    },
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
