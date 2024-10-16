import { Rate, Status } from '@prisma/client'
import { IsEnum, IsNumber, IsString } from 'class-validator'

export class CreatePlanDto {
	@IsString()
	year: string

	@IsEnum(Rate)
	rate: Rate

	@IsNumber()
	maxHours: number
	
	@IsNumber()
	worked: number

	@IsEnum(Status)
	status: Status

	@IsString()
	objectId: string

	@IsString()
	teacherId: string

	@IsString()
	groupId: string
}
