import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })
	const port = process.env.PORT
	app.enableShutdownHooks()
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true
		})
	)
	app.use(cookieParser())

	await app.listen(port)
}
bootstrap()
