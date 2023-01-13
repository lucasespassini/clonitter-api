import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('friendship')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post()
  create(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.friendshipsService.create(createFriendshipDto);
  }

  @Delete()
  remove(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.friendshipsService.remove(createFriendshipDto);
  }
}
