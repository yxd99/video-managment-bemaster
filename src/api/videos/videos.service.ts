import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '@shared/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';

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
    const { secure_url: url } = await this.cloudinaryService.uploadFile(video);

    const videoCreate = await this.videoRepository.save({
      ...data,
      url,
    });
    return `video ${videoCreate.title} has been create successful`;
  }

  findAll() {
    return `This action returns all videos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
