import { Kind, Type } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'


export class UpdateGroupDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsEnum(Kind)
    @IsOptional()
    kind?: Kind

    @IsEnum(Type)
    @IsOptional()
    type?: Type
}