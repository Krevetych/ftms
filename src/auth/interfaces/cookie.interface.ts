export interface ICookie {
	httpOnly: boolean
	domain: string
	expires: Date
	secure: boolean
	sameSite: boolean | 'lax' | 'strict' | 'none'
}