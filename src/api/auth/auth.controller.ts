import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from '@api/auth/auth.service';
import { Auth } from '@api/auth/auth.type';
import { LoginDto } from '@api/auth/dto/login.dto';
import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { Public } from '@common/guards/public.guard';
import { ServiceResponse } from '@shared/types';

@Public()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns a JWT if the user succeeded in registering.',
  })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() body: CreateUserDto): Promise<Auth | ServiceResponse> {
    const response = await this.authService.register(body);
    if ('error' in response) {
      throw response;
    }

    return this.login({
      email: body.email,
      password: body.validatePassword,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto): Promise<Auth> {
    const response = await this.authService.login(body);
    if ('error' in response) {
      throw response;
    }

    const { token } = response as Auth;
    return { token };
  }
}
