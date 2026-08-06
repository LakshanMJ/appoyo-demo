import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import type { CheckConflictDto } from './dto/check-conflict.dto';
// import { UpdateShiftDto } from './dto/update-shift.dto';
// import { GetShiftsDto } from './dto/get-shifts.dto';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  // 1. Fetch shifts within calendar date window
  // async findAll(query: GetShiftsDto) {
  //   const { startDate, endDate, organizationId } = query;

  //   return this.prisma.shift.findMany({
  //     where: {
  //       organizationId,
  //       startTime: { gte: new Date(startDate) },
  //       endTime: { lte: new Date(endDate) },
  //     },
  //     include: {
  //       participant: true,
  //       caregiver: true,
  //     },
  //     orderBy: {
  //       startTime: 'asc',
  //     },
  //   });
  // }

  // 2. Fetch single shift details
  // async findOne(id: string) {
  //   const shift = await this.prisma.shift.findUnique({
  //     where: { id },
  //     include: { participant: true, caregiver: true },
  //   });

  //   if (!shift) {
  //     throw new NotFoundException(`Shift with ID ${id} not found.`);
  //   }

  //   return shift;
  // }

  // 3. Standalone conflict check method
  async checkConflict(dto: CheckConflictDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('Shift start time must be before end time.');
    }

    // Caregiver conflict check
    if (dto.caregiverId) {
      const caregiverConflict = await this.prisma.shift.findFirst({
        where: {
          id: dto.excludeShiftId ? { not: dto.excludeShiftId } : undefined,
          caregiverId: dto.caregiverId,
          OR: [
            { startTime: { lte: start }, endTime: { gt: start } },
            { startTime: { lt: end }, endTime: { gte: end } },
            { startTime: { gte: start }, endTime: { lte: end } },
          ],
        },
      });

      if (caregiverConflict) {
        return {
          hasConflict: true,
          type: 'CAREGIVER_OVERLAP',
          message: 'Caregiver is already assigned to another shift in this time slot.',
        };
      }
    }

    // Participant conflict check
    const participantConflict = await this.prisma.shift.findFirst({
      where: {
        id: dto.excludeShiftId ? { not: dto.excludeShiftId } : undefined,
        participantId: dto.participantId,
        OR: [
          { startTime: { lte: start }, endTime: { gt: start } },
          { startTime: { lt: end }, endTime: { gte: end } },
          { startTime: { gte: start }, endTime: { lte: end } },
        ],
      },
    });

    if (participantConflict) {
      return {
        hasConflict: true,
        type: 'PARTICIPANT_OVERLAP',
        message: 'Participant already has an active shift scheduled in this time slot.',
      };
    }

    return { hasConflict: false, message: 'No conflicts detected.' };
  }

  // 4. Create Shift
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
        organizationId: dto.organizationId,
        participantId: dto.participantId,
        caregiverId: dto.caregiverId || null,
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

  // 5. Update Shift (Handles Drag & Drop or Resizing)
  // async update(id: string, dto: UpdateShiftDto) {
  //   const existingShift = await this.findOne(id);

  //   const startTime = dto.startTime || existingShift.startTime.toISOString();
  //   const endTime = dto.endTime || existingShift.endTime.toISOString();
  //   const participantId = dto.participantId || existingShift.participantId;
  //   const caregiverId = dto.caregiverId !== undefined ? dto.caregiverId : existingShift.caregiverId;

  //   const conflictResult = await this.checkConflict({
  //     startTime,
  //     endTime,
  //     participantId,
  //     caregiverId,
  //     excludeShiftId: id,
  //   });

  //   if (conflictResult.hasConflict) {
  //     throw new BadRequestException(conflictResult.message);
  //   }

  //   return this.prisma.shift.update({
  //     where: { id },
  //     data: {
  //       ...dto,
  //       startTime: dto.startTime ? new Date(dto.startTime) : undefined,
  //       endTime: dto.endTime ? new Date(dto.endTime) : undefined,
  //     },
  //     include: { participant: true, caregiver: true },
  //   });
  // }

  // 6. Delete Shift
  // async remove(id: string) {
  //   await this.findOne(id);
  //   return this.prisma.shift.delete({ where: { id } });
  // }
}