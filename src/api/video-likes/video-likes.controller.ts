import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PayloadDto } from '@api/auth/dto/payload.dto';
import { Payload } from '@decorators/payload.decorator';
import { videoLikeSchema } from '@schemas/index';
import { ServiceResponse } from '@shared/types';

import { VideoLikesService } from './video-likes.service';

@Controller('video-likes')
@ApiTags('Videos')
@ApiBearerAuth()
@ApiUnauthorizedResponse(videoLikeSchema.common.unauhtorizedSchema)
@ApiNotFoundResponse(videoLikeSchema.common.notFoundSchema)
@ApiOkResponse(videoLikeSchema.common.okSchema)
export class VideoLikesController {
  constructor(private readonly videoLikesService: VideoLikesService) {}

  @Post(':videoId')
  @HttpCode(HttpStatus.OK)
  async like(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    return this.videoLikesService.toggleLike({
      videoId,
      userId: payload.userId,
    });
  }
}
