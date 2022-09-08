import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

import { Friendship } from '../friendships/entities/friendship.entity';

@Injectable()
export class UsersService {
  private secret = process.env.JWT_SECRET;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendRepository: Repository<Friendship>,
  ) {}

  async findByUserName(user_name: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'posts')
      .leftJoinAndSelect('user.friendships', 'f')
      .where('user.user_name = :user_name', { user_name })
      .select([
        'user.id',
        'user.profile_image',
        'user.user_name',
        'user.name',
        'user.email',
        'posts',
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
      .orWhere('users.name LIKE :name', { name: `%${name}%` })
      .select([
        'users.profile_image',
        'users.user_name',
        'users.name',
        'users.email',
      ])
      .getMany();
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: {
        id: true,
        user_name: true,
        name: true,
        email: true,
        password: false,
      },
      relations: ['posts', 'comments', 'friendships'],
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const editUser = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    await this.userRepository.save(editUser);
    return { msg: 'Usuário editado com sucesso!' };
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { msg: 'Usuário deletado com sucesso!' };
  }
}
