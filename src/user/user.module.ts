import { Module } from '@nestjs/common'
import { TokenService } from 'src/auth/services/token.service'
import { PrismaService } from 'src/prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, TokenService, UserService]
})
export class UserModule {}
