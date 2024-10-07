import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateSubjectDto } from './dto/create-subject.dto'

@Injectable()
export class SubjectService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateSubjectDto) {
		const subject = await this.prismaService.subject.create({
			data: {
				...dto
			}
		})

		return subject
	}

	async findAll() {
		return await this.prismaService.subject.findMany()
	}

	async delete(id: string) {
		await this.prismaService.subject.delete({ where: { id } })

		return true
	}
}
