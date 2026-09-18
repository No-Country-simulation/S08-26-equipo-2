import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty({
    description: 'Título de la reunión',
    example: 'Sincronización semanal',
    maxLength: 150,
  })
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción o detalle de la reunión',
    example: 'Repaso de avances y planificación de la semana',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha y hora de inicio programada (ISO 8601)',
    example: '2026-10-01T14:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledStartAt?: string;

  @ApiPropertyOptional({
    description: 'Fecha y hora de fin programada (ISO 8601)',
    example: '2026-10-01T15:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledEndAt?: string;

  @ApiPropertyOptional({
    description: 'Duración estimada de la reunión en minutos',
    example: 60,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDurationMinutes?: number;
}
