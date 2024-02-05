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
import { AuthType } from '@api/auth/auth.type';
import { LoginDto } from '@api/auth/dto/login.dto';
import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { Public } from '@common/guards/public.guard';
import { authSchema } from '@schemas/index';

@Public()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse(authSchema.register.createdSchema)
  @ApiBadRequestResponse(authSchema.register.badRequestSchema)
  @ApiConflictResponse(authSchema.register.conflictSchema)
  @ApiBody({ type: CreateUserDto })
  async register(@Body() body: CreateUserDto): Promise<AuthType> {
    await this.authService.register(body);
    return this.login({
      email: body.email,
      password: body.validatePassword,
    });
  }

  /**
   * Handles the user login process.
   * Calls the `login` method of the `AuthService` to validate the user's credentials and generate a token.
   * Returns the generated token.
   *
   * @param body - The login credentials.
   * @returns The generated token.
   */
  @Post('login')
  @ApiUnauthorizedResponse(authSchema.login.unauhtorizedSchema)
  @ApiOkResponse(authSchema.login.okSchema)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto): Promise<AuthType> {
    const response = await this.authService.login(body);

    const { token } = response;
    return { token };
  }
}
