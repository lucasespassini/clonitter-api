import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Digite algo para postar!' })
  content: string;

  @IsNotEmpty({ message: 'Usuário inválido!' })
  userId: string;

  @IsNotEmpty({ message: 'Post inválido!' })
  postId: string;
}
