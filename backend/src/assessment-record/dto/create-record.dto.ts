import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  assessmentId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @Min(0)
  marksObtained: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
