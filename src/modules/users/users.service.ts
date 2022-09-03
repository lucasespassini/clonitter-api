import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { validate } from 'isemail';
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

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return undefined;
    }
    return user;
  }

  async findByUserName(user_name: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_name = :user_name', { user_name })
      .leftJoinAndSelect('user.posts', 'posts')
      .select([
        'user.id',
        'user.profile_image',
        'user.user_name',
        'user.name',
        'user.email',
        'posts',
      ])
      .orderBy('posts.id', 'DESC')
      .getOne();

    if (!user) {
      return undefined;
    }

    const res = await Promise.all([
      this.friendRepository.count({
        where: { followingId: user.id },
      }),
      this.friendRepository
        .createQueryBuilder('f')
        .leftJoin('f.user', 'u')
        .where('f.userId = :id', { id: user.id })
        .getCount(),
    ]);

    return { user, followings: res[1], followers: res[0] };
  }

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    if (!file) {
      createUserDto.profile_image = '126.png';
    } else {
      createUserDto.profile_image = file.filename;
    }
    const newUser = this.userRepository.create(createUserDto);
    const result = await Promise.all([
      this.findByEmail(newUser.email),
      this.findByUserName(newUser.user_name),
    ]);
    const userNameExists = result[0];
    const emailExists = result[1];

    interface IErrors {
      user_nameError: string | undefined;
      nameError: string | undefined;
      emailError: string | undefined;
      passwordError: string | undefined;
    }

    const errors: IErrors = {
      user_nameError: undefined,
      nameError: undefined,
      emailError: undefined,
      passwordError: undefined,
    };

    if (userNameExists != undefined) {
      errors.user_nameError = 'Esse nome de usuário já está em uso!';
    }

    if (newUser.user_name.length < 3) {
      errors.user_nameError = 'O nome deve ter no mínimo 3 caracteres!';
    }

    if (newUser.name.length < 3) {
      errors.nameError = 'O nome deve ter no mínimo 3 caracteres!';
    }

    if (emailExists != undefined) {
      errors.emailError = 'Esse e-mail já está cadastrado!';
    }

    if (!validate(newUser.email)) {
      errors.emailError = 'O e-mail é inválido!';
    }

    if (newUser.password.length < 5) {
      errors.passwordError = 'A senha deve ter no mínimo 5 caracteres!';
    }

    if (
      errors.user_nameError != undefined ||
      errors.nameError != undefined ||
      errors.emailError != undefined ||
      errors.passwordError != undefined
    ) {
      throw new NotAcceptableException({ errors });
    }

    const newHash = await hash(createUserDto.password, 10);
    newUser.password = newHash;

    const user = await this.userRepository.save(newUser);

    const token = sign(
      {
        id: user.id,
        uuid: user.uuid,
        profile_image: user.profile_image,
        user_name: user.user_name,
        name: user.name,
        email: user.email,
        password: user.password,
      },
      this.secret,
      { expiresIn: '2d' },
    );
    return { token };
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: {
        id: true,
        uuid: true,
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
      where: { id: id },
      select: {
        id: true,
        uuid: true,
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
