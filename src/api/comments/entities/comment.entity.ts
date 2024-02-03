import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MAX_LENGTH_COMMENT } from '@api/comments/constants';
import { Video } from '@api/videos/entities/video.entity';
import { User } from '@root/users/entities/user.entity';

@Entity('video_comments')
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
}
