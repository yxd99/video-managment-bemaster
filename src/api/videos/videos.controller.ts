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
  MaxFileSizeValidator,
  Req,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Public } from '@root/decorators';

import { MAX_SIZE_VIDEO } from './constants';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  create(
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
    @Req() { user: { id: userId } },
  ) {
    const createVideo = { ...createVideoDto, video, userId };
    return this.videosService.create(createVideo);
  }

  @Public()
  @Get()
  findAll(@Req() req) {
    return this.videosService.findAll(req.isAuthenticated);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const video = await this.videosService.findOne(id);

    if (video == null) throw new NotFoundException('video not exist');
    return video;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('video'))
  async update(
    @Req() { user: { id: userId } },
    @Param('id') id: number,
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
  ) {
    await this.isOwnerVideo(id, userId);
    if (Object.entries(updateVideoDto).length === 0)
      throw new BadRequestException('should send data for update');
    const updateVideo = {
      ...updateVideoDto,
    };
    if (video) {
      updateVideo.video = video;
    }
    return this.videosService.update(+id, updateVideo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }

  async isOwnerVideo(videoId: number, userId: number): Promise<void> {
    const video = await this.findOne(videoId);
    if (video.user.id !== userId)
      throw new ForbiddenException('you are not the owner of this video');
  }
}
