import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import * as user from '@api/users/constants';
import { Match } from '@shared/decorators';

export class CreateUserDto {
  @IsString()
  @MinLength(user.MIN_LENGTH_USERNAME)
  @MaxLength(user.MAX_LENGTH_USERNAME)
  @ApiProperty({
    minLength: user.MIN_LENGTH_USERNAME,
    maxLength: user.MAX_LENGTH_USERNAME,
    description: 'field for save user',
    example: 'jhon doe',
  })
  username: string;

  @IsEmail()
  @MaxLength(user.MAX_LENGTH_EMAIL)
  @ApiProperty({
    maxLength: user.MAX_LENGTH_EMAIL,
    description: 'email for register in the system',
    format: 'email',
  })
  email: string;

  @IsString()
  @MinLength(user.MIN_LENGTH_PASSWORD)
  @MaxLength(user.MAX_LENGTH_PASSWORD)
  @ApiProperty({
    minLength: user.MIN_LENGTH_PASSWORD,
    maxLength: user.MAX_LENGTH_PASSWORD,
    description: 'password for the account',
  })
  password: string;

  @IsString()
  @MinLength(user.MIN_LENGTH_PASSWORD)
  @MaxLength(user.MAX_LENGTH_PASSWORD)
  @Match('password')
  @ApiProperty({
    minLength: user.MIN_LENGTH_PASSWORD,
    maxLength: user.MAX_LENGTH_PASSWORD,
    description: 'value should be equal to password',
  })
  validatePassword: string;
}
