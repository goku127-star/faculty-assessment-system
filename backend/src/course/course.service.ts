import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    const existing = await this.prisma.course.findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Course code already exists');
    return this.prisma.course.create({ data: dto, include: { faculty: true } });
  }

  findAll(facultyId?: string) {
    return this.prisma.course.findMany({
      where: facultyId ? { facultyId } : undefined,
      include: { faculty: true, _count: { select: { enrollments: true, assessments: true } } },
      orderBy: { code: 'asc' },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { faculty: true, assessments: true, enrollments: { include: { student: true } } },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.findOne(id);
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.course.delete({ where: { id } });
    return { message: 'Course deleted successfully' };
  }
}
