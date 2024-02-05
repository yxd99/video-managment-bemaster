import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PayloadDto } from '@api/auth/dto/payload.dto';
import { Public } from '@common/guards/public.guard';
import { Payload } from '@decorators/payload.decorator';
import { likeSchema } from '@schemas/index';
import { ServiceResponse } from '@shared/types';

import { LikesService } from './likes.service';

@Controller('likes')
@ApiTags('Videos')
@ApiBearerAuth()
@ApiUnauthorizedResponse(likeSchema.common.unauhtorizedSchema)
@ApiNotFoundResponse(likeSchema.common.notFoundSchema)
@ApiOkResponse(likeSchema.common.okSchema)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('video/:videoId')
  @HttpCode(HttpStatus.OK)
  async like(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    return this.likesService.toggleLike({
      videoId,
      userId: payload.userId,
    });
  }

  @Public()
  @Get('video/most-popular')
  async getMostPopular(@Payload() payload: PayloadDto) {
    return this.likesService.getVideosMostPopular(Boolean(payload));
  }
}
