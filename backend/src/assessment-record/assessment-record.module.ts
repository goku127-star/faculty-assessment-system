import { Module } from '@nestjs/common';
import { AssessmentRecordService } from './assessment-record.service';
import { AssessmentRecordController } from './assessment-record.controller';

@Module({
  controllers: [AssessmentRecordController],
  providers: [AssessmentRecordService],
  exports: [AssessmentRecordService],
})
export class AssessmentRecordModule {}
