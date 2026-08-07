import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ShiftCategory, ShiftType, ShiftStatus } from '@prisma/client';

export class CreateShiftDto {
  @IsString()
  @IsNotEmpty()
  participantId?: string;

  @IsString()
  @IsOptional()
  caregiverId?: string; // Optional for Vacant Shifts

  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @IsEnum(ShiftCategory)
  @IsOptional()
  category?: ShiftCategory;

  @IsEnum(ShiftType)
  @IsOptional()
  type?: ShiftType;

  @IsString()
  @IsOptional()
  badgeText?: string;

  @IsString()
  @IsOptional()
  badgeIcon?: string;

  @IsEnum(ShiftStatus)
  @IsOptional()
  status?: ShiftStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}