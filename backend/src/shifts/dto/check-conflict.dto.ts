import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckConflictDto {
  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @IsString()
  @IsNotEmpty()
  participantId!: string;

  @IsString()
  @IsOptional()
  caregiverId?: string;

  @IsString()
  @IsOptional()
  excludeShiftId?: string; // Used when updating an existing shift so it doesn't conflict with itself
}