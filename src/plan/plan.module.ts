import { Module } from '@nestjs/common'
import { TokenService } from 'src/auth/services/token.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { PlanController } from './plan.controller'
import { PlanService } from './plan.service'

@Module({
	controllers: [PlanController],
	providers: [PlanService, PrismaService, TokenService, UserService]
})
export class PlanModule {}
