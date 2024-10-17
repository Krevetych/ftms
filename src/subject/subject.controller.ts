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
import { Month, MonthHalf, Rate, Term, Type } from '@prisma/client'

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

	@Get('find_by_filters')
	@UseGuards(JwtGuard)
	async findByFilters(
		@Query('month') month: Month,
		@Query('monthHalf') monthHalf: MonthHalf,
		@Query('teacherId') teacherId: string,
		@Query('type') type: Type,
		@Query('groupId') groupId: string
	) {
		return this.subjectService.findByFilters(
			month,
			monthHalf,
			teacherId,
			type,
			groupId
		)
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

	@Get('find_by_filters_term')
	@UseGuards(JwtGuard)
	async findByFiltersTerm(
		@Query('term') term: Term,
		@Query('teacherId') teacherId: string,
		@Query('type') type: Type,
		@Query('groupId') groupId: string
	) {
		return this.subjectTermService.findByFilters(term, teacherId, type, groupId)
	}

	@Delete('delete_term')
	@UseGuards(JwtGuard)
	async deleteTerm(@Query('id') id: string) {
		return this.subjectTermService.delete(id)
	}
}
