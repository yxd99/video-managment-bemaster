import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@api/users/entities/user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  userId: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  removedAt: Date;
}
