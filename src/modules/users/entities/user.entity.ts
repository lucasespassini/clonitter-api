import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Friend } from 'src/modules/friends/entities/friend.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
  @OneToMany(() => Friend, (friend) => friend.user)
  friends: Friend[];
}
