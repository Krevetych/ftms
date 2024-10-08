import { Module } from '@nestjs/common'
import { SubjectService } from './subject.service'
import { SubjectController } from './subject.controller'
import { PrismaService } from 'src/prisma.service'
import { TokenService } from 'src/auth/services/token.service'
import { UserService } from 'src/user/user.service'

@Module({
	controllers: [SubjectController],
	providers: [SubjectService, PrismaService, TokenService, UserService]
})
export class SubjectModule {}
