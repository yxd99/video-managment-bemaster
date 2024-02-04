import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';

import { PayloadDto } from '@api/auth/dto/payload.dto';
import { Public } from '@common/guards/public.guard';
import { Payload } from '@shared/decorators';
import { ServiceResponse } from '@shared/types';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':videoId')
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
  async findByVideo(
    @Param('videoId', ParseIntPipe) videoId: number,
  ): Promise<Comment[] | ServiceResponse> {
    return this.commentsService.findByVideo(videoId);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Comment | ServiceResponse> {
    const commentOrServiceResponse = await this.commentsService.findOne(id);

    if ('error' in commentOrServiceResponse) {
      throw commentOrServiceResponse;
    }

    return commentOrServiceResponse;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    await this.isOwnerComment(id, payload.userId);
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    await this.isOwnerComment(id, payload.userId);
    return this.commentsService.remove(+id);
  }

  async isOwnerComment(commentId: number, userId: number): Promise<void> {
    const commentOrServiceResponse =
      await this.commentsService.findOne(commentId);

    if ('error' in commentOrServiceResponse) {
      throw commentOrServiceResponse;
    }

    const comment = commentOrServiceResponse as Comment;

    if (!comment || comment.user.id !== userId) {
      throw new ForbiddenException('You are not the owner of this comment');
    }
  }
}
