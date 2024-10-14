import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'
import { ICookie } from '../interfaces/cookie.interface'

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

	async validateUser(dto: CreateUserDto) {
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

	private setCookie(
		res: Response,
		key: string,
		token: string,
		options: ICookie
	) {
		return res.cookie(key, token, {
			httpOnly: options.httpOnly,
			domain: options.domain,
			expires: options.expires,
			secure: options.secure,
			sameSite: options.sameSite
		})
	}

	addTokensToResponse(
		res: Response,
		refreshToken: string,
		accessToken: string
	) {
		const refreshExpiresIn = new Date()
		refreshExpiresIn.setDate(
			refreshExpiresIn.getDate() + this.EXPIRE_DATE_REFRESH_TOKEN
		)

		const refreshOptions: ICookie = {
			httpOnly: true,
			domain: 'universal-hub.site',
			expires: refreshExpiresIn,
			secure: true,
			sameSite: 'lax'
		}

		this.setCookie(res, this.REFRESH_TOKEN_KEY, refreshToken, refreshOptions)

		const accessExpiresIn = new Date()
		accessExpiresIn.setHours(
			accessExpiresIn.getHours() + this.EXPIRE_DATE_ACCESS_TOKEN
		)

		const accessOptions: ICookie = {
			httpOnly: true,
			domain: 'universal-hub.site',
			expires: accessExpiresIn,
			secure: true,
			sameSite: 'lax'
		}

		this.setCookie(res, this.ACCESS_TOKEN_KEY, accessToken, accessOptions)
	}

	removeTokensFromResponse(res: Response) {
		const refreshOptions: ICookie = {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			secure: true,
			sameSite: 'none'
		}

		this.setCookie(res, this.REFRESH_TOKEN_KEY, '', refreshOptions)

		const accessOptions: ICookie = {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			secure: true,
			sameSite: 'none'
		}

		this.setCookie(res, this.ACCESS_TOKEN_KEY, '', accessOptions)
	}

	async revokeToken(res: Response, jti: string) {
		await this.prismaService.revokedToken.create({ data: { jti } })

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
