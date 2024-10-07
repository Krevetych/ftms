import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateObjectDto } from './dto/create-object.dto'

@Injectable()
export class ObjectService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateObjectDto) {
		const object = await this.prismaService.object.create({
			data: {
				...dto
			}
		})

		return object
	}

	async findAll() {
		return await this.prismaService.object.findMany()
	}

	async delete(id: string) {
		await this.prismaService.object.delete({ where: { id } })

		return true
	}
}
