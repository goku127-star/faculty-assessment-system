import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

@Injectable()
export class AssessmentService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAssessmentDto) {
    return this.prisma.assessment.create({
      data: {
        ...dto,
        scheduledOn: dto.scheduledOn ? new Date(dto.scheduledOn) : undefined,
      },
    });
  }

  findAll(courseId?: string) {
    return this.prisma.assessment.findMany({
      where: courseId ? { courseId } : undefined,
      include: { course: true, _count: { select: { records: true } } },
      orderBy: { scheduledOn: 'asc' },
    });
  }

  async findOne(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: { course: true, records: { include: { student: true } } },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');
    return assessment;
  }

  async update(id: string, dto: UpdateAssessmentDto) {
    await this.findOne(id);
    return this.prisma.assessment.update({
      where: { id },
      data: {
        ...dto,
        scheduledOn: dto.scheduledOn ? new Date(dto.scheduledOn) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.assessment.delete({ where: { id } });
    return { message: 'Assessment deleted successfully' };
  }
}
