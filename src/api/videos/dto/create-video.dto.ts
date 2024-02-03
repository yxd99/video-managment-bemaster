import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import {
  MAX_LENGTH_VIDEO_DESCRIPTION,
  MAX_LENGTH_VIDEO_TITLE,
  MIN_LENGTH_VIDEO_TITLE,
} from '@/api/videos/constants';

export class CreateVideoDto {
  @IsString()
  @MinLength(MIN_LENGTH_VIDEO_TITLE)
  @MaxLength(MAX_LENGTH_VIDEO_TITLE)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_LENGTH_VIDEO_DESCRIPTION)
  description: string;

  video: Express.Multer.File;
}
