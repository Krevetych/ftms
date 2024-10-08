import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get("find_by_id")
  async findById(@Body() id: string) {
    return this.userService.findById(id)
  }

  @Patch("update")
  async update(@Body() id: string, data: UpdateUserDto) {
    return this.userService.update(id, data)
  }

  @Delete("delete")
  async delete(id: string) {
    return this.userService.delete(id)
  }

}
