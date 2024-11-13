import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import * as XLSX from 'xlsx'

@Injectable()
export class TeacherService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateTeacherDto) {
		const trimFio = dto.fio.trim().replace(/\s+/g, ' ')

		const existingTeacher = await this.prismaService.teacher.findUnique({
			where: {
				fio: trimFio
			}
		})

		if (existingTeacher) {
			throw new BadRequestException('Teacher already exists')
		}

		const teacher = await this.prismaService.teacher.create({
			data: {
				...dto,
				fio: trimFio
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

		const trimFio = dto.fio.trim().replace(/\s+/g, ' ')

		const teacher = await this.prismaService.teacher.update({
			where: { id },
			data: {
				...dto,
				fio: trimFio
			}
		})

		return teacher
	}

	async findAll() {
		return await this.prismaService.teacher.findMany({
			where: {
				isDeleted: false
			},
			orderBy: {
				fio: 'asc'
			}
		})
	}

	async findAllD() {
		return await this.prismaService.teacher.findMany({
			where: {
				isDeleted: true
			},
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
			await this.prismaService.teacher.update({
				where: { id },
				data: {
					isDeleted: true
				}
			})

			return true
		}

		throw new BadRequestException('Teacher has related records')
	}

	async forceDelete(id: string) {
		await this.prismaService.teacher.delete({
			where: { id }
		})

		return true
	}

	async restore(id: string) {
		await this.prismaService.teacher.update({
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
				if (row[headers.fio] === undefined) {
					throw new BadRequestException(`Заголовок "${headers.fio}" не найден`)
				} else {
					throw new BadRequestException("Can't create teacher")
				}
			}
		}

		return { message: 'Success' }
	}
}
