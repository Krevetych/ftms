import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { TokenService } from './token.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private tokenService: TokenService
	) {}

	async login(dto: CreateUserDto) {
		const user = await this.tokenService.validateUser(dto)

		const tokens = await this.tokenService.issueTokens(user.id)

		return { user, ...tokens }
	}

	async register(dto: CreateUserDto, root: string) {
		if (root === process.env.ROOT) {
			const extUser = await this.userService.findByLogin(dto.login)

			if (extUser) {
				throw new BadRequestException('User already exists')
			}

			const user = await this.userService.create(dto)

			return user
		} else {
			throw new NotFoundException('Route not found')
		}
	}
}
