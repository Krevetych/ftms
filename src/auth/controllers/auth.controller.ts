import { Body, Controller, Post, Res } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { TokenService } from '../services/token.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokenService
	) {}

	@Post('register')
	async create(@Body() data: CreateUserDto) {
		try {
			const user = await this.authService.register(data)

			return user
		} catch (error) {
			console.log(error)
		}
	}

	@Post('login')
	async login(
		@Body() data: CreateUserDto,
		@Res({ passthrough: true }) res: Response
	) {
		try {
			const { accessToken, refreshToken, ...user } =
				await this.authService.login(data)
			this.tokenService.addTokensToResponse(res, refreshToken, accessToken)

			return user
		} catch (error) {
			console.log(error)
		}
	}
}
