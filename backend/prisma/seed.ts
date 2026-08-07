import {
  PrismaClient,
  ShiftCategory,
  ShiftType,
  ShiftStatus,
  UserRole,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Clear existing records
  await prisma.shift.deleteMany();
  await prisma.caregiver.deleteMany();
  await prisma.user.deleteMany();
  await prisma.participant.deleteMany();

  // 2. Create Participants
  const arjun = await prisma.participant.create({
    data: {
      name: 'Hank Moody',
    },
  });

  const chloe = await prisma.participant.create({
    data: {
      name: 'Chuck Runkle',
    },
  });

  const danielle = await prisma.participant.create({
    data: {
      name: 'Hunter Smith',
    },
  });

  // 3. Helper function to create Caregivers
  const createCaregiver = async (name: string, email: string) => {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: UserRole.CAREGIVER,
      },
    });

    return prisma.caregiver.create({
      data: {
        userId: user.id,
        name,
      },
    });
  };

  // 4. Create Caregivers
  const ethan = await createCaregiver(
    'Ethan Taylor',
    'ethan@appoyo.com',
  );

  const ava = await createCaregiver(
    'Ava Williams',
    'ava@appoyo.com',
  );

  const noah = await createCaregiver(
    'Noah Harris',
    'noah@appoyo.com',
  );

  const isla = await createCaregiver(
    'Isla Campbell',
    'isla@appoyo.com',
  );

  // 5. Helper for creating shift dates
  const today = new Date();

  const getShiftDate = (dayOffset: number, hour: number) => {
    const date = new Date(today);

    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, 0, 0, 0);

    return date;
  };


  // 6. Create baseline shifts
  await prisma.shift.createMany({
    data: [
      // Arjun - Ethan: 7 AM - 8 PM
      {
        participantId: arjun.id,
        caregiverId: ethan.id,
        startTime: getShiftDate(0, 7),
        endTime: getShiftDate(0, 20),
        category: ShiftCategory.PERSONAL_CARE,
        type: ShiftType.assistance,
        badgeText: 'Assistance',
        badgeIcon: 'shield',
        status: ShiftStatus.CONFIRMED,
      },

      // Arjun - Ava: 8 AM - 10 AM
      {
        participantId: arjun.id,
        caregiverId: ava.id,
        startTime: getShiftDate(0, 8),
        endTime: getShiftDate(0, 10),
        category: ShiftCategory.DOMESTIC,
        type: ShiftType.assistance,
        badgeText: 'Assistance',
        badgeIcon: 'shield',
        status: ShiftStatus.CONFIRMED,
      },

      // Chloe - Noah: 7 AM - 8 AM
      {
        participantId: chloe.id,
        caregiverId: noah.id,
        startTime: getShiftDate(1, 7),
        endTime: getShiftDate(1, 8),
        category: ShiftCategory.CLINICAL,
        type: ShiftType.nursing,
        badgeText: 'Nursing',
        badgeIcon: 'shield',
        status: ShiftStatus.CONFIRMED,
      },

      // Chloe - Isla: 4 PM - 9 PM
      {
        participantId: chloe.id,
        caregiverId: isla.id,
        startTime: getShiftDate(2, 16),
        endTime: getShiftDate(2, 21),
        category: ShiftCategory.COMMUNITY,
        type: ShiftType.transport,
        badgeText: 'Transport',
        badgeIcon: 'car',
        status: ShiftStatus.CONFIRMED,
      },

      // Arjun - Vacant: 9 AM - 12 PM
      {
        participantId: arjun.id,
        caregiverId: null,
        startTime: getShiftDate(3, 9),
        endTime: getShiftDate(3, 12),
        category: ShiftCategory.PERSONAL_CARE,
        type: ShiftType.assistance,
        badgeText: 'Vacant Shift',
        badgeIcon: 'alert',
        status: ShiftStatus.PENDING_APPROVAL,
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });