import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Optional: Makes PrismaService globally available across all modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- MUST BE EXPORTED HERE
})
export class PrismaModule {}