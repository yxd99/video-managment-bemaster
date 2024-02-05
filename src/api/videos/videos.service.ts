import {
  Injectable,
  Logger,
  HttpStatus,
  HttpException,
  NotFoundException,
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

  /**
   * Creates a new video by uploading the video file to the cloud storage and saving the video details in the database.
   * @param createVideoDto The data for creating a new video.
   * @returns The created video.
   */
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

  /**
   * Retrieves all videos, optionally filtered by a search query and authenticated status.
   * @param isAuthenticated Indicates if the user is authenticated.
   * @param query The search query.
   * @returns The list of videos.
   */
  async findAll(
    isAuthenticated: boolean,
    query?: QueryParamsDto,
  ): Promise<Video[]> {
    let privacyQuery = '';
    const privacy = query?.privacy ?? TYPE_PRIVACY.PUBLIC;
    const search = query?.search ?? '';

    if (query?.privacy) {
      privacyQuery = 'AND privacy = :privacy';
    }
    const queryBuilder = `(videos.title LIKE :query 
                            OR videos.description LIKE :query 
                            OR videos.credits LIKE :query) 
                            ${privacyQuery}`;

    return this.videoRepository
      .createQueryBuilder('videos')
      .innerJoinAndSelect('videos.user', 'users')
      .leftJoinAndSelect('videos.comments', 'video')
      .leftJoin('videos.likes', 'likes')
      .where(queryBuilder, {
        query: `%${search}%`,
        privacy,
      })
      .getMany();
  }

  /**
   * Retrieves a specific video by its ID, including the associated user and comments.
   * @param id The ID of the video.
   * @returns The video or a service response indicating an error.
   */
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

  /**
   * Updates a video by uploading a new video file and updating the video details.
   * @param id The ID of the video to update.
   * @param updateVideoDto The data for updating the video.
   */
  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<void> {
    try {
      const { video: videoFile, ...infoVideo } = updateVideoDto;
      const videoOrError = await this.findOne(id);

      if ('error' in videoOrError) {
        throw new HttpException(videoOrError.error, HttpStatus.BAD_REQUEST);
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
    } catch (error) {
      this.logger.error(`Error updating video: ${error.message}`);
      throw new HttpException('Error updating video', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Removes a video by deleting the video file from the cloud storage and marking the video as removed in the database.
   * @param id The ID of the video to remove.
   * @param userId The ID of the user removing the video.
   */
  async remove(id: number, userId: number): Promise<ServiceResponse> {
    try {
      const videoOrError = await this.findOne(id);

      const video = videoOrError as Video;

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
      if ('error' in error) {
        this.logger.error(`Error removing video: ${error.error}`);
        throw error;
      }
      this.logger.error(`Error removing video: ${error.message}`);
      throw error;
    }
  }
}
