import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseHttp } from '@root/interface';
import { CloudinaryService } from '@shared/cloudinary/cloudinary.service';

import { TYPE_PRIVACY } from './constants';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<ResponseHttp> {
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
      throw new BadRequestException('Error creating video');
    }
  }

  async findAll(isAuthenticated: boolean): Promise<Video[]> {
    const whereCondition = isAuthenticated
      ? {}
      : { privacy: TYPE_PRIVACY.PUBLIC };
    return this.videoRepository.find({ where: whereCondition });
  }

  async findOne(id: number, isAuthenticated?: boolean): Promise<Video> {
    const whereCondition = isAuthenticated
      ? {}
      : { privacy: TYPE_PRIVACY.PUBLIC };

    const video = await this.videoRepository.findOne({
      relations: ['user'],
      where: { id, ...whereCondition },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  async update(
    id: number,
    updateVideoDto: UpdateVideoDto,
  ): Promise<ResponseHttp> {
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

      return { message: 'Video has been updated' };
    } catch (error) {
      throw new BadRequestException('Error updating video');
    }
  }

  async remove(id: number): Promise<ResponseHttp> {
    try {
      const video = await this.findOne(id);

      if (!video) {
        throw new NotFoundException('Video not found');
      }

      await this.cloudinaryService.removeFile(video.publicId);
      await this.videoRepository.remove(video);

      return { message: `Video has been removed successfully` };
    } catch (error) {
      throw new BadRequestException('Error removing video');
    }
  }
}
