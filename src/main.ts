import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const port = process.env.PORT
	app.enableShutdownHooks()
	app.enableCors({ origin: 'http://localhost:3000', credentials: true })
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true
		})
	)
	app.use(cookieParser())
	app.setGlobalPrefix('api')

	await app.listen(port)
}
bootstrap()
