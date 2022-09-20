import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('post_likes')
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.likes)
  user: User;

  @OneToMany(() => Post, (post) => post.likes)
  post: Post;
}
