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
import { PlanService } from './plan.service'
import { CreatePlanDto } from './dto/create-plan.dto'
import { UpdatePlanDto } from './dto/update-plan.dto'
import { JwtGuard } from 'src/utils/guards/jwt.guard'
import { Month, MonthHalf } from '@prisma/client'

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@Post('create')
	@UseGuards(JwtGuard)
	async create(@Body() dto: CreatePlanDto) {
		return await this.planService.create(dto)
	}

	@Get('find_by_filters')
	@UseGuards(JwtGuard)
	async findByFilters(
		@Query('year') year: string,
		@Query('teacher') teacher: string,
		@Query('month') month: Month,
		@Query('monthHalf') monthHalf: MonthHalf
	) {
		return await this.planService.findByFilters(year, teacher, month, monthHalf)
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

	@Delete('delete')
	@UseGuards(JwtGuard)
	async delete(@Query('id') id: string) {
		return await this.planService.delete(id)
	}
}
