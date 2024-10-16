import { Month, MonthHalf, Term } from '@prisma/client'
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

export class UpdateSubjectTermDto {
	@IsEnum(Term)
	@IsOptional()
	term?: Term

	@IsNumber()
	@IsOptional()
	hours?: number

	@IsString()
	@IsOptional()
	planId?: string
}
