import {
  PrismaClient,
  UserRole,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.shift.deleteMany();
  await prisma.caregiver.deleteMany();
  await prisma.user.deleteMany();
  await prisma.participant.deleteMany();

  const caregivers = [
    {
      name: 'Hank Moody',
      email: 'hank@appoyo.com',
      avatarUrl: '/avatar/hank.jpg',
    },
    {
      name: 'Mia Lewis',
      email: 'mia@appoyo.com',
      avatarUrl: '/avatar/mia.jpg',
    },
    {
      name: 'Chuck Runkle',
      email: 'chuck@appoyo.com',
      avatarUrl: '/avatar/chuck.jpg',
    },
    {
      name: 'Pamela Adlon',
      email: 'pamela@appoyo.com',
      avatarUrl: '/avatar/pamela.jpg',
    },
  ];

  for (const caregiver of caregivers) {
    const user = await prisma.user.create({
      data: {
        name: caregiver.name,
        email: caregiver.email,
        role: UserRole.CAREGIVER,
      },
    });

    await prisma.caregiver.create({
      data: {
        userId: user.id,
        name: caregiver.name,
        avatarUrl: caregiver.avatarUrl,
      },
    });
  }

  console.log('Caregivers seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });