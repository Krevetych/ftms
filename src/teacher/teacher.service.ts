import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import * as XLSX from 'xlsx'

@Injectable()
export class TeacherService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateTeacherDto) {
		const existingTeacher = await this.prismaService.teacher.findUnique({
			where: {
				fio: dto.fio
			}
		})

		if (existingTeacher) {
			throw new BadRequestException('Teacher already exists')
		}

		const teacher = await this.prismaService.teacher.create({
			data: {
				...dto
			}
		})

		return teacher
	}

	async update(id: string, dto: UpdateTeacherDto) {
		const existingTeacher = await this.prismaService.teacher.findUnique({
			where: {
				id
			}
		})

		if (existingTeacher) {
			throw new BadRequestException('Teacher already exists')
		}

		const teacher = await this.prismaService.teacher.update({
			where: { id },
			data: {
				...dto
			}
		})

		return teacher
	}

	async findAll() {
		return await this.prismaService.teacher.findMany({
			orderBy: {
				fio: 'asc'
			}
		})
	}

	async delete(id: string) {
		const relatedRecords = await this.prismaService.plan.findMany({
			where: { teacherId: id }
		})

		if (relatedRecords.length === 0) {
			await this.prismaService.teacher.delete({ where: { id } })

			return true
		}

		throw new BadRequestException('Teacher has related records')
	}

	async upload(buff: Buffer) {
		const workbook = XLSX.read(buff, { type: 'buffer' })
		const sheetName = workbook.SheetNames[0]
		const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

		const headers = {
			fio: 'фио'
		}

		for (const row of worksheet) {
			try {
				const normalizedTeacherName: string = row[headers.fio]
					.trim()
					.toLowerCase()

				const existingTeacher = await this.prismaService.teacher.findUnique({
					where: {
						fio: row[headers.fio]
					}
				})

				if (existingTeacher) {
					const existingTeacherName = existingTeacher.fio.trim().toLowerCase()
					if (existingTeacherName === normalizedTeacherName) {
						continue
					}
				}

				await this.prismaService.teacher.create({
					data: {
						fio: row[headers.fio]
					}
				})
			} catch (error) {
				throw new BadRequestException("Can't create teacher")
			}
		}

		return { message: 'Success' }
	}
}
