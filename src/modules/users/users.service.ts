import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private secret = process.env.JWT_SECRET;
  constructor(private readonly prisma: PrismaService) {}

  async findByUserName(usr_user_name: string) {
    const user = await this.prisma.users.findUnique({
      select: {
        usr_user_name: true,
        usr_name: true,
        profile: {
          select: {
            prf_image: true,
            prf_bio: true,
            prf_followers: true,
            prf_followings: true,
          },
        },
        posts: {
          select: { pst_uuid: true, pst_content: true, pst_createdAt: true },
        },
      },
      where: { usr_user_name },
    });

    return user;
  }

  async searchUser(search: string) {
    const users = await this.prisma.users.findMany({
      select: {
        usr_user_name: true,
        usr_name: true,
        profile: {
          select: {
            prf_image: true,
            prf_bio: true,
            prf_followers: true,
            prf_followings: true,
          },
        },
        posts: {
          select: { pst_uuid: true, pst_content: true, pst_createdAt: true },
        },
      },
      where: {
        OR: [
          { usr_user_name: { startsWith: search } },
          { usr_name: { contains: search } },
        ],
      },
    });

    return users;
  }

  // async update(
  //   id: number,
  //   updateUserDto: UpdateUserDto,
  //   file: Express.Multer.File,
  // ) {
  //   await this.findOne(id);

  //   if (file) {
  //     updateUserDto.profile_image = file.filename;
  //   }

  //   const editUser = await this.userRepository.preload({
  //     id: id,
  //     ...updateUserDto,
  //   });

  //   try {
  //     return this.userRepository.save(editUser);
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  // async remove(id: number) {
  //   const user = await this.findOne(id);
  //   await this.userRepository.remove(user);
  //   return { msg: 'Usuário deletado com sucesso!' };
  // }
}
