import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Put,
	Query,
	UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto'
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

	@Patch('update')
	@UseGuards(JwtGuard)
	async update(@Body() id: string, data: UpdateUserDto) {
		return this.userService.update(id, data)
	}

	@Put('update_password')
	@UseGuards(JwtGuard)
	async updatePassword(
		@UserID() id: string,
		@Body() data: UpdateUserPasswordDto
	) {
		return this.userService.updatePassword(id, data)
	}

	@Delete('delete')
	@UseGuards(JwtGuard)
	async delete(@Query('id') id: string) {
		return this.userService.delete(id)
	}
}
