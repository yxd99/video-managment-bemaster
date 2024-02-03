import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  MAX_LENGTH_VIDEO_TITLE,
  MIN_LENGTH_VIDEO_TITLE,
  TYPE_PRIVACY,
} from '../constants';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: MAX_LENGTH_VIDEO_TITLE,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  url: string;

  @Column({
    type: 'enum',
    enum: TYPE_PRIVACY,
    default: TYPE_PRIVACY.PUBLIC,
  })
  privacy: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ select: false })
  removedAt: Date;
}
