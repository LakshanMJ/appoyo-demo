import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CheckConflictDto {
  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  // @IsString()
  // @IsNotEmpty()
  // participantId?: string;
  @IsOptional()
  @IsUUID()
  participantId?: string | null;

  @IsString()
  @IsOptional()
  caregiverId?: string;

  @IsString()
  @IsOptional()
  excludeShiftId?: string; // Used when updating an existing shift so it doesn't conflict with itself
}