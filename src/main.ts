import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const port = process.env.PORT
	app.enableShutdownHooks()
	app.enableCors({
			origin: 'https://ftms.universal-hub.site',
			credentials: true
		})
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
