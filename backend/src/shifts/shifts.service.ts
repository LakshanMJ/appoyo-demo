import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import type { CheckConflictDto } from './dto/check-conflict.dto';
import type { MoveShiftDto } from './dto/move-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) { }

  // 1. Create Shift
  async create(dto: CreateShiftDto) {
    const conflictResult = await this.checkConflict({
      startTime: dto.startTime,
      endTime: dto.endTime,
      participantId: dto.participantId,
      caregiverId: dto.caregiverId,
    });

    if (conflictResult.hasConflict) {
      throw new BadRequestException(conflictResult.message);
    }

    return this.prisma.shift.create({
      data: {
        participantId: dto.participantId ?? null,
        caregiverId: dto.caregiverId ?? null,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        category: dto.category,
        type: dto.type,
        badgeText: dto.badgeText,
        badgeIcon: dto.badgeIcon,
        status: dto.status,
        notes: dto.notes,
      },
      include: { participant: true, caregiver: true },
    });
  }


  // 3. Fetch shifts within calendar date window
  async findAll(startDate: string, endDate: string) {
    return this.prisma.shift.findMany({
      where: {
        startTime: {
          gte: new Date(startDate),
          lt: new Date(endDate),
        },
      },
      include: {
        participant: true,
        caregiver: true,
      },
    });
  }

  // 4. Update Shift
  async update(id: string, dto: CreateShiftDto) {
    return this.prisma.shift.update({
      where: {
        id,
      },
      data: {
        participantId: dto.participantId ?? null,
        caregiverId: dto.caregiverId ?? null,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        type: dto.type,
      },
    });
  }

  // 5. Move Shift (Handles Drag & Drop)
  async move(id: string, dto: MoveShiftDto) {
    console.log('🔥 SERVICE MOVE WAS CALLED');
    console.log('ID:', id);
    console.log('DTO:', dto);
    return this.prisma.shift.update({
      where: {
        id,
      },
      data: {
        participantId: dto.participantId ?? null,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });
  }

  // 6. Delete Shift
  async remove(id: string) {
    return this.prisma.shift.delete({
      where: {
        id,
      },
    });
  }

  // conflict check method.................................................................

  async checkConflict(dto: CheckConflictDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (start >= end) {
      throw new BadRequestException(
        'Shift start time must be before end time.',
      );
    }
    if (dto.caregiverId) {
      const caregiverConflict =
        await this.prisma.shift.findFirst({
          where: {
            id: dto.excludeShiftId
              ? { not: dto.excludeShiftId }
              : undefined,
            caregiverId: dto.caregiverId,
            startTime: {
              lt: end,
            },
            endTime: {
              gt: start,
            },
          },
        });
      if (caregiverConflict) {
        return {
          hasConflict: true,
          type: 'CAREGIVER_OVERLAP',
          message:
            'Caregiver is already assigned to another shift in this time slot.',
        };
      }
    }
    return {
      hasConflict: false,
    };
  }
}