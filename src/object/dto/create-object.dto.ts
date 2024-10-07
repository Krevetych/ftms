import { IsString } from 'class-validator'

export class CreateObjectDto {
	@IsString()
	name: string
}
