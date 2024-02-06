import { Controller, Post, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PayloadDto } from '@api/auth/dto/payload.dto';
import { Payload } from '@decorators/payload.decorator';

import { TARGET } from './constants';
import { LikesService } from './likes.service';

@Controller('likes')
@ApiTags('Likes')
@ApiBearerAuth()
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/videos/:videoId')
  async toggleLikeVideo(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Payload() payload: PayloadDto,
  ) {
    return this.likesService.toggleLike(payload.userId, videoId, TARGET.VIDEO);
  }

  @Post('/comments/:commentId')
  async toggleLikeComentario(
    @Param('commentId', ParseIntPipe) comentarioId: number,
    @Payload() payload: PayloadDto,
  ) {
    return this.likesService.toggleLike(
      payload.userId,
      comentarioId,
      TARGET.COMMENT,
    );
  }

  @Get('/videos/most-liked')
  async getMostLikedVideos() {
    return this.likesService.getMostLikedVideos();
  }

  @Get('/comentarios/most-liked')
  async getMostLikedComentarios() {
    return this.likesService.getMostLikedComments();
  }
}
