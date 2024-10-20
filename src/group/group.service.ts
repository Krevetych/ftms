import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { Course, Status, Type } from '@prisma/client'
import * as XLSX from 'xlsx'
import { type } from 'os'

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

	async findByFilters(type?: Type, course?: Course, status?: Status) {
		return await this.prismaService.group.findMany({
			where: {
				type: type || undefined,
				course: course || undefined,
				status: status || undefined
			}
		})
	}

	async delete(id: string) {
		await this.prismaService.group.delete({ where: { id } })

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

		const statusMapping: { [key: string]: string } = {
			Активная: 'ACTIVE',
			Выпуск: 'INACTIVE'
		}

		for (const row of worksheet) {
			await this.prismaService.group.create({
				data: {
					name: row['name'],
					type: typeMapping[row['type']] as Type,
					course: courseMapping[row['course']] as Course,
					status: statusMapping[row['status']] as Status
				}
			})
		}

		return { message: 'Success' }
	}
}
