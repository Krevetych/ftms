import { Module } from '@nestjs/common'
import { TeacherService } from './teacher.service'
import { TeacherController } from './teacher.controller'
import { PrismaService } from 'src/prisma.service'
import { TokenService } from 'src/auth/services/token.service'
import { UserService } from 'src/user/user.service'

@Module({
	controllers: [TeacherController],
	providers: [TeacherService, PrismaService, TokenService, UserService]
})
export class TeacherModule {}
