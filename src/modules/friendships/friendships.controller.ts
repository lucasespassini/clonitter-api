import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';

@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post()
  create(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.friendshipsService.create(createFriendshipDto);
  }

  @Get()
  findAll() {
    return this.friendshipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendshipsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendshipsService.remove(+id);
  }
}
