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
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PayloadDto } from '@root/auth/dto/payload.dto';
import { Public } from '@root/decorators';
import { Payload } from '@root/decorators/payload.decorator';
import { ResponseHttp } from '@root/interface';

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
  ): Promise<ResponseHttp> {
    try {
      const createVideo = { ...createVideoDto, video, userId: payload.userId };
      return await this.videosService.create(createVideo);
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  @Public()
  @Get()
  async findAll(@Payload() payload: PayloadDto): Promise<Video[]> {
    try {
      const isLogged = Boolean(payload);
      return await this.videosService.findAll(isLogged);
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<Video> {
    try {
      const video = await this.videosService.findOne(id);

      if (!video) {
        throw new NotFoundException('Video not found');
      }

      if (!payload && video.privacy === TYPE_PRIVACY.PRIVATE) {
        throw new ForbiddenException('This video is private');
      }

      return video;
    } catch (error) {
      throw this.handleServiceError(error);
    }
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
  ): Promise<ResponseHttp> {
    try {
      this.validateUpdateVideoDto(updateVideoDto);

      const updateVideo = { ...updateVideoDto };
      if (video) {
        updateVideo.video = video;
      }

      return await this.videosService.update(+id, updateVideo);
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseHttp> {
    try {
      return await this.videosService.remove(id);
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  private validateUpdateVideoDto(updateVideoDto: UpdateVideoDto): void {
    if (Object.entries(updateVideoDto).length === 0) {
      throw new BadRequestException('Should send data for update');
    }
  }

  private handleServiceError(error: unknown): never {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof ForbiddenException
    ) {
      throw error;
    } else {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
