import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { hash } from 'argon2'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService) {}

	async findById(id: string) {
		const { password, ...user } = await this.prismaService.user.findUnique({
			where: { id }
		})
		return user
	}

	async findByLogin(login: string) {
		const user = await this.prismaService.user.findUnique({
			where: { login }
		})
		return user
	}

	async findAll() {
		return await this.prismaService.user.findMany()
	}

	async create(dto: CreateUserDto) {
		const hashPass = await hash(dto.password)
		const { password, ...newUser } = await this.prismaService.user.create({
			data: {
				...dto,
				password: hashPass
			}
		})

		return newUser
	}

	async update(id: string, dto: UpdateUserDto) {
		let data = dto

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		}

		const { password, ...updatedUser } = await this.prismaService.user.update({
			where: { id },
			data
		})

		return updatedUser
	}

	async delete(id: string) {
		await this.prismaService.user.delete({ where: { id } })

		return true
	}
}
