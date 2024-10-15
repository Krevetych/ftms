import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { Rate } from '@prisma/client'

@Injectable()
export class SubjectService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateSubjectDto) {
		const existingSubject = await this.prismaService.subject.findUnique({
			where: {
				month_monthHalf_planId: {
					month: dto.month,
					monthHalf: dto.monthHalf,
					planId: dto.planId
				}
			}
		})

		if (existingSubject) {
			throw new BadRequestException('Subject already exists')
		}

		const plan = await this.prismaService.plan.findFirst({
			where: {
				id: dto.planId
			}
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		if (plan.maxHours < plan.worked + dto.hours) {
			throw new BadRequestException('Max hours exceeded')
		}

		const subject = await this.prismaService.subject.create({
			data: {
				...dto
			}
		})

		await this.prismaService.plan.update({
			where: {
				id: dto.planId
			},
			data: {
				worked: plan.worked + dto.hours
			}
		})

		return subject
	}

	async update(id: string, dto: UpdateSubjectDto) {
		const subject = await this.prismaService.subject.findUnique({
			where: { id },
			include: {
				plan: true
			}
		})

		if (!subject) {
			throw new NotFoundException('Subject not found')
		}

		const updateSubject = await this.prismaService.subject.update({
			where: { id },
			data: {
				...dto
			}
		})

		await this.prismaService.plan.update({
			where: { id: subject.planId },
			data: {
				worked: {
					decrement: subject.hours
				}
			}
		})

		await this.prismaService.plan.update({
			where: { id: subject.planId },
			data: {
				worked: {
					increment: dto.hours
				}
			}
		})

		return updateSubject
	}

	async findByRate(rate: Rate) {
		return await this.prismaService.subject.findMany({
			where: {
				plan: {
					rate: rate
				}
			},
			select: {
				id: true,
				hours: true,
				month: true,
				monthHalf: true,
				plan: true
			}
		})
	}

	async delete(id: string) {
		await this.prismaService.subject.delete({ where: { id } })

		return true
	}
}
