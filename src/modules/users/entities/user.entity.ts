import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Friendship } from 'src/modules/friendships/entities/friendship.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  Generated,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid: string;

  @Column({ length: 50, unique: true })
  user_name: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, unique: true })
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
