import { Comment } from 'src/modules/comments/entities/comment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comment_likes')
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.likes)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.likes)
  comment: Comment;
}
