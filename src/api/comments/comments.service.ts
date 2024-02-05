import {
  Injectable,
  Logger,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PayloadDto } from '@api/auth/dto/payload.dto';
import { User } from '@api/users/entities/user.entity';
import { UsersService } from '@api/users/users.service';
import { TYPE_PRIVACY } from '@api/videos/constants';
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

      const userComment = await this.usersService.findById(userId);
      if ('error' in userComment) {
        throw userComment;
      }
      const user = userComment as User;
      const videoVerication = await this.videosService.findOne(videoId);
      if ('error' in videoVerication) {
        throw videoVerication;
      }

      const video = videoVerication as Video;
      const newComment = this.commentRepository.create({
        text: comment,
        user,
        video,
      });

      await this.commentRepository.save(newComment);

      return { message: 'comment publish successful' };
    } catch (error) {
      if ('error' in error) {
        this.logger.error(`Error creating comment: ${error.error}`);
        throw error;
      }
      this.logger.error(`Error creating comment: ${error.message}`);
      return {
        message:
          'Unable to create comment at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findByVideo(
    videoId: number,
    isAuthenticated: boolean = false,
  ): Promise<Comment[] | ServiceResponse> {
    try {
      const getVideo = await this.videosService.findOne(videoId);
      if ('error' in getVideo) {
        throw getVideo;
      }
      const video = getVideo as Video;
      if (video.privacy === TYPE_PRIVACY.PRIVATE && !isAuthenticated) {
        return {
          error: 'these comments are from a private video',
          statusCode: HttpStatus.FORBIDDEN,
        };
      }
      return video.comments;
    } catch (error) {
      if ('error' in error) {
        this.logger.error(`Error fetching comments by video: ${error.error}`);
        throw error;
      }
      this.logger.error(`Error fetching comments by video: ${error.message}`);
      return {
        error:
          'Unable to fetch comments at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    payload: PayloadDto,
  ): Promise<ServiceResponse> {
    try {
      const comment = await this.findOne(id, Boolean(payload));

      if ('error' in comment) {
        return {
          error: `Comment not found`,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      if (comment instanceof Comment) {
        this.ensureOwnershipOfComment(comment, payload.userId);
      }

      await this.commentRepository.update(id, {
        text: updateCommentDto.comment,
      });

      return { message: 'comment edited successful' };
    } catch (error) {
      this.logger.error(`Error updating comment: ${error}`);
      throw error;
    }
  }

  async remove(id: number, payload: PayloadDto): Promise<ServiceResponse> {
    try {
      const comment = await this.findOne(id, Boolean(payload));

      if (!comment) {
        return {
          error: `Comment ${id} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      if (comment instanceof Comment) {
        this.ensureOwnershipOfComment(comment, payload.userId);
      }

      await this.commentRepository.softDelete(id);

      return { message: 'comment removed successful' };
    } catch (error) {
      this.logger.error(`Error removing comment: ${error.message}`);
      throw error;
    }
  }

  async findOne(
    commentId: number,
    isAuthenticated: boolean = false,
  ): Promise<Comment | ServiceResponse> {
    try {
      const comment = await this.commentRepository.findOne({
        relations: ['user', 'video'],
        where: { id: commentId },
      });

      if (!comment || comment.video === null) {
        return {
          error: `Comment not found`,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      if (comment.video.privacy === TYPE_PRIVACY.PRIVATE && !isAuthenticated) {
        return {
          error: 'This comment belongs to a private video',
          statusCode: HttpStatus.FORBIDDEN,
        };
      }

      return comment;
    } catch (error) {
      this.logger.error(`Error fetching comment: ${error.message}`);
      return {
        message:
          'Unable to fetch comment at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  ensureOwnershipOfComment(comment: Comment, userId: number) {
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not the owner of this comment');
    }
  }
}
