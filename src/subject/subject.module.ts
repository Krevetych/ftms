import { Module } from '@nestjs/common'
import { TokenService } from 'src/auth/services/token.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { SubjectController } from './subject.controller'
import { SubjectService, SubjectTermService } from './subject.service'

@Module({
	controllers: [SubjectController],
	providers: [
		SubjectService,
		SubjectTermService,
		PrismaService,
		TokenService,
		UserService
	]
})
export class SubjectModule {}
