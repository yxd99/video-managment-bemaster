import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '@api/users/users.service';
import { TYPE_PRIVACY } from '@api/videos/constants';
import { VideosService } from '@api/videos/videos.service';
import { Nullable, ServiceResponse } from '@shared/types';

import { LikeDto } from './dto/like.dto';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);

  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly videosService: VideosService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new video like by associating a user and a video.
   * @param like - The video like data.
   * @returns The created video like.
   */
  async create(like: LikeDto): Promise<Like> {
    try {
      const newLike = this.likeRepository.create();
      newLike.user = await this.usersService.findById(like.userId);
      const video = await this.videosService.findOne(like.videoId);
      if (!video) {
        throw new NotFoundException('Video not found');
      }
      newLike.video = video;
      return this.likeRepository.save(newLike);
    } catch (error) {
      this.logger.error(`Error creating like: ${error}`);
      throw error;
    }
  }

  /**
   * Toggles the like status of a video like (changes it from like to dislike or vice versa).
   * @param like - The video like to toggle.
   * @returns The updated video like.
   */
  async setLike(like: Like): Promise<Like> {
    return this.likeRepository.save({
      ...like,
      isLike: !like.isLike,
    });
  }

  /**
   * Retrieves the like ID for a specific user and video.
   * @param userId - The ID of the user.
   * @param videoId - The ID of the video.
   * @returns The like object if found, or null if not found.
   */
  async getLikeId(userId: number, videoId: number): Promise<Nullable<Like>> {
    try {
      return await this.likeRepository.findOne({
        where: { user: { id: userId }, video: { id: videoId } },
      });
    } catch (error) {
      this.logger.error(`Error fetching like: ${error.message}`);
      throw error;
    }
  }

  /**
   * Toggles the like status for a specific user and video.
   * If the like exists, it is toggled. If it doesn't exist, a new like is created.
   * @param likeDto - The video like data.
   * @returns A success message.
   */
  async toggleLike(likeDto: LikeDto): Promise<ServiceResponse> {
    try {
      const like = await this.getLikeId(likeDto.userId, likeDto.videoId);
      const statusLike = like
        ? await this.setLike(like)
        : await this.create(likeDto);

      return {
        message: `${statusLike.isLike ? 'like sent successfully' : 'like removed'}`,
      };
    } catch (error) {
      this.logger.error(`Error toggling like: ${error}`);
      throw error;
    }
  }

  async getVideosMostPopular(isAuthenticated: boolean) {
    const queryBuilder = `likes.isLike = :isLike ${isAuthenticated ? '' : 'AND video.privacy = :privacy'}`;

    return this.likeRepository
      .createQueryBuilder('likes')
      .leftJoinAndSelect('likes.video', 'video')
      .select(['COUNT(video.id) as totalLikes', 'video'])
      .groupBy('video.id')
      .orderBy('totalLikes', 'DESC')
      .where(queryBuilder, {
        isLike: true,
        privacy: TYPE_PRIVACY.PUBLIC,
      })
      .getRawMany();
  }
}
