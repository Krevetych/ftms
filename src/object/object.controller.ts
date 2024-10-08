import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Query,
	UseGuards
} from '@nestjs/common'
import { ObjectService } from './object.service'
import { UpdateObjectDto } from './dto/update-object.dto'
import { CreateObjectDto } from './dto/create-object.dto'
import { JwtGuard } from 'src/utils/guards/jwt.guard'

@Controller('object')
export class ObjectController {
	constructor(private readonly objectService: ObjectService) {}

	@Post('create')
	@UseGuards(JwtGuard)
	async create(@Body() data: CreateObjectDto) {
		return this.objectService.create(data)
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

	@Delete('delete')
  @UseGuards(JwtGuard)
	async delete(@Query('id') id: string) {
		return this.objectService.delete(id)
	}
}
