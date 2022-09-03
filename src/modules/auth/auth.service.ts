import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      email: loginUserDto.email,
    });

    interface Errors {
      emailError: string | undefined;
      passwordError: string | undefined;
    }

    const errors: Errors = {
      emailError: undefined,
      passwordError: undefined,
    };

    if (!user) {
      errors.emailError = 'Esse usuário não existe!';
    } else {
      const result = await compare(loginUserDto.password, user.password);

      if (!result) {
        errors.passwordError = 'Senha incorreta!';
      }
    }

    if (errors.emailError || errors.passwordError)
      throw new NotAcceptableException({ errors });

    const payload = {
      sub: user.id,
      profile_image: user.profile_image,
      user_name: user.user_name,
      name: user.name,
      email: user.email,
    };

    return { token: this.jwtService.sign(payload) };
  }
}
