import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthController } from './controllers/auth.controller'
import { TokenController } from './controllers/token.controller'
import { AuthService } from './services/auth.service'
import { TokenService } from './services/token.service'

@Module({
	controllers: [AuthController, TokenController],
	providers: [AuthService, PrismaService, UserService, TokenService]
})
export class AuthModule {}
