import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ForbiddenException,
} from '@nestjs/common';

import { Public } from '@common/guards/public.guard';
import { ServiceResponse } from '@shared/types';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() { user: { id: userId } },
  ): Promise<ServiceResponse> {
    const newComment = {
      ...createCommentDto,
      userId,
    };
    return this.commentsService.create(newComment);
  }

  @Public()
  @Get('video/:videoId')
  async findByVideo(
    @Param('videoId') videoId: number,
  ): Promise<Comment[] | ServiceResponse> {
    return this.commentsService.findByVideo(videoId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Comment | ServiceResponse> {
    const commentOrServiceResponse = await this.commentsService.findOne(id);

    if ('error' in commentOrServiceResponse) {
      throw commentOrServiceResponse;
    }

    return commentOrServiceResponse;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() { user: { id: userId } },
  ): Promise<ServiceResponse> {
    await this.isOwnerComment(id, userId);
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() { user: { id: userId } },
  ): Promise<ServiceResponse> {
    await this.isOwnerComment(id, userId);
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
