import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateObjectDto } from './dto/create-object.dto'
import { UpdateObjectDto } from './dto/update-object.dto'
import * as XLSX from 'xlsx'

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

	async update(id: string, dto: UpdateObjectDto) {
		const object = await this.prismaService.object.update({
			where: { id },
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

	async upload(buff: Buffer) {
		const workbook = XLSX.read(buff, { type: 'buffer' })
		const sheetName = workbook.SheetNames[0]
		const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

		for (const row of worksheet) {
			await this.prismaService.object.create({
				data: {
					name: row['name']
				}
			})
		}

		return { message: 'Success' }
	}
}
