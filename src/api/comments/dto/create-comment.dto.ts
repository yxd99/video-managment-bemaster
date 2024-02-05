import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

import { MAX_LENGTH_COMMENT } from '@api/comments/constants';

export class CreateCommentDto {
  @IsString()
  @MaxLength(MAX_LENGTH_COMMENT)
  @ApiProperty({ maxLength: MAX_LENGTH_COMMENT })
  comment: string;
}
