import { Module } from '@nestjs/common'
import { TokenService } from 'src/auth/services/token.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { ObjectController } from './object.controller'
import { ObjectService } from './object.service'

@Module({
	controllers: [ObjectController],
	providers: [ObjectService, PrismaService, TokenService, UserService]
})
export class ObjectModule {}
