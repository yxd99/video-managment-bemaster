import { IsString, MaxLength } from 'class-validator';

import { MAX_LENGTH_COMMENT } from '@api/comments/constants';

export class UpdateCommentDto {
  @IsString()
  @MaxLength(MAX_LENGTH_COMMENT)
  comment: string;
}
