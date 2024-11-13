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
import { ObjectService } from './object.service'
import { UpdateObjectDto } from './dto/update-object.dto'
import { CreateObjectDto } from './dto/create-object.dto'
import { JwtGuard } from 'src/utils/guards/jwt.guard'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('object')
export class ObjectController {
	constructor(private readonly objectService: ObjectService) {}

	@Post('create')
	@UseGuards(JwtGuard)
	async create(@Body() data: CreateObjectDto) {
		return this.objectService.create(data)
	}

	@Post('upload')
	@UseGuards(JwtGuard)
	@UseInterceptors(FileInterceptor('file'))
	async upload(@UploadedFile() file: Express.Multer.File) {
		return this.objectService.upload(file.buffer)
	}

	@Patch('update')
	@UseGuards(JwtGuard)
	async update(@Body() data: UpdateObjectDto, @Query('id') id: string) {
		return this.objectService.update(id, data)
	}

	@Get('find_all')
	@UseGuards(JwtGuard)
	async findAll() {
		return this.objectService.findAll()
	}

	@Get('find_all_d')
	@UseGuards(JwtGuard)
	async findAllD() {
		return this.objectService.findAllD()
	}

	@Delete('delete')
	@UseGuards(JwtGuard)
	async delete(@Query('id') id: string) {
		return this.objectService.delete(id)
	}

	@Delete('force_delete')
	@UseGuards(JwtGuard)
	async forceDelete(@Query('id') id: string) {
		return this.objectService.forceDelete(id)
	}

	@Put('restore')
	@UseGuards(JwtGuard)
	async restore(@Query('id') id: string) {
		return this.objectService.restore(id)
	}
}
