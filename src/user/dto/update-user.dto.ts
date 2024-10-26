import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	login?: string

	@IsString()
	@IsOptional()
	password?: string
}

export class UpdateUserPasswordDto {
	@IsString()
	oldPassword: string

	@IsString()
	newPassword: string

	@IsString()
	confirmPassword: string
}
