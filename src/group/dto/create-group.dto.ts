import { Kind, Type } from '@prisma/client'
import { IsEnum, IsString } from 'class-validator'

export class CreateGroupDto {
	@IsString()
	name: string

	@IsEnum(Kind)
	kind: Kind

	@IsEnum(Type)
	type: Type
}
