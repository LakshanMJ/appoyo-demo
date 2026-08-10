import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CheckConflictDto {
  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @IsOptional()
  @IsUUID()
  participantId?: string | null;

  @IsString()
  @IsOptional()
  caregiverId?: string;

  @IsString()
  @IsOptional()
  excludeShiftId?: string;
}