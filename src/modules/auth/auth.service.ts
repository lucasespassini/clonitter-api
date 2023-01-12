import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { validate } from 'isemail';
import { Repository } from 'typeorm';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { SigninUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async emailExists(usr_email: string) {
    const user = await this.prisma.users.findFirst({ where: { usr_email } });
    return user ? true : false;
  }

  async userNameExists(usr_user_name: string) {
    const user = await this.prisma.users.findFirst({
      where: { usr_user_name },
    });
    return user ? true : false;
  }

  async signup(createUserDto: CreateUserDto) {
    const result = await Promise.all([
      this.emailExists(createUserDto.usr_email),
      this.userNameExists(createUserDto.usr_user_name),
    ]);
    const emailExists = result[0];
    const userNameExists = result[1];

    interface IErrors {
      isError: boolean;
      errors?: {
        usr_user_name?: string;
        usr_name?: string;
        usr_email?: string;
        usr_password?: string;
      };
    }

    const errors: IErrors = {
      isError: false,
      errors: {
        usr_user_name: '',
        usr_name: '',
        usr_email: '',
        usr_password: '',
      },
    };

    if (createUserDto.usr_user_name.length < 3) {
      errors.isError = true;
      errors.errors.usr_user_name =
        'Nome de usuário deve ter no mínimo 3 caracteres!';
    }
    if (createUserDto.usr_name.length < 3) {
      errors.isError = true;
      errors.errors.usr_name = 'Nome deve ter no mínimo 3 caracteres!';
    }
    if (!validate(createUserDto.usr_email)) {
      errors.isError = true;
      errors.errors.usr_email = 'Email inválido!';
    }
    if (createUserDto.usr_password.length < 5) {
      errors.isError = true;
      errors.errors.usr_password = 'Senha deve ter no mínimo 5 caracteres!';
    }
    if (emailExists) {
      errors.isError = true;
      errors.errors.usr_email = 'Email já cadastrado no sistema!';
    }
    if (userNameExists) {
      errors.isError = true;
      errors.errors.usr_user_name = 'Nome de usuário já cadastrado no sistema!';
    }

    if (errors.isError) {
      throw new BadRequestException({ errors: errors.errors });
    }

    const newHash = await hash(createUserDto.usr_password, 10);
    createUserDto.usr_password = newHash;

    const user = await this.prisma.users.create({ data: createUserDto });

    const profile = await this.prisma.profile.create({
      data: { prf_usr_id: user.usr_id },
    });

    const payload = {
      prf_image: profile.prf_image,
      usr_user_name: user.usr_user_name,
      usr_name: user.usr_name,
      usr_created_at: user.usr_createdAt,
    };

    return { token: this.jwtService.sign(payload), payload };
  }

  async signin(signinUserDto: SigninUserDto) {
    const user = await this.prisma.users.findFirst({
      where: {
        OR: [
          { usr_email: { equals: signinUserDto.login } },
          { usr_user_name: { equals: signinUserDto.login } },
        ],
      },
    });

    interface IErrors {
      isError: boolean;
      errors?: {
        login?: string;
        password?: string;
      };
    }

    const errors: IErrors = {
      isError: false,
      errors: { login: '', password: '' },
    };

    if (!user) {
      errors.isError = true;
      errors.errors.login = 'Esse usuário não existe!';
    } else {
      const result = await compare(signinUserDto.password, user.usr_password);

      if (!result) {
        errors.isError = true;
        errors.errors.password = 'Senha incorreta!';
      }
    }

    if (errors.isError)
      throw new BadRequestException({ errors: errors.errors });

    const payload = {
      usr_user_name: user.usr_user_name,
      usr_name: user.usr_name,
      usr_created_at: user.usr_createdAt,
    };

    return { token: this.jwtService.sign(payload), payload };
  }
}
