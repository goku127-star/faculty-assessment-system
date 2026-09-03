import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { BulkRecordDto } from './dto/bulk-record.dto';

@Injectable()
export class AssessmentRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRecordDto) {
    const existing = await this.prisma.assessmentRecord.findUnique({
      where: {
        assessmentId_studentId: { assessmentId: dto.assessmentId, studentId: dto.studentId },
      },
    });
    if (existing) throw new ConflictException('Record already exists for this student and assessment');
    return this.prisma.assessmentRecord.create({ data: dto });
  }

  // Enter/update marks for many students in one call
  async bulkUpsert(dto: BulkRecordDto) {
    const results = await this.prisma.$transaction(
      dto.entries.map((entry) =>
        this.prisma.assessmentRecord.upsert({
          where: {
            assessmentId_studentId: { assessmentId: dto.assessmentId, studentId: entry.studentId },
          },
          update: { marksObtained: entry.marksObtained, remarks: entry.remarks },
          create: {
            assessmentId: dto.assessmentId,
            studentId: entry.studentId,
            marksObtained: entry.marksObtained,
            remarks: entry.remarks,
          },
        }),
      ),
    );
    return results;
  }

  findAll(assessmentId?: string, studentId?: string) {
    return this.prisma.assessmentRecord.findMany({
      where: {
        ...(assessmentId ? { assessmentId } : {}),
        ...(studentId ? { studentId } : {}),
      },
      include: { student: true, assessment: { include: { course: true } } },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.assessmentRecord.findUnique({
      where: { id },
      include: { student: true, assessment: true },
    });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  async update(id: string, dto: UpdateRecordDto) {
    await this.findOne(id);
    return this.prisma.assessmentRecord.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.assessmentRecord.delete({ where: { id } });
    return { message: 'Record deleted successfully' };
  }

  // Aggregate report: a student's overall performance in a course
  async studentCourseReport(studentId: string, courseId: string) {
    const records = await this.prisma.assessmentRecord.findMany({
      where: { studentId, assessment: { courseId } },
      include: { assessment: true },
    });

    const totalWeighted = records.reduce((sum, r) => {
      const pct = (r.marksObtained / r.assessment.maxMarks) * r.assessment.weightage;
      return sum + pct;
    }, 0);

    return {
      studentId,
      courseId,
      assessments: records.map((r) => ({
        title: r.assessment.title,
        type: r.assessment.type,
        marksObtained: r.marksObtained,
        maxMarks: r.assessment.maxMarks,
        weightage: r.assessment.weightage,
      })),
      overallScore: Math.round(totalWeighted * 100) / 100,
    };
  }
}
