import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(2500)
  summary: string;

  @IsString()
  @IsOptional()
  userId?: string;
}
