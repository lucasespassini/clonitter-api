import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('friendships')
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @ManyToOne(() => User, (user) => user.friendships, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
