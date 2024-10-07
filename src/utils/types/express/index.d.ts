import { JwtPayload } from 'src/user/interfaces/jwt.payload'

declare global {
	namespace Express {
		export interface Request {
			user: JwtPayload
		}
	}
}
