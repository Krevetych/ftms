import { Rate } from '@prisma/client'
import { IsEnum, IsNumber, IsString } from 'class-validator'

export class CreatePlanDto {
	@IsString()
	year: string

	@IsEnum(Rate)
	rate: Rate

	@IsNumber()
	maxHours: number

	@IsString()
	objectId: string
	teacherId: string
	groupId: string
}
