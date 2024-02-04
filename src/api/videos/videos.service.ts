import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { CloudinaryService } from '@shared/cloudinary/cloudinary.service';
import { ServiceResponse } from '@shared/types';

import { TYPE_PRIVACY } from './constants';
import { CreateVideoDto } from './dto/create-video.dto';
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

  async create(createVideoDto: CreateVideoDto): Promise<ServiceResponse> {
    try {
      const { video, ...data } = createVideoDto;
      const { secure_url: url, public_id: publicId } =
        await this.cloudinaryService.uploadFile(video);

      const videoCreate = await this.videoRepository.save({
        ...data,
        url,
        publicId,
      });

      return {
        message: `Video ${videoCreate.title} has been created successfully`,
      };
    } catch (error) {
      this.logger.error(`Error creating video: ${error.message}`, error.stack);
      return {
        message: 'Error creating video',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async findAll(
    isAuthenticated: boolean,
    query?: string,
  ): Promise<Video[] | ServiceResponse> {
    try {
      const whereCondition = isAuthenticated
        ? {}
        : { privacy: TYPE_PRIVACY.PUBLIC };

      let videos: Video[] | ServiceResponse;

      if (query) {
        videos = await this.videoRepository.find({
          where: {
            ...whereCondition,
            title: Like(`%${query}%`),
            description: Like(`${query}`),
            credits: Like(`${query}`),
          },
        });
      } else {
        videos = await this.videoRepository.find({ where: whereCondition });
      }

      if (!videos || (Array.isArray(videos) && videos.length === 0)) {
        return {
          error: 'Videos not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      return videos;
    } catch (error) {
      this.logger.error(`Error fetching videos: ${error.message}`, error.stack);
      return {
        message: 'Error fetching videos',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async findOne(
    id: number,
    isAuthenticated?: boolean,
  ): Promise<Video | ServiceResponse> {
    try {
      const whereCondition = isAuthenticated
        ? {}
        : { privacy: TYPE_PRIVACY.PUBLIC };

      const video = await this.videoRepository.findOne({
        relations: ['user'],
        where: { id, ...whereCondition },
      });

      if (!video) {
        return {
          error: 'Video not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      return video;
    } catch (error) {
      this.logger.error(`Error fetching video: ${error.message}`, error.stack);
      return {
        message: 'Error fetching video',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async update(
    id: number,
    updateVideoDto: UpdateVideoDto,
  ): Promise<ServiceResponse> {
    try {
      const { video: videoFile, ...infoVideo } = updateVideoDto;
      const videoOrError = await this.findOne(id);

      if ('error' in videoOrError) {
        throw videoOrError;
      }

      const video = videoOrError as Video;

      if (videoFile) {
        await this.cloudinaryService.removeFile(video.publicId);
        const { secure_url: url, public_id: publicId } =
          await this.cloudinaryService.uploadFile(videoFile);
        video.url = url;
        video.publicId = publicId;
      }

      await this.videoRepository.save({ ...video, ...infoVideo });

      return { message: 'Video has been updated' };
    } catch (error) {
      this.logger.error(`Error updating video: ${error.message}`, error.stack);
      return {
        message: 'Error updating video',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async remove(id: number): Promise<ServiceResponse> {
    try {
      const videoOrError = await this.findOne(id);

      if ('error' in videoOrError) {
        throw videoOrError;
      }

      const video = videoOrError as Video;

      await this.cloudinaryService.removeFile(video.publicId);
      await this.videoRepository.remove(video);

      return { message: `Video has been removed successfully` };
    } catch (error) {
      this.logger.error(`Error removing video: ${error.message}`, error.stack);
      return {
        message: 'Error removing video',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
