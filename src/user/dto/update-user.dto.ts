import { IsString } from 'class-validator'

export class UpdateUserDto {
	@IsString()
	login?: string

	@IsString()
	password?: string
}
