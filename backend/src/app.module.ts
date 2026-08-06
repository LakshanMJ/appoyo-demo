import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { ParticipantsModule } from './participants/participants.module';
import { CaregiversModule } from './caregivers/caregivers.module';
import { ShiftsModule } from './shifts/shifts.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, OrganizationsModule, UsersModule, ParticipantsModule, CaregiversModule, ShiftsModule, DashboardModule],
})
export class AppModule {}
