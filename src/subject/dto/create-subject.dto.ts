import { Month, MonthHalf } from '@prisma/client'
import { IsEnum, IsNumber, IsString } from 'class-validator'

export class CreateSubjectDto {
	@IsEnum(Month)
	month: Month

	@IsEnum(MonthHalf)
	monthHalf: MonthHalf

	@IsNumber()
	hours: number

	@IsString()
	planId: string
}
