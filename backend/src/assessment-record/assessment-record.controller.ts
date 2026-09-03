import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AssessmentRecordService } from './assessment-record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { BulkRecordDto } from './dto/bulk-record.dto';

@UseGuards(JwtAuthGuard)
@Controller('assessment-records')
export class AssessmentRecordController {
  constructor(private readonly recordService: AssessmentRecordService) {}

  @Post()
  create(@Body() dto: CreateRecordDto) {
    return this.recordService.create(dto);
  }

  @Post('bulk')
  bulkUpsert(@Body() dto: BulkRecordDto) {
    return this.recordService.bulkUpsert(dto);
  }

  @Get()
  findAll(@Query('assessmentId') assessmentId?: string, @Query('studentId') studentId?: string) {
    return this.recordService.findAll(assessmentId, studentId);
  }

  @Get('report')
  studentCourseReport(@Query('studentId') studentId: string, @Query('courseId') courseId: string) {
    return this.recordService.studentCourseReport(studentId, courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecordDto) {
    return this.recordService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordService.remove(id);
  }
}
