import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { UserService } from 'src/user/user.service'
import { TokenService } from './services/token.service'
import { TokenController } from './controllers/token.controller'

@Module({
	controllers: [AuthController, TokenController],
	providers: [AuthService, PrismaService, UserService, TokenService]
})
export class AuthModule {}
