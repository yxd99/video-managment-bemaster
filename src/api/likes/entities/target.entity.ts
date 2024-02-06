import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Comment } from '@api/comments/entities/comment.entity';
import { Video } from '@api/videos/entities/video.entity';

@Entity()
export class Target {
  @PrimaryGeneratedColumn()
  targetId: number;

  @Column()
  targetType: string;

  @OneToOne(() => Video, { cascade: true, nullable: true })
  @JoinColumn({ name: 'target_id_video', referencedColumnName: 'id' })
  video: Video;

  @OneToOne(() => Comment, { cascade: true, nullable: true })
  @JoinColumn({ name: 'target_id_comment', referencedColumnName: 'id' })
  comment: Comment;
}
