import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { TeacherService } from './teacher.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { JwtGuard } from 'src/utils/guards/jwt.guard'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('teacher')
export class TeacherController {
	constructor(private readonly teacherService: TeacherService) {}

	@Post('create')
	@UseGuards(JwtGuard)
	async create(@Body() dto: CreateTeacherDto) {
		return await this.teacherService.create(dto)
	}

	@Post('upload')
	@UseGuards(JwtGuard)
	@UseInterceptors(FileInterceptor('file'))
	async upload(@UploadedFile() file: Express.Multer.File) {
		return await this.teacherService.upload(file.buffer)
	}

	@Patch('update')
	@UseGuards(JwtGuard)
	async update(@Body() dto: CreateTeacherDto, @Query('id') id: string) {
		return await this.teacherService.update(id, dto)
	}

	@Get('find_all')
	@UseGuards(JwtGuard)
	async findAll() {
		return await this.teacherService.findAll()
	}

	@Delete('delete')
	@UseGuards(JwtGuard)
	async delete(@Query('id') id: string) {
		return await this.teacherService.delete(id)
	}
}
