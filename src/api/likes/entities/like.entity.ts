import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Target } from './target.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Target, (target) => target.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetId' })
  target: Target;
}
