import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { GroupModule } from './group/group.module'
import { TeacherModule } from './teacher/teacher.module'
import { ObjectModule } from './object/object.module'
import { SubjectModule } from './subject/subject.module'
import { PlanModule } from './plan/plan.module'

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET
		}),
		UserModule,
		AuthModule,
		GroupModule,
		TeacherModule,
		ObjectModule,
		SubjectModule,
		PlanModule
	],
	controllers: [],
	providers: [PrismaService]
})
export class AppModule {}
