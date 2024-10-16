import {
	Body,
	Controller,
	NotFoundException,
	Post,
	Query,
	Res,
	UseGuards
} from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { TokenService } from '../services/token.service'
import { CreateUserDto, LoginUserDto } from 'src/user/dto/create-user.dto'
import { Response } from 'express'
import { JwtGuard } from 'src/utils/guards/jwt.guard'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokenService
	) {}

	@Post('register')
	async create(@Body() data: CreateUserDto, @Query('root') root: string) {
		const user = await this.authService.register(data, root)

		return user
	}

	@Post('login')
	async login(
		@Body() data: LoginUserDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { accessToken, refreshToken, ...user } =
			await this.authService.login(data)
		this.tokenService.addTokensToResponse(res, refreshToken, accessToken)

		return { accessToken, ...user }
	}

	@Post('logout')
	@UseGuards(JwtGuard)
	async logout(@Res({ passthrough: true }) res: Response) {
		this.tokenService.removeTokensFromResponse(res)

		return true
	}
}
