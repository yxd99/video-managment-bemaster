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
import { commentSchema } from '@schemas/index';
import { Payload } from '@shared/decorators';
import { ServiceResponse } from '@shared/types';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
@ApiBearerAuth()
@ApiTags('comments')
@ApiUnauthorizedResponse(commentSchema.common.unauhtorizedSchema)
@ApiBadRequestResponse(commentSchema.common.badRequestSchema)
@ApiNotFoundResponse(commentSchema.common.notFoundSchema)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':videoId')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse(commentSchema.create.notFoundSchema)
  @ApiOkResponse(commentSchema.create.okSchema)
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
  @ApiNotFoundResponse(commentSchema.create.notFoundSchema)
  @ApiForbiddenResponse(commentSchema.findByVideo.forbiddenSchema)
  @ApiOkResponse(commentSchema.findByVideo.okSchema)
  async findByVideo(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Payload() payload: PayloadDto,
  ): Promise<Comment[]> {
    return this.commentsService.findByVideo(videoId, Boolean(payload));
  }

  @Public()
  @Get(':id')
  @ApiOkResponse(commentSchema.findById.okSchema)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<Comment> {
    return this.commentsService.findOne(id, Boolean(payload));
  }

  @Patch(':id')
  @ApiForbiddenResponse(commentSchema.common.forbiddenSchema)
  @ApiOkResponse(commentSchema.update.okSchema)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    return this.commentsService.update(+id, updateCommentDto, payload);
  }

  @Delete(':id')
  @ApiForbiddenResponse(commentSchema.common.forbiddenSchema)
  @ApiOkResponse(commentSchema.remove.okSchema)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    return this.commentsService.remove(+id, payload);
  }
}
