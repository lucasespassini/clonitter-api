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
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  private secret = process.env.JWT_SECRET;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendRepository: Repository<Friendship>,
    private prisma: PrismaClient,
  ) {}

  async findByUserName(user_name: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'posts')
      .leftJoinAndSelect('posts.comments', 'comments')
      .leftJoinAndSelect('user.friendships', 'f')
      .where('user.user_name = :user_name', { user_name })
      .select([
        'user.id',
        'user.profile_image',
        'user.user_name',
        'user.name',
        'user.email',
        'posts',
        'comments',
        'f',
      ])
      .orderBy('posts.id', 'DESC')
      .getOne();

    if (!user) return undefined;

    const res = await Promise.all([
      this.friendRepository
        .createQueryBuilder('f')
        .leftJoin('f.user', 'u')
        .where('f.followingId = :id', { id: user.id })
        .select(['f', 'u.id'])
        .getManyAndCount(),
      this.friendRepository
        .createQueryBuilder('f')
        .leftJoin('f.user', 'u')
        .where('f.userId = :id', { id: user.id })
        .select(['f', 'u.id'])
        .getManyAndCount(),
    ]);

    return { user, followers: res[0], followings: res[1] };
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

  async findAll() {
    // const users = await this.userRepository.find({
    //   select: {
    //     id: true,
    //     user_name: true,
    //     name: true,
    //     email: true,
    //     password: false,
    //   },
    //   relations: ['posts', 'comments', 'friendships'],
    // });
    const users = await this.prisma.users.findMany({
      include: { posts: true },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        user_name: true,
        name: true,
        email: true,
        password: false,
      },
      relations: ['posts', 'comments', 'friendships'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    await this.findOne(id);

    if (file) {
      updateUserDto.profile_image = file.filename;
    }

    const editUser = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    try {
      return this.userRepository.save(editUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { msg: 'Usuário deletado com sucesso!' };
  }
}
