import { PrismaClient, ShiftCategory, ShiftType, ShiftStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Clear existing records
  await prisma.shift.deleteMany();
  await prisma.caregiver.deleteMany();
  await prisma.user.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.organization.deleteMany();

  // 2. Create Organization
  const org = await prisma.organization.create({
    data: { name: 'Appoyo HQ' },
  });

  // 3. Create Participants
  const arjun = await prisma.participant.create({
    data: { organizationId: org.id, name: 'Arjun Patel' },
  });
  const chloe = await prisma.participant.create({
    data: { organizationId: org.id, name: 'Chloe Thompson' },
  });
  const danielle = await prisma.participant.create({
    data: { organizationId: org.id, name: 'Danielle Smith' },
  });

  // Helper function to create Caregivers with Users
  const createCaregiver = async (name: string, email: string) => {
    const user = await prisma.user.create({
      data: {
        organizationId: org.id,
        name,
        email,
        role: UserRole.CAREGIVER,
      },
    });
    return prisma.caregiver.create({
      data: {
        organizationId: org.id,
        userId: user.id,
        name,
      },
    });
  };

  // 4. Create Caregivers
  const ethan = await createCaregiver('Ethan Taylor', 'ethan@appoyo.com');
  const ava = await createCaregiver('Ava Williams', 'ava@appoyo.com');
  const noah = await createCaregiver('Noah Harris', 'noah@appoyo.com');
  const isla = await createCaregiver('Isla Campbell', 'isla@appoyo.com');

  // 5. Create Baseline Shifts (Anchor dates to current week)
  const today = new Date();
  const getShiftDate = (dayOffset: number, hour: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  await prisma.shift.createMany({
    data: [
      // Arjun's Shifts
      {
        organizationId: org.id,
        participantId: arjun.id,
        caregiverId: ethan.id,
        startTime: getShiftDate(0, 7),
        endTime: getShiftDate(0, 20),
        category: ShiftCategory.PERSONAL_CARE, // Pink
        type: ShiftType.ASSISTANCE,
        badgeText: 'Assistance',
        badgeIcon: 'shield',
        status: ShiftStatus.CONFIRMED,
      },
      {
        organizationId: org.id,
        participantId: arjun.id,
        caregiverId: ava.id,
        startTime: getShiftDate(0, 8),
        endTime: getShiftDate(0, 10),
        category: ShiftCategory.DOMESTIC, // Yellow
        type: ShiftType.ASSISTANCE,
        badgeText: 'Assistance',
        badgeIcon: 'shield',
        status: ShiftStatus.CONFIRMED,
      },

      // Chloe's Shifts
      {
        organizationId: org.id,
        participantId: chloe.id,
        caregiverId: noah.id,
        startTime: getShiftDate(1, 7),
        endTime: getShiftDate(1, 8),
        category: ShiftCategory.CLINICAL, // Lavender
        type: ShiftType.NURSING,
        badgeText: 'Nursing',
        badgeIcon: 'shield',
        status: ShiftStatus.CONFIRMED,
      },
      {
        organizationId: org.id,
        participantId: chloe.id,
        caregiverId: isla.id,
        startTime: getShiftDate(2, 16),
        endTime: getShiftDate(2, 21),
        category: ShiftCategory.COMMUNITY, // Teal
        type: ShiftType.TRAVEL_TRANSPORT,
        badgeText: 'Transport',
        badgeIcon: 'car',
        status: ShiftStatus.CONFIRMED,
      },

      // Vacant Shift (No caregiverId)
      {
        organizationId: org.id,
        participantId: arjun.id,
        caregiverId: null,
        startTime: getShiftDate(3, 9),
        endTime: getShiftDate(3, 12),
        category: ShiftCategory.PERSONAL_CARE,
        type: ShiftType.ASSISTANCE,
        badgeText: 'Vacant Shift',
        badgeIcon: 'alert',
        status: ShiftStatus.PENDING_APPROVAL,
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });