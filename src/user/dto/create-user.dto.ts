import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
	@IsString()
	login: string

	@IsString()
	password: string

	@IsBoolean()
	isAdmin: boolean
}

export class LoginUserDto {
	@IsString()
	login: string

	@IsString()
	password: string
}
