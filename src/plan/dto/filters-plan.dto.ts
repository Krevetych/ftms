import { Month, MonthHalf, Rate, Term } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class FiltersPlanDto {
	@IsOptional()
	@IsString()
	year?: string

	@IsOptional()
	@IsEnum(Rate)
	rate?: Rate

	@IsOptional()
	@IsEnum(Term)
	term?: Term

	@IsOptional()
	@IsEnum(Month)
	month?: Month

	@IsOptional()
	@IsEnum(MonthHalf)
	monthHalf?: MonthHalf
}
