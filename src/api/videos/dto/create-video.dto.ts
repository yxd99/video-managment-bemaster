import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  MAX_LENGTH_VIDEO_DESCRIPTION,
  MAX_LENGTH_VIDEO_TITLE,
  MIN_LENGTH_VIDEO_TITLE,
  TYPE_PRIVACY,
} from '@api/videos/constants';

export class CreateVideoDto {
  @IsString()
  @MinLength(MIN_LENGTH_VIDEO_TITLE)
  @MaxLength(MAX_LENGTH_VIDEO_TITLE)
  @ApiProperty({
    minLength: MIN_LENGTH_VIDEO_TITLE,
    maxLength: MAX_LENGTH_VIDEO_TITLE,
  })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_LENGTH_VIDEO_DESCRIPTION)
  @ApiProperty({ maxLength: MAX_LENGTH_VIDEO_DESCRIPTION, required: false })
  description: string;

  @IsOptional()
  @IsEnum(TYPE_PRIVACY)
  @ApiProperty({
    enum: TYPE_PRIVACY,
    default: TYPE_PRIVACY.PUBLIC,
    required: false,
  })
  privacy: TYPE_PRIVACY;

  @ApiProperty({
    format: 'video/*',
  })
  video: Express.Multer.File;
}
