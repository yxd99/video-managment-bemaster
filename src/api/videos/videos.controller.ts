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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PayloadDto } from '@api/auth/dto/payload.dto';
import { Public } from '@common/guards/public.guard';
import { videosSchema } from '@schemas/index';
import { Payload } from '@shared/decorators/payload.decorator';
import { ServiceResponse } from '@shared/types';

import { MAX_SIZE_VIDEO, TYPE_PRIVACY } from './constants';
import { CreateVideoDto } from './dto/create-video.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { VideosService } from './videos.service';

@Controller('videos')
@ApiTags('Videos')
@ApiBearerAuth()
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  @ApiUnauthorizedResponse(videosSchema.common.unauhtorizedSchema)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
    const videoCreated = await this.videosService.create(createVideo);
    return {
      message: `video has been created, url: ${videoCreated.url}`,
    };
  }

  @Public()
  @Get()
  async findAll(
    @Payload() payload: PayloadDto,
    @Query() query: QueryParamsDto,
  ): Promise<Video[]> {
    const isLogged = Boolean(payload);
    if (!isLogged && query.privacy === TYPE_PRIVACY.PRIVATE) {
      throw new ForbiddenException('You must log in first');
    }
    return this.videosService.findAll(isLogged, query);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<Video> {
    const video = await this.videosService.findOne(id);

    if (!payload && video.privacy === TYPE_PRIVACY.PRIVATE) {
      throw new ForbiddenException('This video is private');
    }

    return video;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('video'))
  @ApiUnauthorizedResponse(videosSchema.common.unauhtorizedSchema)
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
    await this.videosService.update(id, updateVideo);
    return {
      message: 'video has been updated',
    };
  }

  @Delete(':id')
  @ApiUnauthorizedResponse(videosSchema.common.unauhtorizedSchema)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: PayloadDto,
  ): Promise<ServiceResponse> {
    return this.videosService.remove(id, payload.userId);
  }
}
