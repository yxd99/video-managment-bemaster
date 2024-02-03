import { Controller, Post, Param, Req } from '@nestjs/common';

import { VideoLikesService } from './video-likes.service';

@Controller('video-likes')
export class VideoLikesController {
  constructor(private readonly videoLikesService: VideoLikesService) {}

  @Post(':videoId')
  async like(
    @Param('videoId') videoId: number,
    @Req() { user: { id: userId } },
  ) {
    const like = await this.videoLikesService.getLikeId({ videoId, userId });
    if (like === null) {
      return this.videoLikesService.create({ videoId, userId });
    }
    return this.videoLikesService.setLike(like);
  }
}
