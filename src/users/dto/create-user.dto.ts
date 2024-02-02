import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  username: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(16)
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(16)
  validatePassword: string;
}
