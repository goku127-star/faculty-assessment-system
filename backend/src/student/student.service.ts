import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const existing = await this.prisma.student.findFirst({
      where: { OR: [{ email: dto.email }, { rollNumber: dto.rollNumber }] },
    });
    if (existing) throw new ConflictException('Student with this email or roll number already exists');
    return this.prisma.student.create({ data: dto });
  }

  findAll() {
    return this.prisma.student.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { enrollments: { include: { course: true } } },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, dto: UpdateStudentDto) {
    await this.findOne(id);
    return this.prisma.student.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.student.delete({ where: { id } });
    return { message: 'Student deleted successfully' };
  }

  async enroll(studentId: string, courseId: string) {
    await this.findOne(studentId);
    const existing = await this.prisma.enrollment.findUnique({
      where: { courseId_studentId: { courseId, studentId } },
    });
    if (existing) throw new ConflictException('Student already enrolled in this course');
    return this.prisma.enrollment.create({ data: { studentId, courseId } });
  }
}
