import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '@api/users/users.service';
import { VideosService } from '@api/videos/videos.service';
import { Nullable, ServiceResponse } from '@shared/types';

import { VideoLikeDto } from './dto/video-like.dto';
import { VideoLike } from './entities/video-like.entity';

@Injectable()
export class VideoLikesService {
  private readonly logger = new Logger(VideoLikesService.name);

  constructor(
    @InjectRepository(VideoLike)
    private readonly videoLikeRepository: Repository<VideoLike>,
    private readonly videosService: VideosService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new video like by associating a user and a video.
   * @param like - The video like data.
   * @returns The created video like.
   */
  async create(like: VideoLikeDto): Promise<VideoLike> {
    try {
      const newLike = this.videoLikeRepository.create();
      newLike.user = await this.usersService.findById(like.userId);
      const video = await this.videosService.findOne(like.videoId);
      if (!video) {
        throw new Error('Video not found');
      }
      newLike.video = video;
      return this.videoLikeRepository.save(newLike);
    } catch (error) {
      this.logger.error(`Error creating like: ${error}`);
      throw error;
    }
  }

  /**
   * Toggles the like status of a video like (changes it from like to dislike or vice versa).
   * @param videoLike - The video like to toggle.
   * @returns The updated video like.
   */
  async setLike(videoLike: VideoLike): Promise<VideoLike> {
    return this.videoLikeRepository.save({
      ...videoLike,
      isLike: !videoLike.isLike,
    });
  }

  /**
   * Retrieves the like ID for a specific user and video.
   * @param userId - The ID of the user.
   * @param videoId - The ID of the video.
   * @returns The like object if found, or null if not found.
   */
  async getLikeId(
    userId: number,
    videoId: number,
  ): Promise<Nullable<VideoLike>> {
    try {
      return await this.videoLikeRepository.findOne({
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
  async toggleLike(likeDto: VideoLikeDto): Promise<ServiceResponse> {
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
}
