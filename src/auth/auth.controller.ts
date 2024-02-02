import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { Public } from '@/auth/decorators/set-metadata';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<object> {
    const response = await this.authService.register(body);
    if (response?.error) {
      throw new BadRequestException(response.error);
    }
    const token = await this.login({
      email: body.email,
      password: body.validatePassword,
    });
    return {
      token: token,
    };
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<object> {
    const response = await this.authService.login(body);
    if (response?.error) {
      throw new BadRequestException(response.error);
    }
    return response;
  }
}
