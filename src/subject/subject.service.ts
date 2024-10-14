import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'

@Injectable()
export class SubjectService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateSubjectDto) {
		const plan = await this.prismaService.plan.findFirst({
			where: {
				id: dto.planId
			}
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		if (plan.maxHours < dto.hours) {
			throw new BadRequestException('Max hours exceeded')
		}

		await this.prismaService.plan.update({
			where: { id: dto.planId },
			data: {
				maxHours: plan.maxHours - dto.hours
			}
		})

		const subject = await this.prismaService.subject.create({
			data: {
				...dto
			}
		})

		return subject
	}

	async update(id: string, dto: UpdateSubjectDto) {
		const subject = await this.prismaService.subject.update({
			where: { id },
			data: {
				...dto
			}
		})

		return subject
	}

	async findAll() {
		return await this.prismaService.subject.findMany({
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
