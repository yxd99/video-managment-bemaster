import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '@api/users/users.service';
import { VideosService } from '@api/videos/videos.service';

import { CommentDto } from './dto/comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly videosService: VideosService,
  ) {}

  async create(createCommentDto: CommentDto) {
    const newComment = await this.commentRepository.create({
      text: createCommentDto.comment,
    });
    newComment.user = await this.usersService.findById(createCommentDto.userId);
    newComment.video = await this.videosService.findOne(
      createCommentDto.videoId,
    );
    await this.commentRepository.save(newComment);
    return 'comment publish successful';
  }

  async findByVideo(videoId: number) {
    return this.commentRepository.find({
      relations: ['user', 'video'],
      where: { video: { id: videoId } },
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.commentRepository.update(id, { text: updateCommentDto.comment });
    return `comment edited successful`;
  }

  async remove(id: number) {
    await this.commentRepository.softDelete(id);
    return `comment removed successful`;
  }

  async findOne(commentId: number) {
    return this.commentRepository.findOne({
      relations: ['user', 'video'],
      where: {
        id: commentId,
      },
    });
  }
}
