import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { TokenService } from 'src/auth/services/token.service'
import { JwtPayload } from 'src/user/interfaces/jwt.payload'

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly tokenService: TokenService
	) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const req: Request = ctx.switchToHttp().getRequest()
		const token: string = req.cookies[this.tokenService.ACCESS_TOKEN_KEY]

		if (!token) throw new UnauthorizedException('Invalid access token')

		const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
			secret: process.env.JWT_SECRET
		})

		if (await this.tokenService.getByJTI(payload.jti)) {
			throw new UnauthorizedException('Revoked token expired')
		}

		req.user = payload

		return true
	}
}
