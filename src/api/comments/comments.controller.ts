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
  NotFoundException,
} from '@nestjs/common';

import { Public } from '@root/decorators';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() { user: { id: userId } },
  ) {
    const newComment = {
      ...createCommentDto,
      userId,
    };
    return this.commentsService.create(newComment);
  }

  @Public()
  @Get('video/:videoId')
  async findByVideo(@Param('videoId') videoId: number) {
    return this.commentsService.findByVideo(videoId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const comment = await this.commentsService.findOne(id);
    if (comment === null) throw new NotFoundException('comment not exist');
    return comment;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() { user: { id: userId } },
  ) {
    await this.isOwnerComment(id, userId);
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() { user: { id: userId } }) {
    await this.isOwnerComment(id, userId);
    return this.commentsService.remove(+id);
  }

  async isOwnerComment(commentId: number, userId: number) {
    const comment = await this.findOne(commentId);
    if (comment.user.id !== userId)
      throw new ForbiddenException('you are not the owner of this comment');
  }
}
