import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateParticipantDto) {
    console.log("DTO RECEIVED:", dto);
    return this.prisma.participant.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
        allocatedBudget: dto.allocatedBudget,
      },
    });
  }

  async findAll() {
    return this.prisma.participant.findMany();
  }
}