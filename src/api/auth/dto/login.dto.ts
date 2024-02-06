import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import * as user from '@api/users/constants';

export class LoginDto {
  @IsEmail()
  @MaxLength(user.MAX_LENGTH_EMAIL)
  @ApiProperty({
    maxLength: user.MAX_LENGTH_EMAIL,
    format: 'email',
  })
  email: string;

  @IsString()
  @MinLength(user.MIN_LENGTH_PASSWORD)
  @MaxLength(user.MAX_LENGTH_PASSWORD)
  @ApiProperty({
    minLength: user.MIN_LENGTH_PASSWORD,
    maxLength: user.MAX_LENGTH_PASSWORD,
  })
  password: string;
}
