import { Module } from '@nestjs/common';
import { ObjectService } from './object.service';
import { ObjectController } from './object.controller';
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [ObjectController],
  providers: [ObjectService, PrismaService],
})
export class ObjectModule {}
