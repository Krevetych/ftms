import { Module } from '@nestjs/common'
import { TokenService } from 'src/auth/services/token.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { TeacherController } from './teacher.controller'
import { TeacherService } from './teacher.service'

@Module({
	controllers: [TeacherController],
	providers: [TeacherService, PrismaService, TokenService, UserService]
})
export class TeacherModule {}
