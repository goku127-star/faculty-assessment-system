import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateRecordDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  marksObtained?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
