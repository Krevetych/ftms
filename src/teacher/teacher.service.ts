import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import * as XLSX from 'xlsx'

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

	async update(id: string, dto: UpdateTeacherDto) {
		const teacher = await this.prismaService.teacher.update({
			where: { id },
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

	async upload(buff: Buffer) {
		const workbook = XLSX.read(buff, { type: 'buffer' })
		const sheetName = workbook.SheetNames[0]
		const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

		for (const row of worksheet) {
			await this.prismaService.teacher.create({
				data: {
					fio: row['FIO']
				}
			})
		}

		return { message: 'Success' }
	}
}
