import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Put,
	Query,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { PlanService } from './plan.service'
import { CreatePlanDto } from './dto/create-plan.dto'
import { UpdatePlanDto } from './dto/update-plan.dto'
import { JwtGuard } from 'src/utils/guards/jwt.guard'
import { Month, MonthHalf, Rate, Term } from '@prisma/client'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@Post('create')
	@UseGuards(JwtGuard)
	async create(@Body() dto: CreatePlanDto) {
		return await this.planService.create(dto)
	}

	@Post('upload')
	@UseGuards(JwtGuard)
	@UseInterceptors(FileInterceptor('file'))
	async upload(@UploadedFile() file: Express.Multer.File) {
		return await this.planService.upload(file.buffer)
	}

	@Get('find_by_filters')
	@UseGuards(JwtGuard)
	async findByFilters(
		@Query('year') year: string,
		@Query('rate') rate: Rate,
		@Query('month') month: Month,
		@Query('monthHalf') monthHalf: MonthHalf,
		@Query('term') term: Term
	) {
		return await this.planService.findByFilters(
			year,
			rate,
			month,
			monthHalf,
			term
		)
	}

	@Get('unload')
	async unload(
		@Query('year') year: string,
		@Query('rate') rate: Rate,
		@Query('month') month: Month,
		@Query('monthHalf') monthHalf: MonthHalf,
		@Query('term') term: Term,
		@Res() res: Response
	) {
		const excelBuff = await this.planService.unload(
			year,
			rate,
			term,
			month,
			monthHalf
		)

		res.set({
			'Content-Type':
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': 'attachment; filename=plans.xlsx'
		})

		res.send(excelBuff)
	}

	@Get('find_by_plan')
	@UseGuards(JwtGuard)
	async findByPlan(
		@Query('year') year: string,
		@Query('rate') rate: Rate,
		@Query('objectId') objectId: string,
		@Query('teacherId') teacherId: string,
		@Query('groupId') groupId: string
	) {
		return await this.planService.findByPlan(
			year,
			rate,
			objectId,
			teacherId,
			groupId
		)
	}

	@Get('find_by_id')
	@UseGuards(JwtGuard)
	async findById(@Query('id') id: string) {
		return await this.planService.findById(id)
	}

	@Patch('update')
	@UseGuards(JwtGuard)
	async update(@Body() data: UpdatePlanDto, @Query('id') id: string) {
		return await this.planService.update(id, data)
	}

	@Get('find_all')
	@UseGuards(JwtGuard)
	async findAll() {
		return await this.planService.findAll()
	}

	@Get('find_all_d')
	@UseGuards(JwtGuard)
	async findAllD() {
		return await this.planService.findAllD()
	}

	@Delete('delete')
	@UseGuards(JwtGuard)
	async delete(@Query('id') id: string) {
		return await this.planService.delete(id)
	}

	@Delete('force_delete')
	@UseGuards(JwtGuard)
	async forceDelete(@Query('id') id: string) {
		return await this.planService.forceDelete(id)
	}

	@Put('restore')
	@UseGuards(JwtGuard)
	async restore(@Query('id') id: string) {
		return await this.planService.restore(id)
	}
}
