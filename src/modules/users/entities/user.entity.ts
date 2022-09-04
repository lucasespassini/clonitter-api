import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  Generated,
} from 'typeorm';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Friendship } from 'src/modules/friendships/entities/friendship.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ length: 10, unique: true })
  user_name: string;

  @Column({ length: 20 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @JoinColumn()
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @JoinColumn()
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @JoinColumn()
  @OneToMany(() => Friendship, (friendship) => friendship.user)
  friendships: Friendship[];
}
