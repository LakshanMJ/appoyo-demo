import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import type { CheckConflictDto } from './dto/check-conflict.dto';
import type { MoveShiftDto } from './dto/move-shift.dto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

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
      include: {
        participant: true,
        caregiver: true,
      },
    });
  }

  // 2. Fetch shifts within calendar date window
  // async findAll(startDate: string, endDate: string) {
  //   return this.prisma.shift.findMany({
  //     where: {
  //       startTime: {
  //         gte: new Date(startDate),
  //         lt: new Date(endDate),
  //       },
  //     },
  //     include: {
  //       participant: true,
  //       caregiver: true,
  //     },
  //   });
  // }

async findAll(startDate: string, endDate: string) {
  console.log('🔥 FIND ALL RECEIVED:', {
    startDate,
    endDate,
  });

  const start = dayjs.tz(startDate, 'Australia/Brisbane').startOf('day').toDate();

  const end = dayjs
    .tz(endDate, 'Australia/Brisbane')
    .add(1, 'day')
    .startOf('day')
    .toDate();

  console.log('🔥 DATE RANGE:', {
    start,
    end,
  });

  return this.prisma.shift.findMany({
    where: {
      startTime: {
        gte: start,
        lt: end,
      },
    },
    include: {
      participant: true,
      caregiver: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  });
}

  // 3. Update Shift
  async update(id: string, dto: CreateShiftDto) {
    const existingShift = await this.prisma.shift.findUnique({
      where: { id },
    });

    if (!existingShift) {
      throw new NotFoundException('Shift not found');
    }

    const conflictResult = await this.checkConflict({
      startTime: dto.startTime,
      endTime: dto.endTime,
      participantId: dto.participantId,
      caregiverId: dto.caregiverId,
      excludeShiftId: id,
    });

    if (conflictResult.hasConflict) {
      throw new BadRequestException(conflictResult.message);
    }

    return this.prisma.shift.update({
      where: {
        id,
      },
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
      include: {
        participant: true,
        caregiver: true,
      },
    });
  }

  // 4. Move Shift (Drag & Drop)
  async move(id: string, dto: MoveShiftDto) {
    const existingShift = await this.prisma.shift.findUnique({
      where: { id },
    });

    if (!existingShift) {
      throw new NotFoundException('Shift not found');
    }

    const conflictResult = await this.checkConflict({
      startTime: dto.startTime,
      endTime: dto.endTime,
      participantId: dto.participantId ?? existingShift.participantId,
      caregiverId: existingShift.caregiverId ?? undefined,
      excludeShiftId: id,
    });

    if (conflictResult.hasConflict) {
      throw new BadRequestException(conflictResult.message);
    }

    return this.prisma.shift.update({
      where: {
        id,
      },
      data: {
        participantId: dto.participantId ?? existingShift.participantId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
      include: {
        participant: true,
        caregiver: true,
      },
    });
  }

  // 5. Delete Shift
  async remove(id: string) {
    const existingShift = await this.prisma.shift.findUnique({
      where: { id },
    });

    if (!existingShift) {
      throw new NotFoundException('Shift not found');
    }

    return this.prisma.shift.delete({
      where: {
        id,
      },
    });
  }

  // 6. Check Scheduling Conflicts
  async checkConflict(dto: CheckConflictDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    // Validate date values
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid shift date or time.');
    }

    // Start must be before end
    if (start >= end) {
      throw new BadRequestException(
        'Shift start time must be before end time.',
      );
    }

    // Check caregiver overlap
    if (dto.caregiverId) {
      const caregiverConflict = await this.prisma.shift.findFirst({
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

    // Check participant overlap
    if (dto.participantId) {
      const participantConflict = await this.prisma.shift.findFirst({
        where: {
          id: dto.excludeShiftId
            ? { not: dto.excludeShiftId }
            : undefined,

          participantId: dto.participantId,

          startTime: {
            lt: end,
          },

          endTime: {
            gt: start,
          },
        },
      });

      if (participantConflict) {
        return {
          hasConflict: true,
          type: 'PARTICIPANT_OVERLAP',
          message:
            'Participant is already assigned to another shift in this time slot.',
        };
      }
    }

    return {
      hasConflict: false,
    };
  }
}