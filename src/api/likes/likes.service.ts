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
    let like;
    if (contentType === TARGET.VIDEO) {
      like = await this.likeRepository.findOne({
        relations: ['target'],
        where: {
          userId,
          target: { video: { id: contentId }, targetType: contentType },
        },
      });
    } else if (contentType === TARGET.COMMENT) {
      like = await this.likeRepository.findOne({
        relations: ['target'],
        where: {
          userId,
          target: { comment: { id: contentId }, targetType: contentType },
        },
      });
    }

    if (like !== null) {
      like.status = !like.status;
      return this.likeRepository.save(like);
    }
    const target = await this.targetRepository.create();

    if (contentType === TARGET.VIDEO) {
      const video = await this.videoService.findOne(contentId);
      if (video === null) {
        throw new NotFoundException('Video not found');
      }
      target.video = video;
    } else if (contentType === TARGET.COMMENT) {
      const comment = await this.commentService.findOne(contentId, true);
      if (comment === null) {
        throw new NotFoundException('Comment not found');
      }
      target.comment = comment;
    }
    const newLike = await this.likeRepository.create({
      target,
      userId,
      status: true,
    });

    return this.likeRepository.save(newLike);
  }

  async getMostLikedVideos(): Promise<Like[]> {
    return this.likeRepository
      .createQueryBuilder('likes')
      .select(['COUNT(video.id) AS totalLikes', 'video'])
      .innerJoin('likes.target', 'target')
      .innerJoin('target.video', 'video')
      .where('likes.status = :status', { status: 1 })
      .groupBy('video.id')
      .orderBy('totalLikes', 'DESC')
      .getRawMany();
  }

  async getMostLikedComments(): Promise<Like[]> {
    return this.likeRepository
      .createQueryBuilder('likes')
      .select(['COUNT(comment.id) AS totalLikes', 'comment'])
      .innerJoin('likes.target', 'target')
      .innerJoin('target.comment', 'comment')
      .where('likes.status = :status', { status: 1 })
      .groupBy('comment.id')
      .orderBy('totalLikes', 'DESC')
      .getRawMany();
  }
}
