import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@api/users/entities/user.entity';
import { UsersService } from '@api/users/users.service';
import { Video } from '@api/videos/entities/video.entity';
import { VideosService } from '@api/videos/videos.service';
import { ServiceResponse } from '@shared/types';

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

  async create(like: VideoLikeDto): Promise<ServiceResponse> {
    try {
      const newLike = await this.videoLikeRepository.create();
      newLike.user = (await this.usersService.findById(like.userId)) as User;
      newLike.video = (await this.videosService.findOne(like.videoId)) as Video;
      await this.videoLikeRepository.save(newLike);
      return { message: 'Like created' };
    } catch (error) {
      this.logger.error(`Error creating like: ${error.message}`);
      return {
        error: 'Unable to create like at the moment. Please try again later.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async setLike(likeId: number): Promise<ServiceResponse> {
    try {
      const like = await this.getLike(likeId);

      if ('error' in like) {
        return like;
      }
      if ('isLike' in like) {
        like.isLike = !like.isLike;
        await this.videoLikeRepository.update(likeId, like);
        return { message: `like change to ${like.isLike}` };
      }
      return {
        error: 'Invalid response format from database',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    } catch (error) {
      this.logger.error(`Error setting like: ${error.message}`);
      return {
        error: 'Unable to set like at the moment. Please try again later.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getLike(likeId: number): Promise<VideoLike | ServiceResponse> {
    try {
      const like = await this.videoLikeRepository.findOne({
        relations: ['user', 'video'],
        where: { id: likeId },
      });

      if (!like) {
        return {
          error: `Like ${likeId} not found`,
          status: HttpStatus.NOT_FOUND,
        };
      }

      return like;
    } catch (error) {
      this.logger.error(`Error fetching like: ${error.message}`);
      return {
        error: 'Unable to fetch like at the moment. Please try again later.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getLikeId(likeDto: VideoLikeDto): Promise<number | null> {
    try {
      const like = await this.videoLikeRepository.findOneBy({
        user: { id: likeDto.userId },
        video: { id: likeDto.videoId },
      });
      return like?.id ?? null;
    } catch (error) {
      this.logger.error(`Error getting like ID: ${error.message}`);
      return null;
    }
  }
}
