import { Module } from '@nestjs/common'
import { TokenService } from 'src/auth/services/token.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { GroupController } from './group.controller'
import { GroupService } from './group.service'

@Module({
	controllers: [GroupController],
	providers: [GroupService, PrismaService, TokenService, UserService]
})
export class GroupModule {}
