import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FacultyModule } from './faculty/faculty.module';
import { CourseModule } from './course/course.module';
import { StudentModule } from './student/student.module';
import { AssessmentModule } from './assessment/assessment.module';
import { AssessmentRecordModule } from './assessment-record/assessment-record.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    FacultyModule,
    CourseModule,
    StudentModule,
    AssessmentModule,
    AssessmentRecordModule,
  ],
})
export class AppModule {}
