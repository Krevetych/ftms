import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prisma.service'
import { TokenService } from 'src/auth/services/token.service'

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, TokenService, UserService]
})
export class UserModule {}
