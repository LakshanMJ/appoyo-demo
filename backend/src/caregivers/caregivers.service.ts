import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaregiversService {

  constructor(
    private prisma: PrismaService,
  ) { }

  findAll() {
    return this.prisma.caregiver.findMany({
      include: {
        user: true
      }
    });
  }
}