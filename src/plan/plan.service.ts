import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreatePlanDto } from './dto/create-plan.dto'
import { UpdatePlanDto } from './dto/update-plan.dto'
import { Month, MonthHalf } from '@prisma/client'

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
		return await this.prismaService.plan.findMany({
			select: {
				id: true,
				year: true,
				rate: true,
				maxHours: true,
				Object: true,
				teacher: true,
				group: true
			}
		})
	}

	async findByFilters(
		year: string,
		teacher: string,
		month: Month,
		monthHalf: MonthHalf
	) {
		const res = await this.prismaService.plan.findMany({
			where: {
				year: year,
				teacher: {
					fio: teacher
				},
				Subject: {
					some: {
						month: month,
						monthHalf: monthHalf
					}
				}
			},
			include: {
				teacher: true,
				Subject: {
					where: {
						month: month,
						monthHalf: monthHalf
					}
				},
				Object: true,
				group: true
			}
		})

		return res
	}

	async delete(id: string) {
		await this.prismaService.plan.delete({ where: { id } })

		return true
	}
}
