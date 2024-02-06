import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentsService } from '@api/comments/comments.service';
import { VideosService } from '@api/videos/videos.service';

import { TARGET } from './constants';
import { Like } from './entities/like.entity';
import { Target } from './entities/target.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Target)
    private readonly targetRepository: Repository<Target>,
    private readonly videoService: VideosService,
    private readonly commentService: CommentsService,
  ) {}

  async toggleLike(
    userId: number,
    contentId: number,
    contentType: string,
  ): Promise<Like> {
    let target = await this.targetRepository.findOne({
      where: { targetId: contentId, targetType: contentType },
    });

    if (!target) {
      target = await this.targetRepository.save({ targetType: contentType });

      if (contentType === TARGET.VIDEO) {
        const video = await this.videoService.findOne(contentId);
        if (video === null) {
          throw new NotFoundException('Video not found');
        }
        target.video = video;
      } else if (contentType === TARGET.COMMENT) {
        const comment = await this.commentService.findOne(contentId);
        if (comment === null) {
          throw new NotFoundException('Video not found');
        }
        target.comment = comment;
      }

      await this.targetRepository.save(target);
    }

    const existingLike = await this.likeRepository.findOne({
      where: { userId, target },
    });

    if (existingLike) {
      return this.likeRepository.remove(existingLike);
    }

    const like = this.likeRepository.create({ userId, target });
    return this.likeRepository.save(like);
  }

  async getMostLikedVideos(): Promise<Like[]> {
    return this.likeRepository
      .createQueryBuilder('likes')
      .leftJoinAndSelect('likes.target', 'target')
      .leftJoinAndSelect('target.video', 'video')
      .orderBy('COUNT(likes)', 'DESC')
      .addGroupBy('video.id')
      .getMany();
  }

  async getMostLikedComments(): Promise<Like[]> {
    return this.likeRepository
      .createQueryBuilder('likes')
      .leftJoinAndSelect('likes.target', 'target')
      .leftJoinAndSelect('target.comments', 'comment')
      .orderBy('COUNT(likes)', 'DESC')
      .addGroupBy('comment.id')
      .getMany();
  }
}
