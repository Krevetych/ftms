import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'

@Injectable()
export class TeacherService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateTeacherDto) {
		const teacher = await this.prismaService.teacher.create({
			data: {
				...dto
			}
		})

		return teacher
	}

	async findAll() {
		return await this.prismaService.teacher.findMany()
	}

	async delete(id: string) {
		await this.prismaService.teacher.delete({ where: { id } })

		return true
	}
}
