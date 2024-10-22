import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import {
	CreateSubjectDto,
	CreateSubjectTermDto
} from './dto/create-subject.dto'
import {
	UpdateSubjectDto,
	UpdateSubjectTermDto
} from './dto/update-subject.dto'
import { Month, MonthHalf, Rate, Term, Type } from '@prisma/client'

@Injectable()
export class SubjectService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateSubjectDto) {
		const existingSubject = await this.prismaService.subject.findUnique({
			where: {
				month_monthHalf_planId: {
					month: dto.month,
					monthHalf: dto.monthHalf,
					planId: dto.planId
				}
			}
		})

		if (existingSubject) {
			throw new BadRequestException('Subject already exists')
		}

		const plan = await this.prismaService.plan.findUnique({
			where: {
				id: dto.planId
			}
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		if (dto.hours < 0) {
			throw new BadRequestException('Invalid hours')
		}

		if (plan.maxHours < plan.worked + dto.hours) {
			throw new BadRequestException('Max hours exceeded')
		}

		const subject = await this.prismaService.subject.create({
			data: {
				...dto
			}
		})

		await this.prismaService.plan.update({
			where: {
				id: dto.planId
			},
			data: {
				worked: plan.worked + dto.hours
			}
		})

		return subject
	}

	async update(id: string, dto: UpdateSubjectDto) {
		const subject = await this.prismaService.subject.findUnique({
			where: { id },
			include: {
				plan: true
			}
		})

		if (!subject) {
			throw new NotFoundException('Subject not found')
		}

		const plan = await this.prismaService.plan.findUnique({
			where: {
				id: dto.planId
			}
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		if (plan.maxHours < plan.worked - subject.hours + dto.hours) {
			throw new BadRequestException('Max hours exceeded')
		}

		const updateSubject = await this.prismaService.subject.update({
			where: { id },
			data: {
				...dto
			}
		})

		await this.prismaService.plan.update({
			where: { id: subject.planId },
			data: {
				worked: {
					decrement: subject.hours
				}
			}
		})

		await this.prismaService.plan.update({
			where: { id: subject.planId },
			data: {
				worked: {
					increment: dto.hours
				}
			}
		})

		return updateSubject
	}

	async findByRate(rate: Rate) {
		return await this.prismaService.subject.findMany({
			where: {
				plan: {
					rate: rate
				}
			},
			select: {
				id: true,
				hours: true,
				month: true,
				monthHalf: true,
				plan: {
					select: {
						year: true,
						rate: true,
						teacher: true,
						Object: true,
						group: true
					}
				}
			}
		})
	}

	async findByFilters(
		month: Month,
		monthHalf: MonthHalf,
		teacherId: string,
		type: Type,
		groupId: string
	) {
		return await this.prismaService.subject.findMany({
			where: {
				month: month || undefined,
				monthHalf: monthHalf || undefined,
				plan: {
					teacherId: teacherId || undefined,
					group: {
						type: type || undefined
					},
					groupId: groupId || undefined
				}
			},
			select: {
				id: true,
				hours: true,
				month: true,
				monthHalf: true,
				plan: {
					select: {
						year: true,
						rate: true,
						teacher: true,
						Object: true,
						group: true
					}
				}
			}
		})
	}

	async delete(id: string) {
		const subject = await this.prismaService.subject.delete({
			where: { id },
			include: {
				plan: true
			}
		})

		const plan = await this.prismaService.plan.findUnique({
			where: { id: subject.planId }
		})

		await this.prismaService.plan.update({
			where: { id: subject.planId },
			data: {
				worked: plan.worked - subject.hours
			}
		})

		return true
	}
}

@Injectable()
export class SubjectTermService {
	constructor(private prismaService: PrismaService) {}

	async create(dto: CreateSubjectTermDto) {
		const existingSubjectTerm = await this.prismaService.subjectTerm.findUnique(
			{
				where: {
					term_planId: {
						term: dto.term,
						planId: dto.planId
					}
				}
			}
		)

		if (existingSubjectTerm) {
			throw new BadRequestException('Subject Term already exists')
		}

		const plan = await this.prismaService.plan.findUnique({
			where: {
				id: dto.planId
			}
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		if (dto.hours < 0) {
			throw new BadRequestException('Invalid hours')
		}

		if (plan.maxHours < plan.worked + dto.hours) {
			throw new BadRequestException('Max hours exceeded')
		}

		const subjectTerm = await this.prismaService.subjectTerm.create({
			data: {
				...dto
			}
		})

		await this.prismaService.plan.update({
			where: {
				id: dto.planId
			},
			data: {
				worked: plan.worked + dto.hours
			}
		})

		return subjectTerm
	}

	async update(id: string, dto: UpdateSubjectTermDto) {
		const subjectTerm = await this.prismaService.subjectTerm.findUnique({
			where: { id },
			include: {
				plan: true
			}
		})

		if (!subjectTerm) {
			throw new NotFoundException('Subject Term not found')
		}

		const plan = await this.prismaService.plan.findUnique({
			where: {
				id: dto.planId
			}
		})

		if (!plan) {
			throw new NotFoundException('Plan not found')
		}

		if (plan.maxHours < plan.worked - subjectTerm.hours + dto.hours) {
			throw new BadRequestException('Max hours exceeded')
		}

		const updateSubjectTerm = await this.prismaService.subjectTerm.update({
			where: { id },
			data: {
				...dto
			}
		})

		await this.prismaService.plan.update({
			where: { id: subjectTerm.planId },
			data: {
				worked: {
					decrement: subjectTerm.hours
				}
			}
		})

		await this.prismaService.plan.update({
			where: { id: subjectTerm.planId },
			data: {
				worked: {
					increment: dto.hours
				}
			}
		})

		return updateSubjectTerm
	}

	async findByRate(rate: Rate) {
		return await this.prismaService.subjectTerm.findMany({
			where: {
				plan: {
					rate: rate
				}
			},
			select: {
				id: true,
				term: true,
				hours: true,
				plan: {
					select: {
						year: true,
						rate: true,
						teacher: true,
						Object: true,
						group: true
					}
				}
			}
		})
	}

	async findByFilters(
		term: Term,
		teacherId: string,
		type: Type,
		groupId: string
	) {
		return await this.prismaService.subjectTerm.findMany({
			where: {
				term: term || undefined,
				plan: {
					teacherId: teacherId || undefined,
					group: {
						type: type || undefined
					},
					groupId: groupId || undefined
				}
			},
			select: {
				id: true,
				term: true,
				hours: true,
				plan: {
					select: {
						year: true,
						rate: true,
						teacher: true,
						Object: true,
						group: true
					}
				}
			}
		})
	}

	async delete(id: string) {
		const subjectTerm = await this.prismaService.subjectTerm.delete({
			where: { id },
			include: {
				plan: true
			}
		})

		const plan = await this.prismaService.plan.findUnique({
			where: { id: subjectTerm.planId }
		})

		await this.prismaService.plan.update({
			where: { id: subjectTerm.planId },
			data: {
				worked: plan.worked - subjectTerm.hours
			}
		})

		return true
	}
}
