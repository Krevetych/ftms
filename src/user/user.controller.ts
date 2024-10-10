import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtGuard } from 'src/utils/guards/jwt.guard'
import { UserID } from 'src/utils/decorators/user-id.decorator'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('find_by_id')
	@UseGuards(JwtGuard)
	async findById(@UserID() id: string) {
		return this.userService.findById(id)
	}

	@Get('find_all')
	@UseGuards(JwtGuard)
	async findAll() {
		return this.userService.findAll()
	}

	@Patch('update')
	@UseGuards(JwtGuard)
	async update(@Body() id: string, data: UpdateUserDto) {
		return this.userService.update(id, data)
	}

	@Delete('delete')
	@UseGuards(JwtGuard)
	async delete(id: string) {
		return this.userService.delete(id)
	}
}
