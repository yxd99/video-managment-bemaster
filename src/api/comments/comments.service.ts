import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@api/users/entities/user.entity';
import { UsersService } from '@api/users/users.service';
import { Video } from '@api/videos/entities/video.entity';
import { VideosService } from '@api/videos/videos.service';
import { ServiceResponse } from '@shared/types';

import { CommentDto } from './dto/comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly videosService: VideosService,
  ) {}

  async create(createCommentDto: CommentDto): Promise<ServiceResponse> {
    try {
      const { userId, videoId, comment } = createCommentDto;

      const user = (await this.usersService.findById(userId)) as User;
      const video = (await this.videosService.findOne(videoId)) as Video;

      const newComment = this.commentRepository.create({
        text: comment,
        user,
        video,
      });

      await this.commentRepository.save(newComment);

      return { message: 'comment publish successful' };
    } catch (error) {
      this.logger.error(`Error creating comment: ${error.message}`);
      return {
        message:
          'Unable to create comment at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findByVideo(videoId: number): Promise<Comment[] | ServiceResponse> {
    try {
      return this.commentRepository.find({
        relations: ['user', 'video'],
        where: { video: { id: videoId } },
      });
    } catch (error) {
      this.logger.error(`Error fetching comments by video: ${error.message}`);
      return {
        message:
          'Unable to fetch comments at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<ServiceResponse> {
    try {
      const existingComment = await this.commentRepository.findOneBy({ id });

      if (!existingComment) {
        return {
          error: `Comment ${id} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      await this.commentRepository.update(id, {
        text: updateCommentDto.comment,
      });

      return { message: 'comment edited successful' };
    } catch (error) {
      this.logger.error(`Error updating comment: ${error.message}`);
      return {
        message:
          'Unable to update comment at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async remove(id: number): Promise<ServiceResponse> {
    try {
      const existingComment = await this.commentRepository.findOneBy({ id });

      if (!existingComment) {
        return {
          error: `Comment ${id} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      await this.commentRepository.softDelete(id);

      return { message: 'comment removed successful' };
    } catch (error) {
      this.logger.error(`Error removing comment: ${error.message}`);
      return {
        message:
          'Unable to remove comment at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOne(commentId: number): Promise<Comment | ServiceResponse> {
    try {
      const comment = await this.commentRepository.findOne({
        relations: ['user', 'video'],
        where: { id: commentId },
      });

      if (!comment) {
        return {
          error: `Comment ${commentId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      return comment;
    } catch (error) {
      this.logger.error(`Error fetching comment: ${error.message}`);
      return {
        message: 'Unable to fetch comment at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
