import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'

@Injectable()
export class GroupService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateGroupDto) {
		const group = await this.prismaService.group.create({
			data: {
				...dto
			}
		})

		return group
	}

	async update(id: string, dto: UpdateGroupDto) {
		const group = await this.prismaService.group.update({
			where: { id },
			data: dto
		})

		return group
	}

	async findAll() {
		return await this.prismaService.group.findMany()
	}

	async delete(id: string) {
		await this.prismaService.group.delete({ where: { id } })

		return true
	}
}
