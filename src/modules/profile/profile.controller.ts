import { Controller, Body, Patch, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch(':usr_user_name')
  update(
    @Param('usr_user_name') usr_user_name: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(usr_user_name, updateProfileDto);
  }
}
