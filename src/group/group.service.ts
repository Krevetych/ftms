import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { Course, Type } from '@prisma/client'
import * as XLSX from 'xlsx'

@Injectable()
export class GroupService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateGroupDto) {
		const trimName = dto.name.trim().replace(/\s+/g, ' ')

		const existingGroup = await this.prismaService.group.findUnique({
			where: {
				name: trimName
			}
		})

		if (existingGroup) {
			throw new BadRequestException('Group already exists')
		}

		const group = await this.prismaService.group.create({
			data: {
				...dto,
				name: trimName
			}
		})

		return group
	}

	async update(id: string, dto: UpdateGroupDto) {
		const trimName = dto.name.trim().replace(/\s+/g, ' ')

		const existingGroup = await this.prismaService.group.findUnique({
			where: {
				name: trimName
			}
		})

		if (existingGroup && existingGroup.id !== id) {
			throw new BadRequestException('Group already exists')
		}

		return await this.prismaService.group.update({
			where: { id },
			data: {
				...dto,
				name: trimName
			}
		})
	}

	async findAll() {
		return await this.prismaService.group.findMany({
			where: {
				isDeleted: false
			},
			orderBy: {
				name: 'asc'
			}
		})
	}

	async findAllD() {
		return await this.prismaService.group.findMany({
			where: {
				isDeleted: true
			},
			orderBy: {
				name: 'asc'
			}
		})
	}

	async findByFilters(type?: Type, course?: Course) {
		return await this.prismaService.group.findMany({
			where: {
				type: type || undefined,
				course: course || undefined,
				isDeleted: false
			},
			orderBy: {
				name: 'asc'
			}
		})
	}

	async delete(id: string) {
		const relatedRecords = await this.prismaService.plan.findMany({
			where: { groupId: id }
		})

		if (relatedRecords.length === 0) {
			await this.prismaService.group.update({
				where: { id },
				data: { isDeleted: true }
			})

			return true
		}

		throw new BadRequestException('Group has related records')
	}

	async forceDelete(id: string) {
		await this.prismaService.group.delete({
			where: { id }
		})

		return true
	}

	async restore(id: string) {
		await this.prismaService.group.update({
			where: { id },
			data: { isDeleted: false }
		})

		return true
	}

	async upload(buff: Buffer) {
		const workbook = XLSX.read(buff, { type: 'buffer' })
		const sheetName = workbook.SheetNames[0]
		const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

		const typeMapping: { [key: string]: string } = {
			НПО: 'NPO',
			Бюджет: 'BUDGET',
			Внебюджет: 'NON_BUDGET'
		}

		const courseMapping: { [key: string]: string | null } = {
			'1': 'FIRST',
			'2': 'SECOND',
			'3': 'THIRD',
			'4': 'FOURTH',
			'-': 'INACTIVE'
		}

		const headers = {
			name: 'название',
			type: 'тип',
			course: 'курс'
		}

		await this.prismaService.$transaction(async prisma => {
			for (const row of worksheet) {
				const requiredHeaders = [headers.name, headers.type, headers.course]
				for (const header of requiredHeaders) {
					if (row[header] === undefined) {
						throw new BadRequestException(`Заголовок "${header}" не найден`)
					}
				}

				const normalizedGroupName: string = row[headers.name]
					.trim()
					.toLowerCase()

				const existingGroup = await prisma.group.findUnique({
					where: { name: row[headers.name] }
				})

				if (existingGroup) {
					const existingGroupName = existingGroup.name.trim().toLowerCase()
					if (existingGroupName === normalizedGroupName) {
						continue
					}
				}

				await prisma.group.create({
					data: {
						name: row[headers.name],
						type: typeMapping[row[headers.type]] as Type,
						course: courseMapping[row[headers.course]] as Course
					}
				})
			}
		})

		return { message: 'Success' }
	}
}
