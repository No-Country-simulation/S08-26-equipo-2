import { IsString, IsOptional, IsDateString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  scheduledStartAt?: string;

  @IsOptional()
  @IsDateString()
  scheduledEndAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDurationMinutes?: number;
}
