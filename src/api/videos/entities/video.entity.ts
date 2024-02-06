import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from '@api/comments/entities/comment.entity';
import { Target } from '@api/likes/entities/target.entity';
import { User } from '@api/users/entities/user.entity';
import { MAX_LENGTH_VIDEO_TITLE, TYPE_PRIVACY } from '@api/videos/constants';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: '',
    type: 'varchar',
    length: MAX_LENGTH_VIDEO_TITLE,
  })
  title: string = '';

  @Column({
    default: '',
    type: 'text',
  })
  description: string = '';

  @Column({
    default: '',
    type: 'text',
    nullable: false,
  })
  url: string = '';

  @Column({
    type: 'enum',
    enum: TYPE_PRIVACY,
    default: TYPE_PRIVACY.PUBLIC,
  })
  privacy: string;

  @Column({
    default: '',
    type: 'text',
  })
  publicId: string;

  @Column({
    default: '',
    type: 'text',
  })
  credits: string = '';

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @DeleteDateColumn({ select: false })
  removedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.video)
  comments: Comment[];

  @OneToMany(() => Target, (target) => target.video)
  target: Target[];
}
