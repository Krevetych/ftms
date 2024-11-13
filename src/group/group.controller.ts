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
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { JwtGuard } from 'src/utils/guards/jwt.guard'
import { Course, Type } from '@prisma/client'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('group')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}

	@Post('create')
	@UseGuards(JwtGuard)
	async create(@Body() data: CreateGroupDto) {
		return this.groupService.create(data)
	}

	@Post('upload')
	@UseGuards(JwtGuard)
	@UseInterceptors(FileInterceptor('file'))
	async upload(@UploadedFile() file: Express.Multer.File) {
		return await this.groupService.upload(file.buffer)
	}

	@Patch('update')
	@UseGuards(JwtGuard)
	async update(@Body() data: UpdateGroupDto, @Query('id') id: string) {
		return this.groupService.update(id, data)
	}

	@Get('find_all')
	@UseGuards(JwtGuard)
	async findAll() {
		return this.groupService.findAll()
	}

	@Get('find_all_d')
	@UseGuards(JwtGuard)
	async findAllD() {
		return this.groupService.findAllD()
	}

	@Get('find_by_filters')
	@UseGuards(JwtGuard)
	async findByFilters(
		@Query('type') type: Type,
		@Query('course') course: Course
	) {
		return this.groupService.findByFilters(type, course)
	}

	@Delete('delete')
	@UseGuards(JwtGuard)
	async delete(@Query('id') id: string) {
		return this.groupService.delete(id)
	}

	@Delete('force_delete')
	@UseGuards(JwtGuard)
	async forceDelete(@Query('id') id: string) {
		return this.groupService.forceDelete(id)
	}

	@Put('restore')
	@UseGuards(JwtGuard)
	async restore(@Query('id') id: string) {
		return this.groupService.restore(id)
	}
}
