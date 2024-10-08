import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @Post('create')
  async create(@Body() data: CreateGroupDto) {
    return this.groupService.create(data)
  }

  @Patch('update')
  async update(@Body() data: UpdateGroupDto, @Query("id") id: string) {
    return this.groupService.update(id, data)
  }

  @Get('find_all')
  async findAll() {
    return this.groupService.findAll()
  }

  @Delete('delete')
  async delete(@Query("id") id: string) {
    return this.groupService.delete(id)
  }
}
