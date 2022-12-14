import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage_profile_image } from '../config/multer.config';

@UseGuards(JwtGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:usr_user_name')
  findByUserName(@Param('usr_user_name') usr_user_name: string) {
    return this.usersService.findByUserName(usr_user_name);
  }

  @Get('/search/:search')
  searchUser(@Param('search') search: string) {
    return this.usersService.searchUser(search);
  }

  // @UseInterceptors(
  //   FileInterceptor('profile_image', { storage: storage_profile_image }),
  // )
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @UploadedFile()
  //   file?: Express.Multer.File,
  // ) {
  //   return this.usersService.update(+id, updateUserDto, file);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
