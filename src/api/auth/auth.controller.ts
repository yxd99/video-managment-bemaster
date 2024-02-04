import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from '@api/auth/auth.service';
import { Auth } from '@api/auth/auth.type';
import { LoginDto } from '@api/auth/dto/login.dto';
import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { Public } from '@common/guards/public.guard';
import { auth } from '@common/schemas';

@Public()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse(auth.createdSchema)
  @ApiBadRequestResponse(auth.badRequestSchema)
  @ApiConflictResponse(auth.conflictSchema)
  @ApiBody({ type: CreateUserDto })
  async register(@Body() body: CreateUserDto): Promise<Auth> {
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
  @ApiResponse({
    description: 'Returns a JWT if the login is successful.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Returns an error if the login credentials are invalid.',
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
