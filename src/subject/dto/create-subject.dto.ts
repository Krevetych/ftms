import { Month, MonthHalf, Term } from '@prisma/client'
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

export class CreateSubjectTermDto {
	@IsEnum(Term)
	term: Term

	@IsNumber()
	hours: number

	@IsString()
	planId: string
}
