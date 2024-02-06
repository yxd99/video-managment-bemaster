import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { MAX_LENGTH_VIDEO_TITLE, TYPE_PRIVACY } from '@api/videos/constants';

export class QueryParamsDto {
  @IsOptional()
  @IsString()
  @MaxLength(MAX_LENGTH_VIDEO_TITLE)
  @ApiProperty({ required: false })
  search: string;

  @IsOptional()
  @IsEnum(TYPE_PRIVACY)
  @ApiProperty({ enum: TYPE_PRIVACY, required: false })
  privacy: TYPE_PRIVACY;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  user: string;
}
