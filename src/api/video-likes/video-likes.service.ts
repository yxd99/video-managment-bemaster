import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VideosService } from '@api/videos/videos.service';
import { UsersService } from '@root/users/users.service';

import { VideoLikeDto } from './dto/video-like.dto';
import { VideoLike } from './entities/video-like.entity';

@Injectable()
export class VideoLikesService {
  constructor(
    @InjectRepository(VideoLike)
    private readonly videoLikeRepository: Repository<VideoLike>,
    private readonly videosService: VideosService,
    private readonly usersService: UsersService,
  ) {}

  async create(like: VideoLikeDto) {
    const newLike = await this.videoLikeRepository.create();
    newLike.user = await this.usersService.findById(like.userId);
    newLike.video = await this.videosService.findOne(like.videoId);
    await this.videoLikeRepository.save(newLike);
    return 'Like created';
  }

  async setLike(likeId: number) {
    const like = await this.getLike(likeId);
    like.isLike = !like.isLike;
    await this.videoLikeRepository.update(likeId, like);
    return `like change to ${like.isLike}`;
  }

  async getLike(likeId: number) {
    return this.videoLikeRepository.findOne({
      relations: ['user', 'video'],
      where: {
        id: likeId,
      },
    });
  }

  async getLikeId(likeDto: VideoLikeDto) {
    const like = await this.videoLikeRepository.findOneBy({
      user: { id: likeDto.userId },
      video: { id: likeDto.videoId },
    });
    return like?.id ?? null;
  }
}
