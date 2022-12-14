import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage_profile_image } from '../config/multer.config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() loginUserDto: SigninUserDto) {
    return this.authService.signin(loginUserDto);
  }

  @UseInterceptors(
    FileInterceptor('profile_image', { storage: storage_profile_image }),
  )
  @Post('signup')
  signup(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.authService.signup(createUserDto);
  }
}
