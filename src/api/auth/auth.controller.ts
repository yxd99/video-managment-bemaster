import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from '@api/auth/auth.service';
import { LoginDto } from '@api/auth/dto/login.dto';
import { Public } from '@root/decorators';
import { ResponseHttp } from '@root/interface';
import { CreateUserDto } from '@root/users/dto/create-user.dto';

@Public()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'returns a jwt if the user succeeded in registering.',
  })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() body: CreateUserDto): Promise<ResponseHttp> {
    const response = await this.authService.register(body);
    if (response?.error) {
      throw new BadRequestException(response.error);
    }
    const { token } = await this.login({
      email: body.email,
      password: body.validatePassword,
    });
    return {
      token,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto): Promise<ResponseHttp> {
    const { error, token } = await this.authService.login(body);
    if (error) {
      throw new BadRequestException(error);
    }
    return { token };
  }
}
