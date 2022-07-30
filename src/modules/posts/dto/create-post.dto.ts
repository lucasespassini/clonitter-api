import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Digite algo para postar!' })
  content: string;

  @IsNotEmpty({ message: 'Usuário inválido!' })
  userId: string;
}
