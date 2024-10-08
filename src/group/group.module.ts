import { Module } from '@nestjs/common'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'
import { PrismaService } from 'src/prisma.service'
import { TokenService } from 'src/auth/services/token.service'
import { UserService } from 'src/user/user.service'

@Module({
	controllers: [GroupController],
	providers: [GroupService, PrismaService, TokenService, UserService]
})
export class GroupModule {}
