import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

import { Comment } from '@api/comments/entities/comment.entity';
import { Video } from '@api/videos/entities/video.entity';

@Entity()
export class Target {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  targetType: string;

  @ManyToOne(() => Video, { cascade: true, nullable: true })
  @JoinColumn({ name: 'target_id_video', referencedColumnName: 'id' })
  video: Video;

  @ManyToOne(() => Comment, { cascade: true, nullable: true })
  @JoinColumn({ name: 'target_id_comment', referencedColumnName: 'id' })
  comment: Comment;

  @DeleteDateColumn({ select: false })
  removedAt: Date;
}
