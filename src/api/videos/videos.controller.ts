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
  ) {
    const createVideo = { ...createVideoDto, video };
    return this.videosService.create(createVideo);
  }

  @Public()
  @Get()
  findAll(@Req() req) {
    console.log(req.user);

    return this.videosService.findAll(req.isAuthenticated);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }
}
