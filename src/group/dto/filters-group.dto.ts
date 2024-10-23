import { Course, Status, Type } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'

export class FiltersGroupDto {
	@IsEnum(Type)
	@IsOptional()
	type?: Type

	@IsEnum(Course)
	@IsOptional()
	course?: Course

	@IsEnum(Status)
	@IsOptional()
	status?: Status
}
