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
import { SubjectService, SubjectTermService } from './subject.service'
import {
	CreateSubjectDto,
	CreateSubjectTermDto
} from './dto/create-subject.dto'
import {
	UpdateSubjectDto,
	UpdateSubjectTermDto
} from './dto/update-subject.dto'
import { JwtGuard } from 'src/utils/guards/jwt.guard'
import { Rate } from '@prisma/client'

@Controller('subject')
export class SubjectController {
	constructor(
		private readonly subjectService: SubjectService,
		private readonly subjectTermService: SubjectTermService
	) {}

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

	@Post('create_term')
	@UseGuards(JwtGuard)
	async createTerm(@Body() dto: CreateSubjectTermDto) {
		return this.subjectTermService.create(dto)
	}

	@Patch('update_term')
	@UseGuards(JwtGuard)
	async updateTerm(@Body() dto: UpdateSubjectTermDto, @Query('id') id: string) {
		return this.subjectTermService.update(id, dto)
	}

	@Get('find_by_rate_term')
	@UseGuards(JwtGuard)
	async findByRateTerm(@Query('rate') rate: Rate) {
		return this.subjectTermService.findByRate(rate)
	}

	@Delete('delete_term')
	@UseGuards(JwtGuard)
	async deleteTerm(@Query('id') id: string) {
		return this.subjectTermService.delete(id)
	}
}
