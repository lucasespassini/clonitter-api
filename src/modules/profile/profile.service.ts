import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  update(usr_user_name: string, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${usr_user_name} profile`;
  }
}
