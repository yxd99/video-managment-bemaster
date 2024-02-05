import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from '@api/auth/auth.service';
import { Auth } from '@api/auth/auth.type';
import { LoginDto } from '@api/auth/dto/login.dto';
import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { Public } from '@common/guards/public.guard';
import { authSchemas } from '@schemas/index';

@Public()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse(authSchemas.register.createdSchema)
  @ApiBadRequestResponse(authSchemas.register.badRequestSchema)
  @ApiConflictResponse(authSchemas.register.conflictSchema)
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
  @ApiUnauthorizedResponse(authSchemas.login.unauhtorizedSchema)
  @ApiOkResponse(authSchemas.login.okSchema)
  @HttpCode(HttpStatus.OK)
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
