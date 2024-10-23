import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CreateUserDto, LoginUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import { TokenService } from './token.service'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private tokenService: TokenService
	) {}

	async login(dto: LoginUserDto) {
		const user = await this.tokenService.validateUser(dto)

		const tokens = await this.tokenService.issueTokens(user.id)

		return { user, ...tokens }
	}

	async register(dto: CreateUserDto, root: string) {
		this.validateRoot(root)
		await this.checkIfUserExists(dto.login)

		const user = await this.userService.create(dto)

		return user
	}

	private validateRoot(root: string) {
		if (root !== process.env.ROOT) {
			throw new NotFoundException('Route not found')
		}
	}

	private async checkIfUserExists(login: string) {
		const user = await this.userService.findByLogin(login)

		if (user) {
			throw new BadRequestException('User already exists')
		}
	}
}
