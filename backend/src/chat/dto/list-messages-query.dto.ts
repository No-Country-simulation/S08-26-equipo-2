import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, Max, Min } from 'class-validator';

export class ListMessagesQueryDto {
  @ApiPropertyOptional({
    description:
      'Fecha ISO 8601 del último mensaje cargado; devuelve los mensajes anteriores a esa fecha',
    example: '2026-09-22T14:30:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  before?: string;

  @ApiPropertyOptional({
    description: 'Cantidad máxima de mensajes a devolver (default: 50)',
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}