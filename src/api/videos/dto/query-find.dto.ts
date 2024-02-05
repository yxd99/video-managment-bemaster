import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { MAX_LENGTH_VIDEO_TITLE } from '@api/videos/constants';

export class QueryFindDto {
  @IsOptional()
  @IsString()
  @MaxLength(MAX_LENGTH_VIDEO_TITLE)
  @ApiProperty({ required: false })
  search: string;
}
