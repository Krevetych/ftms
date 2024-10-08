import { Controller, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { TokenService } from "../services/token.service";
import { Request, Response } from "express";
import { JwtGuard } from "src/utils/guards/jwt.guard";
import { UserJTI } from "src/utils/decorators/user-jti.decorator";

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @Post('new_tokens')
    async newTokens(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshTokenFromCookie = req.cookies[this.tokenService.REFRESH_TOKEN_KEY]

        if (!refreshTokenFromCookie) {
            this.tokenService.removeTokensFromResponse(res)
            throw new UnauthorizedException("Invalid refresh token")
        }

        const { accessToken, refreshToken, ...user } = await this.tokenService.getNewTokens(refreshTokenFromCookie)

        this.tokenService.addTokensToResponse(res, refreshToken, accessToken)

        return user
    }

    @UseGuards(JwtGuard)
    @Post('revoke_token')
    async revokeToken(
        @Res({ passthrough: true }) res: Response,
        @UserJTI() jti: string
    ) {
        return await this.tokenService.revokeToken(res, jti)
    }
}