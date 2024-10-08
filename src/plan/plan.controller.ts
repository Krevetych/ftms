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

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@Post('create')
  @UseGuards(JwtGuard)
	async create(@Body() dto: CreatePlanDto) {
		return await this.planService.create(dto)
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
