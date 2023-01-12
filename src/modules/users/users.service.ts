import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Friendship } from '../friendships/entities/friendship.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private secret = process.env.JWT_SECRET;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendRepository: Repository<Friendship>,
    private prisma: PrismaService,
  ) {}

  async findByUserName(usr_user_name: string) {
    const user = await this.prisma.users.findUnique({
      select: {
        usr_user_name: true,
        usr_name: true,
        profile: {
          select: { prf_image: true, prf_bio: true },
        },
        posts: {
          select: { pst_uuid: true, pst_content: true, pst_createdAt: true },
        },
      },
      where: { usr_user_name },
    });

    return user;
  }

  async searchUser(name: string) {
    return this.userRepository
      .createQueryBuilder('users')
      .where('users.user_name LIKE :name', { name: `%${name}%` })
      .orWhere('users.name LIKE :name', { name: `${name}%` })
      .select([
        'users.id',
        'users.profile_image',
        'users.user_name',
        'users.name',
        'users.email',
      ])
      .getMany();
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
