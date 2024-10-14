import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { ConfigModule } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	ConfigModule.forRoot({
		envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev'
	})

	const port = process.env.PORT
	app.enableShutdownHooks()
	app.enableCors({
		origin: process.env.ORIGIN,
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
