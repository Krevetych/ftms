import { IsOptional, IsString } from 'class-validator'
import { CreateObjectDto } from './create-object.dto'

export class UpdateObjectDto {
	@IsString()
	@IsOptional()
	name?: string
}
