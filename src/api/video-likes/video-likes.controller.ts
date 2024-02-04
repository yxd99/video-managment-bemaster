import { Controller, Post, Param, Req } from '@nestjs/common';

import { ServiceResponse } from '@shared/types';

import { VideoLikesService } from './video-likes.service';

@Controller('video-likes')
export class VideoLikesController {
  constructor(private readonly videoLikesService: VideoLikesService) {}

  @Post(':videoId')
  async like(
    @Param('videoId') videoId: number,
    @Req() { user: { id: userId } },
  ): Promise<ServiceResponse> {
    const like = await this.videoLikesService.getLikeId({ videoId, userId });

    if (like === null) {
      await this.videoLikesService.create({ videoId, userId });
      return { message: 'Like created successfully' };
    }

    return this.videoLikesService.setLike(like);
  }
}
