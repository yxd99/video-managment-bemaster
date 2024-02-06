import {
  Injectable,
  Logger,
  HttpStatus,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloudinaryService } from '@shared/cloudinary/cloudinary.service';
import { ServiceResponse } from '@shared/types';

import { TYPE_PRIVACY } from './constants';
import { CreateVideoDto } from './dto/create-video.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);

  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    try {
      const { video, ...data } = createVideoDto;
      const { secure_url: url, public_id: publicId } =
        await this.cloudinaryService.uploadFile(video);

      return await this.videoRepository.save({
        ...data,
        url,
        publicId,
      });
    } catch (error) {
      this.logger.error(`Error creating video: ${error.message}`);
      throw new HttpException('Error creating video', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(
    isAuthenticated: boolean,
    query?: QueryParamsDto,
  ): Promise<Video[]> {
    let privacyQuery = '';
    const privacy = query?.privacy ?? '';
    const search = query?.search ?? '';
    const user = query?.user ?? '';
    if (privacy === TYPE_PRIVACY.PRIVATE && !isAuthenticated) {
      throw new UnauthorizedException(
        'You must be logged in to view private videos.',
      );
    }

    if (query?.privacy) {
      privacyQuery = 'AND privacy = :privacy';
    }
    const queryBuilder = `(videos.title LIKE :query 
                            OR videos.description LIKE :query 
                            OR videos.credits LIKE :query
                            OR users.username LIKE :user
                            OR users.email LIKE :user) 
                            ${privacyQuery}`;

    return this.videoRepository
      .createQueryBuilder('videos')
      .innerJoinAndSelect('videos.user', 'users')
      .where(queryBuilder, {
        query: `%${search}%`,
        user: `%${user}%`,
        privacy,
      })
      .getMany();
  }

  async findOne(id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({
      relations: ['user', 'comments', 'comments.user'],
      where: { id },
    });
    if (video === null) {
      throw new NotFoundException('Video not found');
    }
    return video;
  }

  async update(
    id: number,
    updateVideoDto: UpdateVideoDto,
  ): Promise<ServiceResponse> {
    try {
      const { video: videoFile, ...infoVideo } = updateVideoDto;
      const video = await this.findOne(id);

      if (videoFile) {
        await this.cloudinaryService.removeFile(video.publicId);
        const { secure_url: url, public_id: publicId } =
          await this.cloudinaryService.uploadFile(videoFile);
        video.url = url;
        video.publicId = publicId;
      }

      await this.videoRepository.save({ ...video, ...infoVideo });
      return {
        message: 'Video has been update',
      };
    } catch (error) {
      this.logger.error(`Error updating video: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number, userId: number): Promise<ServiceResponse> {
    try {
      const videoOrError = await this.findOne(id);

      const video = videoOrError;

      if (video.user.id !== userId) {
        throw new HttpException(
          'You are not the owner of this video',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.cloudinaryService.removeFile(video.publicId);
      await this.videoRepository.softRemove(video);
      return {
        message: 'video has been deleted',
      };
    } catch (error) {
      this.logger.error(`Error removing video: ${error.message}`);
      throw error;
    }
  }
}
