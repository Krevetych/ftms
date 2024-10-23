import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { PrismaService } from 'src/prisma.service'
import { LoginUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class TokenService {
	EXPIRE_DATE_REFRESH_TOKEN = 7
	REFRESH_TOKEN_KEY = 'refreshToken'

	EXPIRE_DATE_ACCESS_TOKEN = 1
	ACCESS_TOKEN_KEY = 'accessToken'

	constructor(
		private jwtService: JwtService,
		private prismaService: PrismaService,
		private userService: UserService
	) {}

	async issueTokens(userId: string) {
		const accessToken = await this.jwtService.signAsync(
			{},
			{
				jwtid: uuidv4(),
				subject: userId,
				expiresIn: this.EXPIRE_DATE_ACCESS_TOKEN + 'h'
			}
		)

		const refreshToken = await this.jwtService.signAsync(
			{},
			{
				jwtid: uuidv4(),
				subject: userId,
				expiresIn: this.EXPIRE_DATE_REFRESH_TOKEN + 'd'
			}
		)

		return { accessToken, refreshToken }
	}

	async validateUser(dto: LoginUserDto) {
		const user = await this.userService.findByLogin(dto.login)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const isValid = await verify(user.password, dto.password)

		if (!isValid) {
			throw new UnauthorizedException('Invalid password')
		}

		const { password, ...resUser } = user

		return resUser
	}

	private setCookie(res: Response, key: string, token: string, expires: Date) {
		return res.cookie(key, token, {
			httpOnly: true,
			domain: process.env.DOMAIN,
			expires: expires,
			secure: true,
			sameSite: 'lax'
		})
	}

	addTokensToResponse(
		res: Response,
		refreshToken: string,
		accessToken: string,
		userRole: string
	) {
		const refreshExpiresIn = new Date()
		refreshExpiresIn.setDate(
			refreshExpiresIn.getDate() + this.EXPIRE_DATE_REFRESH_TOKEN
		)

		this.setCookie(res, this.REFRESH_TOKEN_KEY, refreshToken, refreshExpiresIn)

		const accessExpiresIn = new Date()
		accessExpiresIn.setHours(
			accessExpiresIn.getHours() + this.EXPIRE_DATE_ACCESS_TOKEN
		)

		this.setCookie(res, this.ACCESS_TOKEN_KEY, accessToken, accessExpiresIn)

		this.setCookie(res, 'userRole', userRole, accessExpiresIn)
	}

	removeTokensFromResponse(res: Response) {
		this.setCookie(res, this.REFRESH_TOKEN_KEY, '', new Date(0))

		this.setCookie(res, this.ACCESS_TOKEN_KEY, '', new Date(0))

		this.setCookie(res, 'userRole', '', new Date(0))
	}

	async revokeToken(res: Response, jti: string) {
		const existingToken = await this.prismaService.revokedToken.findUnique({
			where: { jti }
		})

		if (!existingToken) {
			await this.prismaService.revokedToken.create({ data: { jti } })
		}

		this.removeTokensFromResponse(res)

		return true
	}

	async getNewTokens(refreshToken: string) {
		const res = await this.jwtService.verifyAsync(refreshToken)

		if (!res) {
			throw new UnauthorizedException('Invalid refresh token')
		}

		const user = await this.userService.findById(res.sub)

		const tokens = await this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async getByJTI(jti: string) {
		return await this.prismaService.revokedToken.findUnique({ where: { jti } })
	}
}
