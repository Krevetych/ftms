import { Module } from '@nestjs/common'
import { ObjectService } from './object.service'
import { ObjectController } from './object.controller'
import { PrismaService } from 'src/prisma.service'
import { TokenService } from 'src/auth/services/token.service'
import { UserService } from 'src/user/user.service'

@Module({
	controllers: [ObjectController],
	providers: [ObjectService, PrismaService, TokenService, UserService]
})
export class ObjectModule {}
