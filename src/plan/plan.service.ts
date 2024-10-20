import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreatePlanDto } from './dto/create-plan.dto'
import { UpdatePlanDto } from './dto/update-plan.dto'
import { Month, MonthHalf, Rate, Status, Term, Type } from '@prisma/client'
import * as XLSX from 'xlsx'

@Injectable()
export class PlanService {
	constructor(private prismaService: PrismaService) {}

	async findById(id: string) {
		return await this.prismaService.plan.findUnique({
			where: {
				id: id
			}
		})
	}

	async create(dto: CreatePlanDto) {
		const existingPlan = await this.prismaService.plan.findUnique({
			where: {
				year_objectId_groupId_teacherId: {
					year: dto.year,
					objectId: dto.objectId,
					groupId: dto.groupId,
					teacherId: dto.teacherId
				}
			}
		})

		if (existingPlan) {
			throw new BadRequestException('Plan already exists')
		}

		const plan = await this.prismaService.plan.create({
			data: {
				year: dto.year,
				rate: dto.rate,
				maxHours: dto.maxHours,
				status: dto.status,
				worked: dto.worked,
				Object: {
					connect: {
						id: dto.objectId
					}
				},
				teacher: {
					connect: {
						id: dto.teacherId
					}
				},
				group: {
					connect: {
						id: dto.groupId
					}
				}
			}
		})

		return plan
	}

	async update(id: string, dto: UpdatePlanDto) {
		const plan = await this.prismaService.plan.update({
			where: { id },
			data: {
				...dto
			}
		})

		return plan
	}

	async findAll() {
		return await this.prismaService.plan.findMany({
			select: {
				id: true,
				year: true,
				rate: true,
				maxHours: true,
				worked: true,
				status: true,
				Object: true,
				teacher: true,
				group: true
			}
		})
	}

	async findByFilters(
		year: string,
		teacher: string,
		rate: Rate,
		month?: Month,
		monthHalf?: MonthHalf,
		term?: Term
	) {
		const res = await this.prismaService.plan.findMany({
			where: {
				year: year || undefined,
				teacher: {
					fio: teacher || undefined
				},
				rate: rate || undefined
			},
			include: {
				teacher: true,
				Subject: {
					where: {
						...(month ? { month: month } : {}),
						...(monthHalf ? { monthHalf: monthHalf } : {})
					}
				},
				SubjectTerm: {
					where: {
						...(term ? { term: term } : {})
					}
				},
				Object: true,
				group: true
			}
		})

		return res
	}

	async findByPlan(
		year?: string,
		rate?: Rate,
		objectId?: string,
		status?: Status,
		teacherId?: string,
		groupId?: string
	) {
		return await this.prismaService.plan.findMany({
			where: {
				year: year || undefined,
				rate: rate || undefined,
				Object: {
					id: objectId || undefined
				},
				status: status || undefined,
				teacher: {
					id: teacherId || undefined
				},
				group: {
					id: groupId || undefined
				}
			},
			include: {
				teacher: true,
				Object: true,
				group: true
			}
		})
	}

	async delete(id: string) {
		await this.prismaService.plan.delete({ where: { id } })

		return true
	}

	async upload(buff: Buffer) {
		const workbook = XLSX.read(buff, { type: 'buffer' })
		const sheetName = workbook.SheetNames[0]
		const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

		for (const row of worksheet) {
			const objectRecord = await this.prismaService.object.findFirst({
				where: { name: row['object'] }
			})

			const teacherRecord = await this.prismaService.teacher.findFirst({
				where: { fio: row['teacher'] }
			})

			const groupRecord = await this.prismaService.group.findFirst({
				where: { name: row['group'] }
			})

			const rateEnum =
				row['rate'] === 'Тарифицированная' ? Rate.SALARIED : Rate.HOURLY
			const statusEnum =
				row['status'] === 'Активная' ? Status.ACTIVE : Status.INACTIVE

			await this.prismaService.plan.create({
				data: {
					year: row['year'],
					rate: rateEnum,
					maxHours: row['maxHours'],
					worked: 0,
					status: statusEnum,
					Object: {
						connect: {
							id: objectRecord.id
						}
					},
					teacher: {
						connect: {
							id: teacherRecord.id
						}
					},
					group: {
						connect: {
							id: groupRecord.id
						}
					}
				}
			})
		}

		return { message: 'Success' }
	}

	async unload(rate: Rate, term?: Term, month?: Month, monthHalf?: MonthHalf) {
		const plans = await this.prismaService.plan.findMany({
			where: {
				rate: rate
			},
			include: {
				teacher: true,
				Subject: {
					where: {
						...(month ? { month: month } : {}),
						...(monthHalf ? { monthHalf: monthHalf } : {})
					}
				},
				SubjectTerm: {
					where: {
						...(term ? { term: term } : {})
					}
				},
				Object: true,
				group: true
			}
		})

		if (plans.length === 0) {
			throw new NotFoundException('No plans found with the specified filters')
		}

		const worksheetData: any[] = []
		const mergeCells: any[] = []

		const monthNames = {
			[Month.JANUARY]: 'Январь',
			[Month.FEBRUARY]: 'Февраль',
			[Month.MARCH]: 'Март',
			[Month.APRIL]: 'Апрель',
			[Month.MAY]: 'Май',
			[Month.JUNE]: 'Июнь',
			[Month.SEPTEMBER]: 'Сентябрь',
			[Month.OCTOBER]: 'Октябрь',
			[Month.NOVEMBER]: 'Ноябрь',
			[Month.DECEMBER]: 'Декабрь'
		}

		const termNames = {
			[Term.FIRST]: '1 семестр',
			[Term.SECOND]: '2 семестр'
		}

		const monthHalfNames = {
			[MonthHalf.FIRST]: '1 половина',
			[MonthHalf.SECOND]: '2 половина'
		}

		const titleText =
			rate === Rate.SALARIED
				? `Тарифицированная (${term ? termNames[term] : '1 или 2 семестр'})`
				: `Почасовая (${month ? monthNames[month] : ''}, ${monthHalf ? monthHalfNames[monthHalf] : ''})`

		worksheetData.push([titleText, ''])

		worksheetData.push(['ФИО Преподавателя', 'Количество часов'])

		worksheetData.push(['Бюджет', ''])

		plans.forEach(plan => {
			if (plan.group?.type === Type.BUDGET) {
				worksheetData.push([plan.teacher?.fio || '', plan.worked || 0])
			}
		})

		worksheetData.push([])

		worksheetData.push(['Внебюджет', ''])

		plans.forEach(plan => {
			if (plan.group?.type === Type.NON_BUDGET) {
				worksheetData.push([plan.teacher?.fio || '', plan.worked || 0])
			}
		})

		worksheetData.push([])

		worksheetData.push(['НПО', ''])

		plans.forEach(plan => {
			if (plan.group?.type === Type.NPO) {
				worksheetData.push([plan.teacher?.fio || '', plan.worked || 0])
			}
		})

		const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Plans')

		const excelBuff = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

		return excelBuff
	}
}
