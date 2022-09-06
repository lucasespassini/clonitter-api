import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { validate } from 'isemail';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return undefined;
    return user;
  }

  async findByUserName(user_name: string) {
    const user = await this.userRepository.findOneBy({ user_name });
    if (!user) return undefined;
    return user;
  }

  async signup(createUserDto: CreateUserDto, file: Express.Multer.File) {
    createUserDto.profile_image = file.filename;
    const newUser = this.userRepository.create(createUserDto);
    const result = await Promise.all([
      this.findByEmail(newUser.email),
      this.findByUserName(newUser.user_name),
    ]);
    const userNameExists = result[1];
    const emailExists = result[0];

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

    if (newUser.user_name.length > 10) {
      errors.user_nameError =
        'Nome de usuário não pode ter mais que 10 caracteres!';
    }

    if (userNameExists != undefined) {
      errors.user_nameError = 'Esse nome de usuário já está em uso!';
    }

    if (newUser.user_name.length < 3) {
      errors.user_nameError = 'O nome deve ter no mínimo 3 caracteres!';
    }

    if (newUser.name.length > 20) {
      errors.nameError = 'O Nome não pode ter mais que 20 caracteres!';
    }

    if (newUser.name.length < 1) {
      errors.nameError = 'O nome não pode ser vazio!';
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

    const payload = {
      sub: user.id,
      profile_image: user.profile_image,
      user_name: user.user_name,
      name: user.name,
      email: user.email,
    };

    return { token: this.jwtService.sign(payload), payload };
  }

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

    return { token: this.jwtService.sign(payload), payload };
  }
}
