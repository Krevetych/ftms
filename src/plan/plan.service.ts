import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreatePlanDto } from './dto/create-plan.dto'
import { UpdatePlanDto } from './dto/update-plan.dto'
import { Month, MonthHalf } from '@prisma/client'

@Injectable()
export class PlanService {
	constructor(private prismaService: PrismaService) {}

	async findById(id: string) {
		return await this.prismaService.plan.findUnique({
			where: {
				id: id
			}
		})
	}

	async create(dto: CreatePlanDto) {
		const existingPlan = await this.prismaService.plan.findUnique({
			where: {
				year_objectId_groupId: {
					year: dto.year,
					objectId: dto.objectId,
					groupId: dto.groupId
				}
			}
		})

		if (existingPlan) {
			throw new BadRequestException('Plan already exists')
		}

		const plan = await this.prismaService.plan.create({
			data: {
				year: dto.year,
				rate: dto.rate,
				maxHours: dto.maxHours,
				worked: dto.worked,
				Object: {
					connect: {
						id: dto.objectId
					}
				},
				teacher: {
					connect: {
						id: dto.teacherId
					}
				},
				group: {
					connect: {
						id: dto.groupId
					}
				}
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
				worked: true,
				Object: true,
				teacher: true,
				group: true
			}
		})
	}

	async findByFilters(
		year: string,
		teacher: string,
		month?: Month,
		monthHalf?: MonthHalf
	) {
		const res = await this.prismaService.plan.findMany({
			where: {
				year: year || undefined,
				teacher: {
					fio: teacher || undefined
				}
			},
			include: {
				teacher: true,
				Subject: {
					where: {
						...(month ? { month: month } : {}),
						...(monthHalf ? { monthHalf: monthHalf } : {})
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
