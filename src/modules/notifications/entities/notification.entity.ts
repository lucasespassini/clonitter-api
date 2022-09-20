import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  content: string;

  @Column({ type: 'boolean' })
  read: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
