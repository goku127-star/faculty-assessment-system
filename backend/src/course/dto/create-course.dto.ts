import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Semester } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsInt()
  @Min(1)
  credits: number;

  @IsEnum(Semester)
  semester: Semester;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsString()
  @IsNotEmpty()
  facultyId: string;
}
