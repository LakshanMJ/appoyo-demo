import {
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

export class MoveShiftDto {
  @IsOptional()
  @IsString()
  participantId?: string | null;

  @IsISO8601()
  startTime!: string;

  @IsISO8601()
  endTime!: string;
}