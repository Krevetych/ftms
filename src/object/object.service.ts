import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateObjectDto } from './dto/create-object.dto'
import { UpdateObjectDto } from './dto/update-object.dto'
import * as XLSX from 'xlsx'

@Injectable()
export class ObjectService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateObjectDto) {
		const trimName = dto.name.trim().replace(/\s+/g, ' ')

		const existingObject = await this.prismaService.object.findUnique({
			where: {
				name: trimName
			}
		})

		if (existingObject) {
			throw new BadRequestException('Object already exists')
		}

		return await this.prismaService.object.create({
			data: {
				...dto,
				name: trimName
			}
		})
	}

	async update(id: string, dto: UpdateObjectDto) {
		const trimName = dto.name.trim().replace(/\s+/g, ' ')

		const object = await this.prismaService.object.findUnique({
			where: {
				name: trimName
			}
		})

		if (object && object.id !== id) {
			throw new BadRequestException('Object already exists')
		}

		return await this.prismaService.object.update({
			where: {
				id
			},
			data: {
				...dto,
				name: trimName
			}
		})
	}

	async findAll() {
		return await this.prismaService.object.findMany({
			where: {
				isDeleted: false
			},
			orderBy: {
				name: 'asc'
			}
		})
	}

	async findAllD() {
		return await this.prismaService.object.findMany({
			where: {
				isDeleted: true
			},
			orderBy: {
				name: 'asc'
			}
		})
	}

	async delete(id: string) {
		const relatedRecords = await this.prismaService.plan.findMany({
			where: { objectId: id }
		})

		if (relatedRecords.length === 0) {
			await this.prismaService.object.update({
				where: { id },
				data: {
					isDeleted: true
				}
			})

			return true
		}

		throw new BadRequestException('Object has related records')
	}

	async forceDelete(id: string) {
		await this.prismaService.object.delete({
			where: { id }
		})

		return true
	}

	async restore(id: string) {
		await this.prismaService.object.update({
			where: { id },
			data: {
				isDeleted: false
			}
		})

		return true
	}

	async upload(buff: Buffer) {
		const workbook = XLSX.read(buff, { type: 'buffer' })
		const sheetName = workbook.SheetNames[0]
		const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

		const headers = {
			name: 'название'
		}

		await this.prismaService.$transaction(async prisma => {
			for (const row of worksheet) {
				if (row[headers.name] === undefined) {
					throw new BadRequestException(`Заголовок "${headers.name}" не найден`)
				}

				const normalizedObjectName: string = row[headers.name]
					.trim()
					.toLowerCase()

				const existingObject = await this.prismaService.object.findUnique({
					where: {
						name: row[headers.name]
					}
				})

				if (existingObject) {
					const existingObjectName = existingObject.name.trim().toLowerCase()
					if (existingObjectName === normalizedObjectName) {
						continue
					}
				}

				await this.prismaService.object.create({
					data: {
						name: row[headers.name]
					}
				})
			}
		})

		return { message: 'Success' }
	}
}
