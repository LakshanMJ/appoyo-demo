import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  allocatedBudget?: number;
}