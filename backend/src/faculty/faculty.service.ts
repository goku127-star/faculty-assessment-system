import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitize(faculty: any) {
    const { password, ...rest } = faculty;
    return rest;
  }

  async create(dto: CreateFacultyDto) {
    const existing = await this.prisma.faculty.findFirst({
      where: { OR: [{ email: dto.email }, { employeeCode: dto.employeeCode }] },
    });
    if (existing) {
      throw new ConflictException('Faculty with this email or employee code already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const faculty = await this.prisma.faculty.create({
      data: { ...dto, password: hashedPassword },
    });
    return this.sanitize(faculty);
  }

  async findAll() {
    const list = await this.prisma.faculty.findMany({ orderBy: { name: 'asc' } });
    return list.map((f) => this.sanitize(f));
  }

  async findOne(id: string) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: { courses: true },
    });
    if (!faculty) throw new NotFoundException('Faculty not found');
    return this.sanitize(faculty);
  }

  async update(id: string, dto: UpdateFacultyDto) {
    await this.findOne(id);
    const faculty = await this.prisma.faculty.update({ where: { id }, data: dto });
    return this.sanitize(faculty);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.faculty.delete({ where: { id } });
    return { message: 'Faculty deleted successfully' };
  }
}
