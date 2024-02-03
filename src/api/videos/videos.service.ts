import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async create(createVideoDto: CreateVideoDto) {
    const { video, ...data } = createVideoDto;
    const { secure_url: url, public_id: publicId } =
      await this.cloudinaryService.uploadFile(video);

    const videoCreate = await this.videoRepository.save({
      ...data,
      url,
      publicId,
    });
    return `video ${videoCreate.title} has been create successful`;
  }

  async findAll(isAuthenticated: boolean): Promise<Video[]> {
    const videos = await this.getPublicVideos();
    if (isAuthenticated) videos.push(...(await this.getPrivateVideos()));

    return videos;
  }

  async findOne(id: number): Promise<Video> {
    return this.videoRepository.findOne({
      relations: ['user'],
      where: { id },
    });
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<string> {
    const { video: videoFile, ...infoVideo } = updateVideoDto;
    const video = await this.findOne(id);
    if (videoFile) {
      await this.cloudinaryService.removeFile(video.publicId);
      const { secure_url: url, public_id: publicId } =
        await this.cloudinaryService.uploadFile(videoFile);
      video.url = url;
      video.publicId = publicId;
    }
    await this.videoRepository.update(id, { ...video, ...infoVideo });
    return 'Video has been updated';
  }

  async remove(id: number): Promise<string> {
    const video = await this.findOne(id);
    if (!video) return 'video doesnt exist';
    await this.cloudinaryService.removeFile(video.publicId);
    await this.videoRepository.softRemove(video);
    return `video has been remove successful`;
  }

  async getPublicVideos(): Promise<Video[]> {
    return this.videoRepository.findBy({ privacy: TYPE_PRIVACY.PUBLIC });
  }

  async getPrivateVideos(): Promise<Video[]> {
    return this.videoRepository.findBy({ privacy: TYPE_PRIVACY.PRIVATE });
  }
}
