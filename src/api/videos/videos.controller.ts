import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  UploadedFile,
  ParseIntPipe,
  MaxFileSizeValidator,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PayloadDto } from '@api/auth/dto/payload.dto';
import { Public } from '@common/guards/public.guard';
import { Payload } from '@shared/decorators/payload.decorator';
import { ServiceResponse } from '@shared/types';

import { MAX_SIZE_VIDEO, TYPE_PRIVACY } from './constants';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'video/*' }),
          new MaxFileSizeValidator({ maxSize: MAX_SIZE_VIDEO }),
        ],
      }),
    )
    video: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    const createVideo = { ...createVideoDto, video, user: payload.userId };
    return this.videosService.create(createVideo);
  }

  @Public()
  @Get()
  async findAll(
    @Payload() payload: PayloadDto,
    @Query('search') search: string,
  ): Promise<Video[] | ServiceResponse> {
    const isLogged = Boolean(payload);
    const videos = await this.videosService.findAll(isLogged, search);

    if ('error' in videos) {
      throw videos;
    }
    return videos;
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<Video | ServiceResponse> {
    const videoOrError = await this.videosService.findOne(id);

    if ('error' in videoOrError) {
      throw videoOrError;
    }

    const video = videoOrError as Video;

    if (!payload && video.privacy === TYPE_PRIVACY.PRIVATE) {
      throw new ForbiddenException('This video is private');
    }

    return video;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('video'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: UpdateVideoDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: 'video/*' }),
          new MaxFileSizeValidator({ maxSize: MAX_SIZE_VIDEO }),
        ],
      }),
    )
    video: Express.Multer.File,
  ): Promise<ServiceResponse> {
    const updateVideo = { ...updateVideoDto, video };
    return this.videosService.update(id, updateVideo);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    const response = await this.videosService.remove(id, payload.userId);
    if ('error' in response) {
      throw response;
    }
    return response;
  }
}
