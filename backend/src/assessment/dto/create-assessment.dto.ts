import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AssessmentType } from '@prisma/client';

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(AssessmentType)
  type: AssessmentType;

  @IsNumber()
  @Min(1)
  maxMarks: number;

  @IsOptional()
  @IsNumber()
  weightage?: number;

  @IsOptional()
  @IsDateString()
  scheduledOn?: string;
}
