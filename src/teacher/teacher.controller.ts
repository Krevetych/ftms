import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Put,
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

	@Get('find_all_d')
	@UseGuards(JwtGuard)
	async findAllD() {
		return await this.teacherService.findAllD()
	}

	@Delete('delete')
	@UseGuards(JwtGuard)
	async delete(@Query('id') id: string) {
		return await this.teacherService.delete(id)
	}

	@Delete('force_delete')
	@UseGuards(JwtGuard)
	async forceDelete(@Query('id') id: string) {
		return await this.teacherService.forceDelete(id)
	}

	@Put('restore')
	@UseGuards(JwtGuard)
	async restore(@Query('id') id: string) {
		return await this.teacherService.restore(id)
	}
}
