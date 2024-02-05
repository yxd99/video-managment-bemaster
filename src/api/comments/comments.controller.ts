import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PayloadDto } from '@api/auth/dto/payload.dto';
import { Public } from '@common/guards/public.guard';
import { commentsSchemas } from '@schemas/index';
import { Payload } from '@shared/decorators';
import { ServiceResponse } from '@shared/types';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
@ApiBearerAuth()
@ApiTags('comments')
@ApiUnauthorizedResponse(commentsSchemas.common.unauhtorizedSchema)
@ApiBadRequestResponse(commentsSchemas.common.badRequestSchema)
@ApiNotFoundResponse(commentsSchemas.common.notFoundSchema)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':videoId')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse(commentsSchemas.create.notFoundSchema)
  @ApiOkResponse(commentsSchemas.create.okSchema)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('videoId', ParseIntPipe) videoId: number,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    const newComment = {
      ...createCommentDto,
      userId: payload.userId,
      videoId,
    };
    return this.commentsService.create(newComment);
  }

  @Public()
  @Get('video/:videoId')
  @ApiNotFoundResponse(commentsSchemas.create.notFoundSchema)
  @ApiForbiddenResponse(commentsSchemas.findByVideo.forbiddenSchema)
  @ApiOkResponse(commentsSchemas.findByVideo.okSchema)
  async findByVideo(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Payload() payload: PayloadDto,
  ): Promise<Comment[]> {
    const comments = await this.commentsService.findByVideo(
      videoId,
      Boolean(payload),
    );
    if ('error' in comments) {
      throw comments;
    }
    return comments as Comment[];
  }

  @Public()
  @Get(':id')
  @ApiOkResponse(commentsSchemas.findById.okSchema)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<Comment> {
    const comment = await this.commentsService.findOne(id, Boolean(payload));

    if ('error' in comment) {
      throw comment;
    }

    return comment as Comment;
  }

  @Patch(':id')
  @ApiForbiddenResponse(commentsSchemas.common.forbiddenSchema)
  @ApiOkResponse(commentsSchemas.update.okSchema)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    const response = await this.commentsService.update(
      +id,
      updateCommentDto,
      payload,
    );
    if ('error' in response) {
      throw response;
    }
    return response;
  }

  @Delete(':id')
  @ApiForbiddenResponse(commentsSchemas.common.forbiddenSchema)
  @ApiOkResponse(commentsSchemas.remove.okSchema)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    return this.commentsService.remove(+id, payload);
  }
}
