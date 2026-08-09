import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(dto: CreateParticipantDto) {
    console.log("DTO RECEIVED:", dto);
    return this.prisma.participant.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        allocatedBudget: dto.allocatedBudget,
      },
    });
  }

  async findAll() {
    return this.prisma.participant.findMany();
  }
}