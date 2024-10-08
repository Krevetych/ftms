import { IsOptional, IsString } from 'class-validator'

export class UpdateTeacherDto {
	@IsString()
	@IsOptional()
	fio?: string
}
