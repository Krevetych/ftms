import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	login?: string

	@IsString()
	@IsOptional()
	password?: string

	@IsBoolean()
	@IsOptional()
	isAdmin?: boolean
}
