import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@api/users/entities/user.entity';
import { UsersService } from '@api/users/users.service';
import { Video } from '@api/videos/entities/video.entity';
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

  async create(like: VideoLikeDto): Promise<VideoLike> {
    try {
      const newLike = await this.videoLikeRepository.create();
      newLike.user = (await this.usersService.findById(like.userId)) as User;
      const videOrError = await this.videosService.findOne(like.videoId);
      if ('error' in videOrError) {
        throw videOrError;
      }
      newLike.video = videOrError as Video;
      return this.videoLikeRepository.save(newLike);
    } catch (error) {
      this.logger.error(`Error creating like: ${error}`);
      throw error;
    }
  }

  async setLike(videoLike: VideoLike): Promise<VideoLike> {
    const likeTransform = { ...videoLike, isLike: !videoLike.isLike };
    return this.videoLikeRepository.save(likeTransform);
  }

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

  async toggleLike(likeDto: VideoLikeDto): Promise<ServiceResponse> {
    try {
      const like = await this.getLikeId(likeDto.userId, likeDto.videoId);
      const statusLike =
        like !== null ? await this.setLike(like) : await this.create(likeDto);

      return {
        message: `${statusLike.isLike ? 'like sended successful' : 'like removed'}`,
      };
    } catch (error) {
      this.logger.error(`Error like: ${error}`);
      throw error;
    }
  }
}
