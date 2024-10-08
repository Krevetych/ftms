import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreatePlanDto } from './dto/create-plan.dto'
import { UpdatePlanDto } from './dto/update-plan.dto'

@Injectable()
export class PlanService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreatePlanDto) {
		const plan = await this.prismaService.plan.create({
			data: {
				...dto
			}
		})

		return plan
	}

	async update(id: string, dto: UpdatePlanDto) {
		const plan = await this.prismaService.plan.update({
			where: { id },
			data: {
				...dto
			}
		})

		return plan
	}

	async findAll() {
		return await this.prismaService.plan.findMany()
	}

	async delete(id: string) {
		await this.prismaService.plan.delete({ where: { id } })

		return true
	}
}
