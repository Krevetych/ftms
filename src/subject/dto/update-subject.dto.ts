import { Month, MonthHalf } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateSubjectDto {
	@IsEnum(Month)
	@IsOptional()
	month?: Month

	@IsEnum(MonthHalf)
	@IsOptional()
	monthHalf?: MonthHalf

	@IsNumber()
	@IsOptional()
	hours?: number

	@IsString()
	@IsOptional()
	planId?: string
}
