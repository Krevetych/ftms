import { Course, Type } from '@prisma/client'
import { IsEnum, IsString } from 'class-validator'

export class CreateGroupDto {
	@IsString()
	name: string

	@IsEnum(Type)
	type: Type

	@IsEnum(Course)
	course: Course
}
