import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MAX_LENGTH_COMMENT } from '@api/comments/constants';
import { Target } from '@api/likes/entities/target.entity';
import { User } from '@api/users/entities/user.entity';
import { Video } from '@api/videos/entities/video.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: MAX_LENGTH_COMMENT,
  })
  text: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => Video, (video) => video.id)
  @JoinColumn({
    name: 'video_id',
  })
  video: Video;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToMany(() => Target, (target) => target.video)
  target: Target[];
}
