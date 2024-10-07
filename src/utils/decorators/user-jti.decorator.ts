import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const UserJTI = createParamDecorator(
	(_: unknown, ctx: ExecutionContext): string => {
		const req = ctx.switchToHttp().getRequest()
		return req.user?.jti
	}
)
