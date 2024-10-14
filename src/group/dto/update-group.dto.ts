import { Type } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateGroupDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsEnum(Type)
	@IsOptional()
	type?: Type
}
