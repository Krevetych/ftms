import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Query,
	UseGuards
} from '@nestjs/common'
import { SubjectService } from './subject.service'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { JwtGuard } from 'src/utils/guards/jwt.guard'
import { Rate } from '@prisma/client'

@Controller('subject')
export class SubjectController {
	constructor(private readonly subjectService: SubjectService) {}

	@Post('create')
	@UseGuards(JwtGuard)
	async create(@Body() dto: CreateSubjectDto) {
		return this.subjectService.create(dto)
	}

	@Patch('update')
	@UseGuards(JwtGuard)
	async update(@Body() dto: UpdateSubjectDto, @Query('id') id: string) {
		return this.subjectService.update(id, dto)
	}

	@Get('find_by_rate')
	@UseGuards(JwtGuard)
	async findByRate(@Query('rate') rate: Rate) {
		return this.subjectService.findByRate(rate)
	}

	@Delete('delete')
	@UseGuards(JwtGuard)
	async delete(@Query('id') id: string) {
		return this.subjectService.delete(id)
	}
}
