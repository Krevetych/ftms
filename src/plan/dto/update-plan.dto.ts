import { Rate, Status } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePlanDto {
	@IsString()
	@IsOptional()
	year?: string

	@IsEnum(Rate)
	@IsOptional()
	rate?: Rate

	@IsNumber()
	@IsOptional()
	maxHours?: number

	@IsEnum(Status)
	@IsOptional()
	status?: Status

	@IsString()
	@IsOptional()
	objectId?: string

	@IsString()
	@IsOptional()
	teacherId?: string

	@IsString()
	@IsOptional()
	groupId?: string
}
