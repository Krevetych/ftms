import { Module } from '@nestjs/common'
import { PlanService } from './plan.service'
import { PlanController } from './plan.controller'
import { PrismaService } from 'src/prisma.service'
import { TokenService } from 'src/auth/services/token.service'
import { UserService } from 'src/user/user.service'

@Module({
	controllers: [PlanController],
	providers: [PlanService, PrismaService, TokenService, UserService]
})
export class PlanModule {}
